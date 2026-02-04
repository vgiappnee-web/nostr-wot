"use client";

import { useCallback, useEffect, useRef } from "react";
import { useGraph } from "@/contexts/GraphContext";
import { useNostrAuth } from "@/contexts/NostrAuthContext";
import { useWotExtension } from "@/hooks/useWotExtension";
import {
  GraphData,
  GraphNode,
  GraphEdge,
  NodeProfile,
} from "@/lib/graph/types";
import { formatPubkey } from "@/lib/graph/transformers";
import { calculateTrustScore } from "@/lib/graph/colors";

// Relay configuration
const RELAYS = [
  "wss://relay.damus.io",
  "wss://relay.nostr.band",
  "wss://nos.lol",
  "wss://relay.snort.social",
];

/**
 * Hook to fetch and manage graph data
 * Uses nostr-wot-sdk for trust queries (extension + oracle fallback)
 */
export function useGraphData() {
  const { user, profile: userProfile } = useNostrAuth();
  const {
    setData,
    mergeData,
    setRoot,
    setLoading,
    setError,
    addProfiles,
    expandNode,
    state,
  } = useGraph();

  // WoT SDK for trust queries - pass user pubkey for initialization
  const {
    isAvailable: sdkAvailable,
    isUsingExtension,
    batchGetWotData,
    getFollows: sdkGetFollows,
  } = useWotExtension(user?.pubkey);

  // Use refs to avoid stale closures
  const stateRef = useRef(state);
  stateRef.current = state;

  const profileCacheRef = useRef<Map<string, NodeProfile>>(new Map());
  const expandingNodesRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);
  const sdkAvailableRef = useRef(sdkAvailable);
  const isUsingExtensionRef = useRef(isUsingExtension);
  sdkAvailableRef.current = sdkAvailable;
  isUsingExtensionRef.current = isUsingExtension;

  /**
   * Fetch follows list - uses SDK when extension available, falls back to relays
   */
  const fetchFollows = useCallback(
    async (pubkey: string): Promise<string[]> => {
      console.log("[fetchFollows] Starting for pubkey:", pubkey.slice(0, 8));
      console.log("[fetchFollows] isUsingExtension:", isUsingExtensionRef.current);

      // Try SDK first if extension is available (faster and more complete)
      if (isUsingExtensionRef.current) {
        try {
          console.log("[fetchFollows] Trying SDK getFollows...");
          const follows = await sdkGetFollows(pubkey);
          console.log("[fetchFollows] SDK returned:", follows?.length, "follows");
          if (follows && follows.length > 0) {
            return follows;
          }
        } catch (err) {
          console.warn("[fetchFollows] SDK getFollows failed:", err);
        }
      }

      // Fallback to relay fetching
      console.log("[fetchFollows] Using relay fallback...");
      return new Promise((resolve) => {
        const follows = new Set<string>();
        let resolved = false;

        // Timeout for relay fetching
        const timeoutId = setTimeout(() => {
          if (!resolved) {
            console.log("[fetchFollows] Timeout reached, returning", follows.size, "follows");
            resolved = true;
            resolve(Array.from(follows));
          }
        }, 8000);

        let completedRelays = 0;
        let gotData = false;

        for (const relayUrl of RELAYS) {
          try {
            const ws = new WebSocket(relayUrl);
            const subId = `f-${pubkey.slice(0, 8)}-${Date.now()}`;

            ws.onopen = () => {
              console.log("[fetchFollows] Connected to", relayUrl);
              ws.send(
                JSON.stringify([
                  "REQ",
                  subId,
                  { kinds: [3], authors: [pubkey], limit: 1 },
                ])
              );
            };

            ws.onmessage = (event) => {
              try {
                const data = JSON.parse(event.data);
                if (data[0] === "EVENT" && data[2]?.kind === 3) {
                  const tags = data[2].tags || [];
                  console.log("[fetchFollows] Got kind:3 event from", relayUrl, "with", tags.length, "tags");
                  for (const tag of tags) {
                    if (tag[0] === "p" && tag[1]) {
                      follows.add(tag[1]);
                    }
                  }
                  gotData = true;
                } else if (data[0] === "EOSE") {
                  ws.close();
                  // Resolve early if we got data
                  if (gotData && !resolved) {
                    console.log("[fetchFollows] Got data, resolving with", follows.size, "follows");
                    clearTimeout(timeoutId);
                    resolved = true;
                    resolve(Array.from(follows));
                  }
                }
              } catch (e) {
                console.warn("[fetchFollows] Parse error:", e);
              }
            };

            ws.onerror = (e) => {
              console.warn("[fetchFollows] WebSocket error for", relayUrl, e);
              completedRelays++;
              if (completedRelays >= RELAYS.length && !resolved) {
                console.log("[fetchFollows] All relays completed (with errors), returning", follows.size, "follows");
                clearTimeout(timeoutId);
                resolved = true;
                resolve(Array.from(follows));
              }
            };

            ws.onclose = () => {
              completedRelays++;
              if (completedRelays >= RELAYS.length && !resolved) {
                console.log("[fetchFollows] All relays closed, returning", follows.size, "follows");
                clearTimeout(timeoutId);
                resolved = true;
                resolve(Array.from(follows));
              }
            };
          } catch (e) {
            console.error("[fetchFollows] Failed to create WebSocket for", relayUrl, e);
            completedRelays++;
          }
        }
      });
    },
    [sdkGetFollows]
  );

  /**
   * Fetch profiles for multiple pubkeys (non-blocking, returns quickly)
   */
  const fetchProfiles = useCallback(
    async (pubkeys: string[]): Promise<Map<string, NodeProfile>> => {
      const profiles = new Map<string, NodeProfile>();

      // Return cached profiles immediately
      pubkeys.forEach((pk) => {
        const cached = profileCacheRef.current.get(pk);
        if (cached) profiles.set(pk, cached);
      });

      const toFetch = pubkeys.filter((pk) => !profileCacheRef.current.has(pk));
      if (toFetch.length === 0) return profiles;

      // Fetch in background, don't block
      return new Promise((resolve) => {
        let resolved = false;

        // Short timeout - profiles are nice-to-have
        const timeoutId = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            resolve(profiles);
          }
        }, 3000);

        const ws = new WebSocket(RELAYS[0]);

        ws.onopen = () => {
          // Fetch in batches of 100
          const batch = toFetch.slice(0, 100);
          ws.send(
            JSON.stringify([
              "REQ",
              `p-${Date.now()}`,
              { kinds: [0], authors: batch, limit: batch.length },
            ])
          );
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data[0] === "EVENT" && data[2]?.kind === 0) {
              const pubkey = data[2].pubkey;
              const content = JSON.parse(data[2].content);
              const profile: NodeProfile = {
                pubkey,
                name: content.name,
                displayName: content.display_name,
                picture: content.picture,
                about: content.about,
                nip05: content.nip05,
              };
              profiles.set(pubkey, profile);
              profileCacheRef.current.set(pubkey, profile);
            } else if (data[0] === "EOSE") {
              ws.close();
              if (!resolved) {
                clearTimeout(timeoutId);
                resolved = true;
                resolve(profiles);
              }
            }
          } catch {
            // Ignore
          }
        };

        ws.onerror = () => {
          if (!resolved) {
            clearTimeout(timeoutId);
            resolved = true;
            resolve(profiles);
          }
        };

        ws.onclose = () => {
          if (!resolved) {
            clearTimeout(timeoutId);
            resolved = true;
            resolve(profiles);
          }
        };
      });
    },
    []
  );

  /**
   * Build initial graph with only the root node
   * Follows are loaded on-demand when user clicks nodes
   */
  const buildInitialGraph = useCallback(async () => {
    if (!user?.pubkey || initializedRef.current) return;

    initializedRef.current = true;
    setLoading(true);
    setError(null);

    try {
      setRoot(user.pubkey);

      // Create root node immediately with available data
      const rootProfile = {
        pubkey: user.pubkey,
        name: userProfile?.name,
        displayName: userProfile?.display_name,
        picture: userProfile?.picture,
      };

      const graphData: GraphData = {
        nodes: [
          {
            id: user.pubkey,
            label:
              rootProfile.displayName ||
              rootProfile.name ||
              formatPubkey(user.pubkey),
            picture: rootProfile.picture,
            distance: 0,
            pathCount: 1,
            trustScore: 1,
            isRoot: true,
            isMutual: false,
          },
        ],
        links: [],
      };

      setData(graphData);

      // Fetch profile in background (non-blocking)
      fetchProfiles([user.pubkey]).then((profiles) => {
        if (profiles.size > 0) {
          addProfiles(profiles);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load graph");
    } finally {
      setLoading(false);
    }
  }, [
    user?.pubkey,
    userProfile,
    fetchProfiles,
    setData,
    setRoot,
    setLoading,
    setError,
    addProfiles,
  ]);

  /**
   * Expand a node to load its follows
   * Uses WoT extension for trust scores when available
   */
  const expandNodeFollows = useCallback(
    async (pubkey: string) => {
      console.log("[expandNodeFollows] Called for pubkey:", pubkey.slice(0, 8));

      // Check if already expanding this node
      if (expandingNodesRef.current.has(pubkey)) {
        console.log("[expandNodeFollows] Already expanding, skipping");
        return;
      }

      // Use ref for current state to avoid stale closure
      const currentState = stateRef.current;
      if (currentState.expandedNodes.has(pubkey)) {
        console.log("[expandNodeFollows] Already expanded, skipping");
        return;
      }

      // Find the node to get its distance
      const node = currentState.data.nodes.find((n) => n.id === pubkey);
      const parentDistance = node?.distance ?? 0;
      console.log("[expandNodeFollows] Node distance:", parentDistance);

      // Don't expand beyond distance 3
      if (parentDistance >= 3) {
        console.log("[expandNodeFollows] Distance >= 3, skipping");
        return;
      }

      // Mark as expanding
      expandingNodesRef.current.add(pubkey);
      expandNode(pubkey);
      setLoading(true);

      try {
        // Fetch follows from relays
        console.log("[expandNodeFollows] Fetching follows...");
        const follows = await fetchFollows(pubkey);
        console.log("[expandNodeFollows] Got", follows.length, "follows");

        if (follows.length === 0) {
          console.log("[expandNodeFollows] No follows found");
          return;
        }

        // Get current state again (may have changed)
        const latestState = stateRef.current;
        const existingIds = new Set(latestState.data.nodes.map((n) => n.id));
        const newPubkeys = follows.filter((pk) => !existingIds.has(pk));

        // Get trust scores from SDK only when using extension (oracle has rate limits)
        let wotData: Map<string, { distance: number; trustScore: number }> | null = null;
        if (isUsingExtensionRef.current && newPubkeys.length > 0) {
          try {
            console.log("[expandNodeFollows] Getting WoT data from extension...");
            wotData = await batchGetWotData(newPubkeys);
          } catch (err) {
            console.warn("[expandNodeFollows] Extension query failed:", err);
          }
        }

        // Create new nodes and edges
        const newNodes: GraphNode[] = [];
        const newLinks: GraphEdge[] = [];

        for (const followPubkey of follows) {
          // Get trust score from extension or calculate
          const extData = wotData?.get(followPubkey);
          const distance = extData?.distance ?? parentDistance + 1;
          const trustScore = extData?.trustScore ?? calculateTrustScore(distance, 1);

          // Always add link
          newLinks.push({
            source: pubkey,
            target: followPubkey,
            type: "follow",
            strength: trustScore,
            bidirectional: false,
          });

          // Only add node if new
          if (!existingIds.has(followPubkey)) {
            const cachedProfile = profileCacheRef.current.get(followPubkey);
            newNodes.push({
              id: followPubkey,
              label:
                cachedProfile?.displayName ||
                cachedProfile?.name ||
                formatPubkey(followPubkey),
              picture: cachedProfile?.picture,
              distance,
              pathCount: 1,
              trustScore,
              isRoot: false,
              isMutual: false,
            });
          }
        }

        // Merge data immediately
        if (newNodes.length > 0 || newLinks.length > 0) {
          mergeData({ nodes: newNodes, links: newLinks });
        }

        // Fetch profiles in background (non-blocking)
        if (newPubkeys.length > 0) {
          fetchProfiles(newPubkeys).then((profiles) => {
            if (profiles.size > 0) {
              addProfiles(profiles);
            }
          });
        }
      } catch (err) {
        console.error("Failed to expand node:", err);
      } finally {
        expandingNodesRef.current.delete(pubkey);
        setLoading(false);
      }
    },
    [expandNode, fetchFollows, fetchProfiles, addProfiles, mergeData, setLoading, batchGetWotData]
  );

  // Reset refs when user changes
  useEffect(() => {
    initializedRef.current = false;
    expandingNodesRef.current.clear();
  }, [user?.pubkey]);

  // Build initial graph when user logs in
  useEffect(() => {
    if (user?.pubkey && state.data.nodes.length === 0) {
      buildInitialGraph();
    }
  }, [user?.pubkey, state.data.nodes.length, buildInitialGraph]);

  return {
    buildInitialGraph,
    expandNodeFollows,
    fetchProfiles,
    isLoading: state.isLoading,
    error: state.error,
    sdkAvailable,
    isUsingExtension,
  };
}

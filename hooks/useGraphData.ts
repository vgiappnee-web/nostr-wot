"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGraph } from "@/contexts/GraphContext";
import { useWoTContext } from "nostr-wot-sdk/react";
import {
  GraphData,
  GraphNode,
  GraphEdge,
  NodeProfile,
} from "@/lib/graph/types";
import { formatPubkey } from "@/lib/graph/transformers";
import { calculateTrustScore } from "@/lib/graph/colors";
import {
  getCachedProfiles,
  cacheProfiles,
  getPubkeysToFetch,
  getCachedTrustBatch,
  cacheTrustBatch,
  TrustData,
} from "@/lib/cache/profileCache";

// Relays for profile fetching only
const PROFILE_RELAYS = [
  "wss://relay.damus.io",
  "wss://relay.nostr.band",
];

/**
 * Hook to fetch and manage graph data
 * Uses WoT extension via SDK for all graph operations
 */
export function useGraphData() {
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

  // Get WoT instance from SDK context
  const { wot, isReady } = useWoTContext();

  // Track user pubkey
  const [userPubkey, setUserPubkey] = useState<string | null>(null);

  // Use refs to avoid stale closures
  const stateRef = useRef(state);
  stateRef.current = state;

  const profileCacheRef = useRef<Map<string, NodeProfile>>(new Map());
  const expandingNodesRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);
  const wotRef = useRef(wot);
  wotRef.current = wot;

  // Get user pubkey when WoT is ready
  useEffect(() => {
    const getPubkey = async () => {
      if (wot && isReady) {
        try {
          const pubkey = await wot.getMyPubkey();
          if (pubkey) {
            setUserPubkey(pubkey);
            console.log("[useGraphData] Got user pubkey:", pubkey.slice(0, 8));
          }
        } catch (err) {
          console.error("[useGraphData] Failed to get pubkey:", err);
        }
      }
    };
    getPubkey();
  }, [wot, isReady]);

  /**
   * Fetch profiles for multiple pubkeys (optional, non-blocking)
   * Uses localStorage cache first
   */
  const fetchProfiles = useCallback(
    async (pubkeys: string[]): Promise<Map<string, NodeProfile>> => {
      // First, get all cached profiles (localStorage + memory ref)
      const cachedFromStorage = getCachedProfiles(pubkeys);
      const profiles = new Map<string, NodeProfile>(cachedFromStorage);

      // Also check memory cache for any additional
      pubkeys.forEach((pk) => {
        if (!profiles.has(pk)) {
          const cached = profileCacheRef.current.get(pk);
          if (cached) profiles.set(pk, cached);
        }
      });

      // Filter to pubkeys that need fetching
      const toFetch = getPubkeysToFetch(pubkeys.filter((pk) => !profiles.has(pk)));
      if (toFetch.length === 0) return profiles;

      return new Promise((resolve) => {
        let resolved = false;
        const newProfiles: NodeProfile[] = [];

        const timeoutId = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            // Cache new profiles to localStorage
            if (newProfiles.length > 0) {
              cacheProfiles(newProfiles);
            }
            resolve(profiles);
          }
        }, 3000);

        const ws = new WebSocket(PROFILE_RELAYS[0]);

        ws.onopen = () => {
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
              newProfiles.push(profile);
            } else if (data[0] === "EOSE") {
              ws.close();
              if (!resolved) {
                clearTimeout(timeoutId);
                resolved = true;
                // Cache new profiles to localStorage
                if (newProfiles.length > 0) {
                  cacheProfiles(newProfiles);
                }
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
            if (newProfiles.length > 0) {
              cacheProfiles(newProfiles);
            }
            resolve(profiles);
          }
        };

        ws.onclose = () => {
          if (!resolved) {
            clearTimeout(timeoutId);
            resolved = true;
            if (newProfiles.length > 0) {
              cacheProfiles(newProfiles);
            }
            resolve(profiles);
          }
        };
      });
    },
    []
  );

  /**
   * Build initial graph with only the root node
   */
  const buildInitialGraph = useCallback(async () => {
    if (!userPubkey || initializedRef.current) return;

    initializedRef.current = true;
    setLoading(true);
    setError(null);

    try {
      setRoot(userPubkey);

      const graphData: GraphData = {
        nodes: [
          {
            id: userPubkey,
            label: formatPubkey(userPubkey),
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

      // Fetch profile in background
      fetchProfiles([userPubkey]).then((profiles) => {
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
    userPubkey,
    fetchProfiles,
    setData,
    setRoot,
    setLoading,
    setError,
    addProfiles,
  ]);

  /**
   * Expand a node to load its follows using extension
   */
  const expandNodeFollows = useCallback(
    async (pubkey: string) => {
      console.log("[expandNodeFollows] Called for pubkey:", pubkey.slice(0, 8));

      if (!wotRef.current) {
        console.log("[expandNodeFollows] WoT not available");
        setError("WoT extension required");
        return;
      }

      if (expandingNodesRef.current.has(pubkey)) {
        console.log("[expandNodeFollows] Already expanding, skipping");
        return;
      }

      const currentState = stateRef.current;
      if (currentState.expandedNodes.has(pubkey)) {
        console.log("[expandNodeFollows] Already expanded, skipping");
        return;
      }

      const node = currentState.data.nodes.find((n) => n.id === pubkey);
      const parentDistance = node?.distance ?? 0;
      console.log("[expandNodeFollows] Node distance:", parentDistance);

      if (parentDistance >= 3) {
        console.log("[expandNodeFollows] Distance >= 3, skipping");
        return;
      }

      expandingNodesRef.current.add(pubkey);
      expandNode(pubkey);
      setLoading(true);

      try {
        // Get follows from extension
        console.log("[expandNodeFollows] Fetching follows from extension...");
        const follows = await wotRef.current.getFollows(pubkey);
        console.log("[expandNodeFollows] Got", follows?.length || 0, "follows");

        if (!follows || follows.length === 0) {
          console.log("[expandNodeFollows] No follows found");
          return;
        }

        const latestState = stateRef.current;
        const existingIds = new Set(latestState.data.nodes.map((n) => n.id));
        const newPubkeys = follows.filter((pk: string) => !existingIds.has(pk));

        // Get trust data - first from cache, then from extension for uncached
        // We only store distance and paths, score is calculated on the fly
        const wotData = new Map<string, { distance: number; paths: number | null }>();

        // Track pubkeys that need paths rechecked (cached with null paths)
        const needsPathsRecheck: string[] = [];

        if (newPubkeys.length > 0) {
          // Get cached trust data first
          const cachedTrust = getCachedTrustBatch(newPubkeys);
          cachedTrust.forEach((trust, pk) => {
            wotData.set(pk, {
              distance: trust.distance ?? parentDistance + 1,
              paths: trust.paths,
            });
            // Track cached entries that need paths recheck
            if (trust.paths === null && trust.distance !== null) {
              needsPathsRecheck.push(pk);
            }
          });

          // Fetch trust for uncached pubkeys
          const uncachedPubkeys = newPubkeys.filter((pk) => !cachedTrust.has(pk));
          if (uncachedPubkeys.length > 0) {
            try {
              console.log("[expandNodeFollows] Getting WoT data for", uncachedPubkeys.length, "pubkeys...");
              const batchResults = await wotRef.current.batchCheck(uncachedPubkeys);
              const newTrustData = new Map<string, TrustData>();

              for (const [pk, result] of batchResults) {
                const distance = result.distance ?? parentDistance + 1;
                wotData.set(pk, {
                  distance,
                  paths: null, // We don't fetch paths in expand to save time
                });
                newTrustData.set(pk, {
                  distance,
                  paths: null,
                });
                // New entries also need paths recheck
                needsPathsRecheck.push(pk);
              }

              // Cache the new trust data
              if (newTrustData.size > 0) {
                cacheTrustBatch(newTrustData);
              }
            } catch (err) {
              console.warn("[expandNodeFollows] Batch check failed:", err);
            }
          }
        }

        const newNodes: GraphNode[] = [];
        const newLinks: GraphEdge[] = [];

        for (const followPubkey of follows) {
          const extData = wotData.get(followPubkey);
          const distance = extData?.distance ?? parentDistance + 1;
          const pathCount = extData?.paths ?? 1;
          // Always calculate score on the fly (no config here, uses defaults)
          const trustScore = calculateTrustScore(distance, pathCount);

          newLinks.push({
            source: pubkey,
            target: followPubkey,
            type: "follow",
            strength: trustScore,
            bidirectional: false,
          });

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

        if (newNodes.length > 0 || newLinks.length > 0) {
          mergeData({ nodes: newNodes, links: newLinks });
        }

        if (newPubkeys.length > 0) {
          fetchProfiles(newPubkeys).then((profiles) => {
            if (profiles.size > 0) {
              addProfiles(profiles);
            }
          });
        }

        // Recheck paths in background for entries that have paths: null
        if (needsPathsRecheck.length > 0 && wotRef.current) {
          recheckPathsInBackground(needsPathsRecheck);
        }
      } catch (err) {
        console.error("Failed to expand node:", err);
      } finally {
        expandingNodesRef.current.delete(pubkey);
        setLoading(false);
      }
    },
    [expandNode, fetchProfiles, addProfiles, mergeData, setLoading, setError]
  );

  /**
   * Recheck paths in background for cached entries with null paths
   */
  const recheckPathsInBackground = useCallback(async (pubkeys: string[]) => {
    if (!wotRef.current || pubkeys.length === 0) return;

    for (const pk of pubkeys) {
      try {
        const details = await wotRef.current.getDetails(pk);
        if (details?.paths !== undefined) {
          const cached = getCachedTrustBatch([pk]).get(pk);
          if (cached) {
            const updatedTrust: TrustData = {
              ...cached,
              paths: details.paths,
            };
            cacheTrustBatch(new Map([[pk, updatedTrust]]));
          }
        }
      } catch {
        // Ignore - keep using cached data without paths
      }

      // Small delay to avoid overwhelming the extension
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }, []);

  // Reset refs when user changes
  useEffect(() => {
    initializedRef.current = false;
    expandingNodesRef.current.clear();
  }, [userPubkey]);

  // Build initial graph when ready
  useEffect(() => {
    if (isReady && userPubkey && state.data.nodes.length === 0) {
      buildInitialGraph();
    }
  }, [isReady, userPubkey, state.data.nodes.length, buildInitialGraph]);

  return {
    buildInitialGraph,
    expandNodeFollows,
    fetchProfiles,
    isLoading: state.isLoading,
    error: state.error,
    isReady,
    userPubkey,
  };
}

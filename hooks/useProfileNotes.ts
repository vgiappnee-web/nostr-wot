"use client";

import { useState, useCallback, useRef } from "react";
import { NostrNote } from "@/lib/graph/types";

// Same relays as useGraphData
const RELAYS = [
  "wss://relay.damus.io",
  "wss://relay.nostr.band",
  "wss://nos.lol",
  "wss://relay.snort.social",
];

const NOTES_PER_PAGE = 20;
const RELAY_TIMEOUT = 10000;

interface UseProfileNotesResult {
  notes: NostrNote[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  fetchNotes: (pubkey: string) => Promise<void>;
  loadMore: () => Promise<void>;
  reset: () => void;
}

/**
 * Hook to fetch user's posts (kind:1 events) from Nostr relays
 */
export function useProfileNotes(): UseProfileNotesResult {
  const [notes, setNotes] = useState<NostrNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentPubkeyRef = useRef<string | null>(null);
  const oldestTimestampRef = useRef<number | null>(null);

  /**
   * Fetch notes from relays
   */
  const fetchNotesFromRelays = useCallback(
    async (
      pubkey: string,
      until?: number
    ): Promise<NostrNote[]> => {
      return new Promise((resolve) => {
        const notesMap = new Map<string, NostrNote>();
        let resolved = false;
        let completedRelays = 0;

        const timeoutId = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            resolve(Array.from(notesMap.values()));
          }
        }, RELAY_TIMEOUT);

        for (const relayUrl of RELAYS) {
          try {
            const ws = new WebSocket(relayUrl);
            const subId = `notes-${Date.now()}-${Math.random()}`;

            ws.onopen = () => {
              const filter: Record<string, unknown> = {
                kinds: [1],
                authors: [pubkey],
                limit: NOTES_PER_PAGE,
              };

              if (until) {
                filter.until = until;
              }

              ws.send(JSON.stringify(["REQ", subId, filter]));
            };

            ws.onmessage = (event) => {
              try {
                const data = JSON.parse(event.data);
                if (data[0] === "EVENT" && data[2]?.kind === 1) {
                  const note: NostrNote = {
                    id: data[2].id,
                    pubkey: data[2].pubkey,
                    content: data[2].content,
                    created_at: data[2].created_at,
                    tags: data[2].tags || [],
                    kind: 1,
                    sig: data[2].sig,
                  };
                  // Deduplicate by ID
                  if (!notesMap.has(note.id)) {
                    notesMap.set(note.id, note);
                  }
                } else if (data[0] === "EOSE") {
                  ws.close();
                }
              } catch {
                // Ignore parse errors
              }
            };

            ws.onerror = () => {
              completedRelays++;
              if (completedRelays >= RELAYS.length && !resolved) {
                clearTimeout(timeoutId);
                resolved = true;
                resolve(Array.from(notesMap.values()));
              }
            };

            ws.onclose = () => {
              completedRelays++;
              if (completedRelays >= RELAYS.length && !resolved) {
                clearTimeout(timeoutId);
                resolved = true;
                resolve(Array.from(notesMap.values()));
              }
            };
          } catch {
            completedRelays++;
          }
        }
      });
    },
    []
  );

  /**
   * Fetch initial notes for a pubkey
   */
  const fetchNotes = useCallback(
    async (pubkey: string) => {
      setIsLoading(true);
      setError(null);
      setNotes([]);
      setHasMore(true);
      currentPubkeyRef.current = pubkey;
      oldestTimestampRef.current = null;

      try {
        const fetchedNotes = await fetchNotesFromRelays(pubkey);

        // Sort by created_at descending
        const sortedNotes = fetchedNotes.sort(
          (a, b) => b.created_at - a.created_at
        );

        setNotes(sortedNotes);

        // Track oldest timestamp for pagination
        if (sortedNotes.length > 0) {
          oldestTimestampRef.current =
            sortedNotes[sortedNotes.length - 1].created_at;
        }

        // Check if we have more
        setHasMore(sortedNotes.length >= NOTES_PER_PAGE);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch notes");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchNotesFromRelays]
  );

  /**
   * Load more notes (pagination)
   */
  const loadMore = useCallback(async () => {
    if (
      !currentPubkeyRef.current ||
      !oldestTimestampRef.current ||
      isLoading ||
      !hasMore
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const fetchedNotes = await fetchNotesFromRelays(
        currentPubkeyRef.current,
        oldestTimestampRef.current - 1 // -1 to exclude the last note
      );

      // Sort and filter duplicates
      const sortedNotes = fetchedNotes.sort(
        (a, b) => b.created_at - a.created_at
      );

      // Filter out notes we already have
      const existingIds = new Set(notes.map((n) => n.id));
      const newNotes = sortedNotes.filter((n) => !existingIds.has(n.id));

      if (newNotes.length > 0) {
        setNotes((prev) => [...prev, ...newNotes]);
        oldestTimestampRef.current = newNotes[newNotes.length - 1].created_at;
      }

      setHasMore(newNotes.length >= NOTES_PER_PAGE);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more notes");
    } finally {
      setIsLoading(false);
    }
  }, [fetchNotesFromRelays, notes, isLoading, hasMore]);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setNotes([]);
    setIsLoading(false);
    setHasMore(true);
    setError(null);
    currentPubkeyRef.current = null;
    oldestTimestampRef.current = null;
  }, []);

  return {
    notes,
    isLoading,
    hasMore,
    error,
    fetchNotes,
    loadMore,
    reset,
  };
}

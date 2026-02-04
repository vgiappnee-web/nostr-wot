"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { WoT } from "nostr-wot-sdk";

// Oracle URL for fallback
const ORACLE_URL = "https://wot-oracle.mappingbitcoin.com";

interface WotResult {
  pubkey: string;
  distance: number;
  trustScore: number;
  inWot: boolean;
}

/**
 * Hook to interact with WoT using nostr-wot-sdk
 * Prioritizes browser extension, falls back to oracle
 */
export function useWotExtension(userPubkey?: string) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isUsingExtension, setIsUsingExtension] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const wotRef = useRef<WoT | null>(null);
  const cacheRef = useRef<Map<string, WotResult>>(new Map());

  // Initialize WoT SDK
  useEffect(() => {
    const initWot = async () => {
      try {
        // Create WoT instance - prioritize extension
        const wot = new WoT({
          useExtension: true,
          fallback: userPubkey ? {
            oracle: ORACLE_URL,
            myPubkey: userPubkey,
          } : undefined,
        });

        wotRef.current = wot;

        // Check if using extension
        const usingExt = await wot.isUsingExtension();
        setIsUsingExtension(usingExt);
        setIsAvailable(true);
        setIsInitialized(true);
      } catch (err) {
        console.error("Failed to initialize WoT SDK:", err);

        // Try oracle-only mode if extension init failed
        if (userPubkey) {
          try {
            const wot = new WoT({
              oracle: ORACLE_URL,
              myPubkey: userPubkey,
            });
            wotRef.current = wot;
            setIsAvailable(true);
          } catch {
            setIsAvailable(false);
          }
        } else {
          setIsAvailable(false);
        }
        setIsInitialized(true);
      }
    };

    initWot();
  }, [userPubkey]);

  /**
   * Get distance to a single pubkey
   */
  const getDistance = useCallback(
    async (targetPubkey: string): Promise<number> => {
      if (!wotRef.current) return -1;

      // Check cache
      const cached = cacheRef.current.get(targetPubkey);
      if (cached) return cached.distance;

      try {
        const distance = await wotRef.current.getDistance(targetPubkey);
        return distance ?? -1;
      } catch (err) {
        console.error("SDK getDistance error:", err);
        return -1;
      }
    },
    []
  );

  /**
   * Get trust score for a single pubkey
   */
  const getTrustScore = useCallback(
    async (targetPubkey: string): Promise<number> => {
      if (!wotRef.current) return 0;

      // Check cache
      const cached = cacheRef.current.get(targetPubkey);
      if (cached) return cached.trustScore;

      try {
        const score = await wotRef.current.getTrustScore(targetPubkey);
        return score ?? 0;
      } catch (err) {
        console.error("SDK getTrustScore error:", err);
        return 0;
      }
    },
    []
  );

  /**
   * Check if pubkey is in WoT
   */
  const isInWoT = useCallback(
    async (targetPubkey: string): Promise<boolean> => {
      if (!wotRef.current) return false;

      // Check cache
      const cached = cacheRef.current.get(targetPubkey);
      if (cached) return cached.inWot;

      try {
        return await wotRef.current.isInMyWoT(targetPubkey);
      } catch (err) {
        console.error("SDK isInWoT error:", err);
        return false;
      }
    },
    []
  );

  /**
   * Get follows list (extension-only)
   */
  const getFollows = useCallback(
    async (pubkey?: string): Promise<string[]> => {
      if (!wotRef.current) return [];

      try {
        const follows = await wotRef.current.getFollows(pubkey);
        return follows ?? [];
      } catch (err) {
        console.error("SDK getFollows error:", err);
        return [];
      }
    },
    []
  );

  /**
   * Batch get WoT data for multiple pubkeys
   */
  const batchGetWotData = useCallback(
    async (pubkeys: string[]): Promise<Map<string, WotResult>> => {
      const results = new Map<string, WotResult>();

      if (!wotRef.current) {
        // Return default values if SDK not available
        for (const pk of pubkeys) {
          results.set(pk, {
            pubkey: pk,
            distance: -1,
            trustScore: 0,
            inWot: false,
          });
        }
        return results;
      }

      // Filter out cached
      const uncached: string[] = [];
      for (const pk of pubkeys) {
        const cached = cacheRef.current.get(pk);
        if (cached) {
          results.set(pk, cached);
        } else {
          uncached.push(pk);
        }
      }

      if (uncached.length === 0) return results;

      try {
        // Use batch queries for efficiency
        const [distances, scores] = await Promise.all([
          wotRef.current.getDistanceBatch(uncached),
          wotRef.current.getTrustScoreBatch(uncached),
        ]);

        // Process results
        for (const pk of uncached) {
          const distance = distances[pk] ?? -1;
          const trustScore = scores[pk] ?? 0;

          const result: WotResult = {
            pubkey: pk,
            distance,
            trustScore,
            inWot: distance !== null && distance > 0,
          };

          // Cache result
          cacheRef.current.set(pk, result);
          results.set(pk, result);
        }
      } catch (err) {
        console.error("SDK batch error:", err);
        // Set defaults for failed queries
        for (const pk of uncached) {
          const result: WotResult = {
            pubkey: pk,
            distance: -1,
            trustScore: 0,
            inWot: false,
          };
          results.set(pk, result);
        }
      }

      return results;
    },
    []
  );

  /**
   * Filter pubkeys by WoT
   */
  const filterByWoT = useCallback(
    async (pubkeys: string[]): Promise<string[]> => {
      if (!wotRef.current) return [];

      try {
        return await wotRef.current.filterByWoT(pubkeys);
      } catch (err) {
        console.error("SDK filterByWoT error:", err);
        return [];
      }
    },
    []
  );

  /**
   * Get graph stats (extension-only)
   */
  const getStats = useCallback(async () => {
    if (!wotRef.current) return null;

    try {
      return await wotRef.current.getStats();
    } catch {
      return null;
    }
  }, []);

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    isAvailable,
    isInitialized,
    isUsingExtension,
    getDistance,
    getTrustScore,
    isInWoT,
    getFollows,
    batchGetWotData,
    filterByWoT,
    getStats,
    clearCache,
  };
}

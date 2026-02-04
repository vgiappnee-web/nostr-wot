"use client";

import { useCallback, useEffect } from "react";
import { useGraph } from "@/contexts/GraphContext";
import { GraphFilters, DEFAULT_FILTERS } from "@/lib/graph/types";

const STORAGE_KEY = "graph_filters";

/**
 * Hook for managing graph filters with localStorage persistence
 */
export function useGraphFilters() {
  const { state, setFilters, resetFilters } = useGraph();
  const { filters } = state;

  // Load filters from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<GraphFilters>;
        setFilters(parsed);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [setFilters]);

  // Save filters to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {
      // Ignore localStorage errors
    }
  }, [filters]);

  /**
   * Update trust score filter
   */
  const setMinTrustScore = useCallback(
    (score: number) => {
      setFilters({ minTrustScore: Math.max(0, Math.min(1, score)) });
    },
    [setFilters]
  );

  /**
   * Update max distance filter
   */
  const setMaxDistance = useCallback(
    (distance: number) => {
      setFilters({ maxDistance: Math.max(1, Math.min(5, distance)) });
    },
    [setFilters]
  );

  /**
   * Toggle follows visibility
   */
  const toggleFollows = useCallback(() => {
    setFilters({ showFollows: !filters.showFollows });
  }, [filters.showFollows, setFilters]);

  /**
   * Toggle mutes visibility
   */
  const toggleMutes = useCallback(() => {
    setFilters({ showMutes: !filters.showMutes });
  }, [filters.showMutes, setFilters]);

  /**
   * Toggle mutual-only filter
   */
  const toggleMutualsOnly = useCallback(() => {
    setFilters({ showMutualsOnly: !filters.showMutualsOnly });
  }, [filters.showMutualsOnly, setFilters]);

  /**
   * Set search query
   */
  const setSearchQuery = useCallback(
    (query: string) => {
      setFilters({ searchQuery: query });
    },
    [setFilters]
  );

  /**
   * Clear search query
   */
  const clearSearch = useCallback(() => {
    setFilters({ searchQuery: "" });
  }, [setFilters]);

  /**
   * Reset all filters to defaults
   */
  const reset = useCallback(() => {
    resetFilters();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore localStorage errors
    }
  }, [resetFilters]);

  /**
   * Check if filters are at default values
   */
  const isDefault =
    filters.minTrustScore === DEFAULT_FILTERS.minTrustScore &&
    filters.maxDistance === DEFAULT_FILTERS.maxDistance &&
    filters.showFollows === DEFAULT_FILTERS.showFollows &&
    filters.showMutes === DEFAULT_FILTERS.showMutes &&
    filters.showMutualsOnly === DEFAULT_FILTERS.showMutualsOnly &&
    filters.searchQuery === DEFAULT_FILTERS.searchQuery;

  return {
    filters,
    setMinTrustScore,
    setMaxDistance,
    toggleFollows,
    toggleMutes,
    toggleMutualsOnly,
    setSearchQuery,
    clearSearch,
    reset,
    isDefault,
  };
}

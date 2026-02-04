"use client";

import { GraphProvider } from "@/contexts/GraphContext";
import { useGraphData } from "@/hooks/useGraphData";
import { GraphLayout } from "./layout";

/**
 * GraphPlayground - Main orchestrator for the WoT graph visualization
 *
 * This component wraps the graph visualization with the necessary providers
 * and handles the initial data fetching.
 */
export default function GraphPlayground() {
  return (
    <GraphProvider>
      <GraphPlaygroundContent />
    </GraphProvider>
  );
}

/**
 * Inner content component that uses the graph context
 */
function GraphPlaygroundContent() {
  // Initialize graph data fetching
  useGraphData();

  return (
    <div className="h-[calc(100vh-200px)] min-h-[500px] bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <GraphLayout />
    </div>
  );
}

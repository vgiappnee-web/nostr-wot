"use client";

import { useTranslations } from "next-intl";
import { useGraph } from "@/contexts/GraphContext";

export default function BottomStatsBar() {
  const t = useTranslations("playground");
  const { stats, state } = useGraph();
  const { isLoading } = state;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur border-t border-gray-700 px-4 py-2 z-10">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-6">
          {/* Nodes count */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400">{t("graph.nodes")}:</span>
            <span className="text-white font-medium">{stats.totalNodes}</span>
          </div>

          {/* Edges count */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400">{t("graph.edges")}:</span>
            <span className="text-white font-medium">{stats.totalEdges}</span>
          </div>

          {/* Average trust */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400">{t("graph.avgTrust")}:</span>
            <span className="text-white font-medium">
              {Math.round(stats.avgTrustScore * 100)}%
            </span>
          </div>

          {/* Max distance */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400">{t("graph.maxDistance")}:</span>
            <span className="text-white font-medium">{stats.maxDistance}</span>
          </div>

          {/* Mutuals count */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400">{t("graph.mutuals")}:</span>
            <span className="text-white font-medium">{stats.mutualCount}</span>
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-primary">
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm">{t("graph.loading")}</span>
          </div>
        )}
      </div>
    </div>
  );
}

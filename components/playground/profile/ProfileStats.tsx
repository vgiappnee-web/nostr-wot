"use client";

import { useTranslations } from "next-intl";
import { GraphNode } from "@/lib/graph/types";
import { getTrustClass, getTrustLabel } from "@/lib/graph/colors";
import { Badge, Button } from "@/components/ui";
import TrustPathDisplay from "../details/TrustPathDisplay";

interface ProfileStatsProps {
  node: GraphNode;
  onExpand?: () => void;
}

/**
 * Trust stats section for profile modal
 */
export default function ProfileStats({ node, onExpand }: ProfileStatsProps) {
  const t = useTranslations("playground");

  const trustClass = getTrustClass(node.trustScore);
  const trustLabel = getTrustLabel(node.trustScore);

  return (
    <div className="border-b border-gray-700">
      {/* Stats badges */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex flex-wrap gap-2">
          {/* Trust score */}
          <span
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${trustClass}`}
          >
            {Math.round(node.trustScore * 100)}% {trustLabel}
          </span>

          {/* Distance */}
          {node.isRoot ? (
            <Badge variant="primary">{t("graph.you")}</Badge>
          ) : (
            <Badge variant="neutral">
              {node.distance} {node.distance === 1 ? "hop" : "hops"}
            </Badge>
          )}

          {/* Path count */}
          {!node.isRoot && node.pathCount > 1 && (
            <Badge variant="neutral">
              {node.pathCount} {node.pathCount === 1 ? "path" : "paths"}
            </Badge>
          )}

          {/* Mutual */}
          {node.isMutual && <Badge variant="success">{t("graph.mutual")}</Badge>}
        </div>

        {/* Actions */}
        {!node.isRoot && node.distance < 3 && onExpand && (
          <div className="mt-4">
            <Button variant="secondary" size="sm" onClick={onExpand}>
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
                {t("graph.expandNode")}
              </span>
            </Button>
          </div>
        )}
      </div>

      {/* Trust path */}
      {!node.isRoot && (
        <div className="p-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">
            {t("graph.trustPath")}
          </h4>
          <TrustPathDisplay node={node} />
        </div>
      )}
    </div>
  );
}

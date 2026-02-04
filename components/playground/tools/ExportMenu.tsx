"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { useGraph } from "@/contexts/GraphContext";

interface ExportMenuProps {
  graphRef: React.RefObject<any>;
}

export default function ExportMenu({ graphRef }: ExportMenuProps) {
  const t = useTranslations("playground");
  const { filteredData, stats } = useGraph();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  // Export as PNG
  const handleExportPNG = useCallback(() => {
    if (!graphRef.current) return;

    try {
      // Get the canvas element
      const canvas = graphRef.current.renderer()?.domElement;
      if (!canvas) {
        console.error("Canvas not found");
        return;
      }

      // Create download link
      const link = document.createElement("a");
      link.download = `wot-graph-${new Date().toISOString().split("T")[0]}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to export PNG:", err);
    }

    setIsOpen(false);
  }, [graphRef]);

  // Export as JSON
  const handleExportJSON = useCallback(() => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      stats,
      nodes: filteredData.nodes.map((n) => ({
        id: n.id,
        label: n.label,
        distance: n.distance,
        trustScore: n.trustScore,
        isMutual: n.isMutual,
      })),
      edges: filteredData.links.map((l) => ({
        source: typeof l.source === "string" ? l.source : l.source.id,
        target: typeof l.target === "string" ? l.target : l.target.id,
        type: l.type,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.download = `wot-graph-${new Date().toISOString().split("T")[0]}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);

    setIsOpen(false);
  }, [filteredData, stats]);

  // Export as CSV
  const handleExportCSV = useCallback(() => {
    const headers = ["pubkey", "name", "distance", "trust_score", "is_mutual"];
    const rows = filteredData.nodes.map((n) => [
      n.id,
      `"${(n.label || "").replace(/"/g, '""')}"`,
      n.distance,
      n.trustScore,
      n.isMutual ? "true" : "false",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.download = `wot-graph-${new Date().toISOString().split("T")[0]}.csv`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);

    setIsOpen(false);
  }, [filteredData]);

  // Copy share link
  const handleCopyLink = useCallback(() => {
    // In a full implementation, this would generate a shareable URL
    // For now, just copy the current URL
    navigator.clipboard.writeText(window.location.href);
    setIsOpen(false);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-gray-800/90 backdrop-blur rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
        title={t("graph.export")}
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
          <button
            onClick={handleExportPNG}
            className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {t("graph.exportPNG")}
          </button>

          <button
            onClick={handleExportJSON}
            className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
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
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            {t("graph.exportJSON")}
          </button>

          <button
            onClick={handleExportCSV}
            className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
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
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {t("graph.exportCSV")}
          </button>

          <div className="border-t border-gray-700" />

          <button
            onClick={handleCopyLink}
            className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
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
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            {t("graph.copyLink")}
          </button>
        </div>
      )}
    </div>
  );
}

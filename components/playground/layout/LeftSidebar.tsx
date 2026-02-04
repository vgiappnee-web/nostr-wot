"use client";

import { useTranslations } from "next-intl";
import { useGraph } from "@/contexts/GraphContext";
import TrustThresholdSlider from "../filters/TrustThresholdSlider";
import DistanceLimitSlider from "../filters/DistanceLimitSlider";
import EdgeTypeFilters from "../filters/EdgeTypeFilters";
import { Button } from "@/components/ui";

interface LeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function LeftSidebar({ isOpen, onToggle }: LeftSidebarProps) {
  const t = useTranslations("playground");
  const { state, setSettings, resetFilters } = useGraph();
  const { settings } = state;

  return (
    <>
      {/* Toggle button (visible when sidebar is closed) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="absolute left-4 top-4 z-20 p-2 bg-gray-800/90 backdrop-blur rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
          title={t("graph.showFilters")}
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
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </button>
      )}

      {/* Sidebar panel */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-72 bg-gray-800/95 backdrop-blur border-r border-gray-700 z-20 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="font-medium text-white">{t("graph.filters")}</h3>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Filters */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Trust threshold */}
            <section>
              <h4 className="text-sm font-medium text-gray-300 mb-3">
                {t("graph.trustThreshold")}
              </h4>
              <TrustThresholdSlider />
            </section>

            {/* Distance limit */}
            <section>
              <h4 className="text-sm font-medium text-gray-300 mb-3">
                {t("graph.distanceLimit")}
              </h4>
              <DistanceLimitSlider />
            </section>

            {/* Edge types */}
            <section>
              <h4 className="text-sm font-medium text-gray-300 mb-3">
                {t("graph.connectionTypes")}
              </h4>
              <EdgeTypeFilters />
            </section>

            {/* Layout settings */}
            <section>
              <h4 className="text-sm font-medium text-gray-300 mb-3">
                {t("graph.layout")}
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setSettings({ layout: "force" })}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    settings.layout === "force"
                      ? "bg-primary text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {t("graph.forceLayout")}
                </button>
                <button
                  onClick={() => setSettings({ layout: "radial" })}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    settings.layout === "radial"
                      ? "bg-primary text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {t("graph.radialLayout")}
                </button>
              </div>
            </section>

            {/* Color mode */}
            <section>
              <h4 className="text-sm font-medium text-gray-300 mb-3">
                {t("graph.colorBy")}
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setSettings({ colorMode: "trust" })}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    settings.colorMode === "trust"
                      ? "bg-primary text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {t("graph.colorByTrust")}
                </button>
                <button
                  onClick={() => setSettings({ colorMode: "distance" })}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    settings.colorMode === "distance"
                      ? "bg-primary text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {t("graph.colorByDistance")}
                </button>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <Button
              variant="secondary"
              onClick={() => resetFilters()}
              className="w-full"
            >
              {t("graph.resetFilters")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

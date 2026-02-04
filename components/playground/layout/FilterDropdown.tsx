"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useGraph } from "@/contexts/GraphContext";
import TrustThresholdSlider from "../filters/TrustThresholdSlider";
import DistanceLimitSlider from "../filters/DistanceLimitSlider";
import EdgeTypeFilters from "../filters/EdgeTypeFilters";

export default function FilterDropdown() {
  const t = useTranslations("playground");
  const { state, setSettings, resetFilters } = useGraph();
  const { settings } = state;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
          isOpen
            ? "bg-primary/10 border-primary text-primary"
            : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
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
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
        <span className="text-sm font-medium hidden sm:inline">
          {t("graph.filters")}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {t("graph.filters")}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <svg
                className="w-4 h-4 text-gray-500"
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

          {/* Scrollable content */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
            {/* Trust threshold */}
            <section>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("graph.trustThreshold")}
              </h4>
              <TrustThresholdSlider />
            </section>

            {/* Distance limit */}
            <section>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("graph.distanceLimit")}
              </h4>
              <DistanceLimitSlider />
            </section>

            {/* Edge types */}
            <section>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("graph.connectionTypes")}
              </h4>
              <EdgeTypeFilters />
            </section>

            {/* Layout settings */}
            <section>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("graph.layout")}
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setSettings({ layout: "force" })}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    settings.layout === "force"
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {t("graph.forceLayout")}
                </button>
                <button
                  onClick={() => setSettings({ layout: "radial" })}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    settings.layout === "radial"
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {t("graph.radialLayout")}
                </button>
              </div>
            </section>

            {/* Color mode */}
            <section>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("graph.colorBy")}
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setSettings({ colorMode: "trust" })}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    settings.colorMode === "trust"
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {t("graph.colorByTrust")}
                </button>
                <button
                  onClick={() => setSettings({ colorMode: "distance" })}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    settings.colorMode === "distance"
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {t("graph.colorByDistance")}
                </button>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                resetFilters();
              }}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium"
            >
              {t("graph.resetFilters")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

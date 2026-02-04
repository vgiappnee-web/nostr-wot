"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useGraphFilters } from "@/hooks/useGraphFilters";

export default function DistanceLimitSlider() {
  const t = useTranslations("playground");
  const { filters, setMaxDistance } = useGraphFilters();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMaxDistance(parseInt(e.target.value, 10));
    },
    [setMaxDistance]
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{t("graph.maxHops")}</span>
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">
          {filters.maxDistance} {filters.maxDistance === 1 ? "hop" : "hops"}
        </span>
      </div>

      <input
        type="range"
        min="1"
        max="5"
        step="1"
        value={filters.maxDistance}
        onChange={handleChange}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #6366f1 ${((filters.maxDistance - 1) / 4) * 100}%, #374151 ${((filters.maxDistance - 1) / 4) * 100}%)`,
        }}
      />

      <div className="flex justify-between text-xs text-gray-500">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>

      <p className="text-xs text-gray-500 mt-1">
        {t("graph.distanceHint")}
      </p>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}

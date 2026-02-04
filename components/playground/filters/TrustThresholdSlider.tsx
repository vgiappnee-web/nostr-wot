"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useGraphFilters } from "@/hooks/useGraphFilters";
import { getTrustClass } from "@/lib/graph/colors";

export default function TrustThresholdSlider() {
  const t = useTranslations("playground");
  const { filters, setMinTrustScore } = useGraphFilters();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMinTrustScore(parseFloat(e.target.value) / 100);
    },
    [setMinTrustScore]
  );

  const percentage = Math.round(filters.minTrustScore * 100);
  const trustClass = getTrustClass(filters.minTrustScore);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{t("graph.minimum")}</span>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${trustClass}`}>
          {percentage}%
        </span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        step="5"
        value={percentage}
        onChange={handleChange}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
        style={{
          background: `linear-gradient(to right, #22c55e ${percentage}%, #374151 ${percentage}%)`,
        }}
      />

      <div className="flex justify-between text-xs text-gray-500">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>

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

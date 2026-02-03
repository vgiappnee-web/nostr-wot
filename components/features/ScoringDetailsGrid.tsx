"use client";

import { ScrollReveal } from "@/components/ui";

const DISTANCE_WEIGHTS = [
  { hops: "1 hop", weight: "100%", color: "bg-emerald-500" },
  { hops: "2 hops", weight: "50%", color: "bg-amber-500" },
  { hops: "3 hops", weight: "25%", color: "bg-orange-500" },
  { hops: "4+ hops", weight: "10%", color: "bg-red-500" },
];

const RELATIONSHIP_BONUSES = [
  { signal: "2-hop paths", bonus: "+15%", desc: "Per additional connection path" },
  { signal: "3-hop paths", bonus: "+10%", desc: "Per additional connection path" },
  { signal: "4+ hop paths", bonus: "+5%", desc: "Per additional connection path" },
  { signal: "Maximum bonus", bonus: "50%", desc: "Caps total path bonus" },
];

export default function ScoringDetailsGrid() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <ScrollReveal animation="fade-up" delay={200}>
        <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700/50 h-full">
          <h3 className="text-lg font-bold mb-2">Distance Weights</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Closer connections carry more weight</p>
          <div className="space-y-4">
            {DISTANCE_WEIGHTS.map((item) => (
              <div key={item.hops} className="flex items-center gap-4">
                <div className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">{item.hops}</div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: item.weight }} />
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-bold text-gray-900 dark:text-white">{item.weight}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 italic">All weights are fully customizable in settings</p>
        </div>
      </ScrollReveal>

      <ScrollReveal animation="fade-up" delay={300}>
        <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700/50 h-full">
          <h3 className="text-lg font-bold mb-2">Path Bonuses</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Multiple connection paths increase trust</p>
          <div className="space-y-4">
            {RELATIONSHIP_BONUSES.map((item) => (
              <div key={item.signal} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{item.signal}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.bonus}</span>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

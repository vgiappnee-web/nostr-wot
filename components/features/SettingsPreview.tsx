"use client";

import { ScrollReveal } from "@/components/ui";

const RELAYS = ["wss://relay.damus.io", "wss://nos.lol", "wss://relay.nostr.band"];

const SYNC_DEPTHS = [
  { depth: "1 hop", nodes: "~500", storage: "~1 MB" },
  { depth: "2 hops", nodes: "~50K", storage: "~50 MB" },
  { depth: "3 hops", nodes: "~500K", storage: "~500 MB" },
];

const SETTINGS_OPTIONS = [
  { title: "Cache TTL", desc: "Results cached for 5 minutes" },
  { title: "Blocklist", desc: "Force score to 0 for specific pubkeys" },
  { title: "Trustlist", desc: "Override to always trust specific pubkeys" },
];

export default function SettingsPreview() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ScrollReveal animation="fade-up" delay={100}>
        <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700/50">
          <h3 className="font-bold mb-4">Relay Selection</h3>
          <div className="space-y-2">
            {RELAYS.map((relay) => (
              <div key={relay} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-mono text-gray-600 dark:text-gray-400 truncate">{relay}</span>
              </div>
            ))}
            <button className="w-full p-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 text-sm hover:border-primary hover:text-primary transition-colors">
              + Add custom relay
            </button>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal animation="fade-up" delay={200}>
        <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700/50">
          <h3 className="font-bold mb-4">Sync Depth</h3>
          <div className="space-y-3">
            {SYNC_DEPTHS.map((item) => (
              <div key={item.depth} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                <span className="font-medium text-sm">{item.depth}</span>
                <div className="text-right">
                  <span className="text-xs text-gray-500">{item.nodes} nodes</span>
                  <span className="text-xs text-gray-400 ml-2">({item.storage})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal animation="fade-up" delay={300}>
        <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700/50">
          <h3 className="font-bold mb-4">More Options</h3>
          <div className="space-y-4">
            {SETTINGS_OPTIONS.map((opt) => (
              <div key={opt.title} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                <p className="text-sm font-medium mb-1">{opt.title}</p>
                <p className="text-xs text-gray-500">{opt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

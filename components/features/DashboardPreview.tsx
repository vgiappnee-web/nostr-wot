"use client";

const DASHBOARD_STATS = [
  { value: "12,847", label: "Nodes in Graph", color: "text-cyan-400" },
  { value: "89,421", label: "Connections", color: "text-purple-400" },
  { value: "94%", label: "Cache Hit Rate", color: "text-emerald-400" },
  { value: "3ms", label: "Avg Query", color: "text-amber-400" },
];

export default function DashboardPreview() {
  return (
    <div className="max-w-5xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 lg:p-10 shadow-2xl">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {DASHBOARD_STATS.map((stat) => (
          <div key={stat.label} className="text-center p-4 rounded-2xl bg-gray-800/50 border border-gray-700/50">
            <div className={`text-2xl lg:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50 border border-gray-700/50">
        <span className="text-sm text-gray-400">Last sync: 2 hours ago</span>
        <button className="text-sm text-primary font-medium hover:underline">Sync now →</button>
      </div>
    </div>
  );
}

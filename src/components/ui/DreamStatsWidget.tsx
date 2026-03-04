"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import type { DreamStats } from "@/lib/types";

export default function DreamStatsWidget({ stats }: { stats: DreamStats }) {
  const moodData = Object.entries(stats.moodDistribution).map(([mood, count]) => ({ mood, count }));
  const freqData = stats.recentFrequency.map((d) => ({ date: d.date.slice(5), dreams: d.count }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="dream-card p-4 flex flex-col gap-3">
        <h3 className="text-[#B0B0C0] text-xs uppercase tracking-widest">Overview</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[#B0B0C0] text-sm">Total Dreams</span>
            <span className="text-[#F5F5F5] font-semibold text-lg dream-title-glow">{stats.total}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#B0B0C0] text-sm">Lucid Dreams</span>
            <span className="lucid-glow font-semibold text-lg">{stats.lucidCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#B0B0C0] text-sm">Lucid Rate</span>
            <span className="text-[#9F7AEA] font-semibold">{stats.lucidPercentage}%</span>
          </div>
        </div>
      </div>
      <div className="dream-card p-4">
        <h3 className="text-[#B0B0C0] text-xs uppercase tracking-widest mb-3">Last 14 Days</h3>
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={freqData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="dreamGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9F7AEA" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#9F7AEA" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: "#B0B0C0", fontSize: 9 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#B0B0C0", fontSize: 9 }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ background: "#120A1F", border: "1px solid rgba(159,122,234,0.3)", borderRadius: 8, color: "#F5F5F5", fontSize: 12 }} />
            <Area type="monotone" dataKey="dreams" stroke="#9F7AEA" strokeWidth={2} fill="url(#dreamGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="dream-card p-4">
        <h3 className="text-[#B0B0C0] text-xs uppercase tracking-widest mb-3">Mood Distribution</h3>
        {stats.total === 0 ? <p className="text-[#B0B0C0] text-xs text-center mt-4">No data yet</p> : (
          <ResponsiveContainer width="100%" height={80}>
            <RadarChart data={moodData} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <PolarGrid stroke="rgba(159,122,234,0.15)" />
              <PolarAngleAxis dataKey="mood" tick={{ fill: "#B0B0C0", fontSize: 9 }} />
              <Radar name="Mood" dataKey="count" stroke="#9F7AEA" fill="#9F7AEA" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

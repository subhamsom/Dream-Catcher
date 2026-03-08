import type { DreamEntry, DreamStats, Mood } from "./types";

export const MOOD_COLORS: Record<Mood, string> = {
  Happy: "#fbbf24",
  Anxious: "#FF6B81",
  Calm: "#60A5FA",
  Neutral: "#B0B0C0",
  Excited: "#C9A0FF",
};

export const MOOD_EMOJIS: Record<Mood, string> = {
  Happy: "☀️",
  Anxious: "🌀",
  Calm: "🌊",
  Neutral: "🌙",
  Excited: "⚡",
};

export function computeStats(dreams: DreamEntry[]): DreamStats {
  const total = dreams.length;
  const lucidCount = dreams.filter((d) => d.is_lucid).length;
  const moodDistribution = { Happy: 0, Anxious: 0, Calm: 0, Neutral: 0, Excited: 0 } as Record<Mood, number>;
  dreams.forEach((d) => { if (d.mood_upon_waking in moodDistribution) moodDistribution[d.mood_upon_waking]++; });

  const now = new Date();
  const recentFrequency: { date: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    recentFrequency.push({ date: dateStr, count: dreams.filter((dr) => dr.record_date.startsWith(dateStr)).length });
  }

  return {
    total,
    lucidCount,
    lucidPercentage: total > 0 ? Math.round((lucidCount / total) * 100) : 0,
    moodDistribution,
    recentFrequency,
  };
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "short", year: "numeric", month: "short", day: "numeric",
  });
}

/** Parse Supabase embed: one-to-one returns object, one-to-many returns array */
export function parseInsightEmbed<T>(embed: T | T[] | null | undefined): T | null {
  if (embed == null) return null;
  return Array.isArray(embed) ? (embed[0] ?? null) : embed;
}

export function truncate(str: string | undefined | null, len = 120): string {
  if (str == null || typeof str !== "string") return "";
  return str.length > len ? str.slice(0, len) + "…" : str;
}

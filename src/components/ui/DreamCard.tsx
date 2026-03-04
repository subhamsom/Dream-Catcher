"use client";
import Link from "next/link";
import type { DreamEntry } from "@/lib/types";
import { MOOD_COLORS, MOOD_EMOJIS, formatDate, truncate } from "@/lib/utils";

export default function DreamCard({ dream }: { dream: DreamEntry }) {
  const moodColor = MOOD_COLORS[dream.mood_upon_waking];
  const moodEmoji = MOOD_EMOJIS[dream.mood_upon_waking];

  return (
    <Link href={`/dream/${dream.id}`} className="block">
      <div className="dream-card p-5 cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-[#F5F5F5] truncate dream-title-glow"
              style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem" }}>
              {dream.title || "Untitled Dream"}
            </h3>
            <p className="text-[#B0B0C0] text-xs mt-0.5">{formatDate(dream.record_date)}</p>
          </div>
          <div className="flex items-center gap-2 ml-3 shrink-0">
            {dream.is_lucid && (
              <span className="lucid-glow text-xs font-medium px-2 py-0.5 rounded-full border border-[#C9A0FF]/30 bg-[#C9A0FF]/10">
                ✦ Lucid
              </span>
            )}
            <span className="text-lg" title={dream.mood_upon_waking}>{moodEmoji}</span>
          </div>
        </div>
        <p className="text-[#B0B0C0] text-sm leading-relaxed mb-3"
          style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.95rem" }}>
          {truncate(dream.dream_content, 110)}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {dream.tags.slice(0, 3).map((tag) => <span key={tag} className="tag-pill">{tag}</span>)}
            {dream.tags.length > 3 && <span className="tag-pill opacity-60">+{dream.tags.length - 3}</span>}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: moodColor, boxShadow: `0 0 6px ${moodColor}` }} />
            <span className="text-xs" style={{ color: moodColor }}>{dream.mood_upon_waking}</span>
          </div>
        </div>
        {dream.insight && (
          <div className="mt-3 pt-3 border-t border-[#9F7AEA]/10 flex items-center gap-1.5">
            <span className="text-[#9F7AEA] text-xs">✦</span>
            <span className="text-[#9F7AEA] text-xs">AI Insight available</span>
          </div>
        )}
      </div>
    </Link>
  );
}

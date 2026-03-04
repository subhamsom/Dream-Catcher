"use client";
import { useState } from "react";
import type { DreamEntry, Mood } from "@/lib/types";
import { MOOD_EMOJIS, MOOD_COLORS } from "@/lib/utils";

const MOODS: Mood[] = ["Happy", "Anxious", "Calm", "Neutral", "Excited"];

interface DreamEntryFormProps {
  initialData?: Partial<DreamEntry>;
  onSubmit: (data: Omit<DreamEntry, "id" | "user_id" | "recorded_at" | "insight">) => Promise<void>;
  submitLabel?: string;
  simplified?: boolean;
}

export default function DreamEntryForm({ initialData, onSubmit, submitLabel = "Save Dream", simplified = false }: DreamEntryFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.dream_content || "");
  const [mood, setMood] = useState<Mood>(initialData?.mood_upon_waking || "Neutral");
  const [isLucid, setIsLucid] = useState(initialData?.is_lucid || false);
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(", ") || "");
  const [date, setDate] = useState(initialData?.record_date || new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) { setError("Dream narrative is required."); return; }
    setLoading(true); setError("");
    try {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      await onSubmit({ record_date: date, title: title.trim() || null, dream_content: content.trim(), mood_upon_waking: mood, is_lucid: isLucid, tags });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!simplified && (
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[#B0B0C0] text-sm mb-1.5">Dream Title <span className="opacity-50">(optional)</span></label>
            <input type="text" className="dream-input px-4 py-2.5 text-sm" placeholder="A name for this dream..."
              value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[#B0B0C0] text-sm mb-1.5">Date</label>
            <input type="date" className="dream-input px-4 py-2.5 text-sm" value={date}
              onChange={(e) => setDate(e.target.value)} style={{ colorScheme: "dark" }} />
          </div>
        </div>
      )}
      <div>
        <label className="block text-[#B0B0C0] text-sm mb-1.5">Dream Narrative <span className="text-[#FF6B81]">*</span></label>
        <textarea className="dream-input px-4 py-3 text-sm leading-relaxed resize-none"
          style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem", minHeight: simplified ? "160px" : "200px" }}
          placeholder={simplified ? "Begin your journey: Describe your first dream..." : "What did you dream? Describe it in as much detail as you remember..."}
          value={content} onChange={(e) => setContent(e.target.value)} required />
      </div>
      {!simplified && (
        <>
          <div>
            <label className="block text-[#B0B0C0] text-sm mb-2">Mood Upon Waking</label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button key={m} type="button" onClick={() => setMood(m)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-all ${mood === m ? "border-[#9F7AEA] bg-[#9F7AEA]/20 text-[#F5F5F5]" : "border-white/10 bg-white/5 text-[#B0B0C0] hover:border-[#9F7AEA]/40"}`}
                  style={mood === m ? { boxShadow: `0 0 10px ${MOOD_COLORS[m]}40` } : {}}>
                  <span>{MOOD_EMOJIS[m]}</span><span>{m}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <button type="button" role="checkbox" aria-checked={isLucid} onClick={() => setIsLucid(!isLucid)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${isLucid ? "bg-[#C9A0FF]/30 border-[#C9A0FF]" : "bg-transparent border-white/20 hover:border-[#C9A0FF]/50"}`}
                style={isLucid ? { boxShadow: "0 0 8px rgba(201,160,255,0.5)" } : {}}>
                {isLucid && <span className="text-[#C9A0FF] text-xs">✓</span>}
              </button>
              <span className={`text-sm ${isLucid ? "lucid-glow" : "text-[#B0B0C0]"}`}>✦ This was a Lucid Dream</span>
            </div>
            <div>
              <label className="block text-[#B0B0C0] text-xs mb-1.5">Tags <span className="opacity-50">(comma-separated)</span></label>
              <input type="text" className="dream-input px-3 py-2 text-sm" placeholder="flying, water, family..."
                value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
            </div>
          </div>
        </>
      )}
      {error && <p className="text-[#FF6B81] text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base font-medium">
        {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</span> : submitLabel}
      </button>
    </form>
  );
}

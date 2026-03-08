"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Modal from "@/components/ui/Modal";
import DreamEntryForm from "@/components/forms/DreamEntryForm";
import type { DreamEntry, GeminiInsight, User } from "@/lib/types";
import { MOOD_COLORS, MOOD_EMOJIS, formatDate, parseInsightEmbed } from "@/lib/utils";

const FREE_LIMIT = 5;

export default function DreamDetailPage() {
  const router = useRouter();
  const params = useParams();
  const dreamId = params?.id as string;
  const [dream, setDream] = useState<DreamEntry | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [insight, setInsight] = useState<GeminiInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [insightLoading, setInsightLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [insightError, setInsightError] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { router.push("/login"); return; }
      const { data: profile } = await supabase.from("users").select("*").eq("id", authUser.id).single();
      setUser(profile);
      const { data: dreamData } = await supabase.from("dream_entries")
        .select(`*, tags:dream_tags(tag_text), insight:gemini_insights(*)`).eq("id", dreamId).single();
      if (!dreamData) { router.push("/dashboard"); return; }
      const normalized: DreamEntry = {
        ...dreamData,
        tags: (dreamData.tags || []).map((t: { tag_text: string }) => t.tag_text),
        dream_content: dreamData.dream_content_encrypted || "",
        insight: parseInsightEmbed(dreamData.insight),
      };
      setDream(normalized); setInsight(normalized.insight || null); setLoading(false);
    };
    init();
  }, [dreamId, router]);

  const requestInsight = async () => {
    if (!dream || !user) return;
    const isPremium = user.subscription_status === "ACTIVE";
    if (!isPremium && (FREE_LIMIT - user.free_insights_used) <= 0) { setShowPaywall(true); return; }
    setInsightLoading(true); setInsightError("");
    const res = await fetch("/api/insights", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dream_id: dream.id, user_id: user.id }),
    });
    const data = await res.json();
    if (res.status === 402) setShowPaywall(true);
    else if (!res.ok) setInsightError(data.error || "Failed to generate insight. Please try again.");
    else {
      setInsight(data.insight);
      const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single();
      setUser(profile);
    }
    setInsightLoading(false);
  };

  const handleDelete = async () => {
    if (!dream) return;
    await supabase.from("dream_entries").delete().eq("id", dream.id);
    router.push("/dashboard");
  };

  const handleEditSubmit = async (updated: Omit<DreamEntry, "id" | "user_id" | "recorded_at" | "insight">) => {
    if (!dream) throw new Error("Dream not loaded");

    const { record_date, title, dream_content, mood_upon_waking, is_lucid, tags } = updated;

    const { error: dreamError } = await supabase
      .from("dream_entries")
      .update({
        record_date,
        title: title || null,
        dream_content_encrypted: dream_content,
        mood_upon_waking,
        is_lucid,
      })
      .eq("id", dream.id);

    if (dreamError) {
      console.error("Error updating dream:", dreamError);
      throw new Error(dreamError.message || "Failed to update dream");
    }

    const { error: deleteTagsError } = await supabase
      .from("dream_tags")
      .delete()
      .eq("dream_id", dream.id);

    if (deleteTagsError) {
      console.error("Error clearing dream tags:", deleteTagsError);
      throw new Error(deleteTagsError.message || "Failed to update dream tags");
    }

    if (tags && tags.length > 0) {
      const { error: tagsError } = await supabase
        .from("dream_tags")
        .insert(tags.map((tag) => ({ dream_id: dream.id, tag_text: tag })));

      if (tagsError) {
        console.error("Error updating dream tags:", tagsError);
        throw new Error(tagsError.message || "Failed to update dream tags");
      }
    }

    setDream({
      ...dream,
      record_date,
      title,
      dream_content,
      mood_upon_waking,
      is_lucid,
      tags,
    });
    setEditing(false);
  };

  const formatInsight = (text: string) => text.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**"))
      return <h4 key={i} className="text-[#C9A0FF] font-semibold mt-4 mb-1">{line.replace(/\*\*/g, "")}</h4>;
    if (line.trim() === "") return <br key={i} />;
    return <p key={i} className="text-[#B0B0C0] text-sm leading-relaxed">{line.replace(/\*\*/g, "")}</p>;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><div className="text-5xl mb-4 animate-float">🌙</div><p className="text-[#B0B0C0]">Entering the dream...</p></div>
    </div>
  );
  if (!dream) return null;

  const moodColor = MOOD_COLORS[dream.mood_upon_waking];
  const moodEmoji = MOOD_EMOJIS[dream.mood_upon_waking];
  const isPremium = user?.subscription_status === "ACTIVE";
  const insightsRemaining = FREE_LIMIT - (user?.free_insights_used || 0);

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-40 border-b border-[#9F7AEA]/10 bg-[#0A0E1F]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="text-[#B0B0C0] hover:text-[#F5F5F5] transition-colors text-sm">← Dashboard</Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing((prev) => !prev)}
              className="text-[#B0B0C0] hover:text-[#C9A0FF] transition-colors text-sm px-3 py-1.5 rounded border border-white/10 hover:border-[#C9A0FF]/30"
            >
              {editing ? "Cancel" : "Edit"}
            </button>
            <button onClick={() => setDeleteConfirm(true)} className="text-[#B0B0C0] hover:text-[#FF6B81] transition-colors text-sm px-3 py-1.5 rounded border border-white/10 hover:border-[#FF6B81]/30">Delete</button>
          </div>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div className="animate-slide-up">
          <h1 className="dream-title-glow text-3xl sm:text-4xl font-semibold text-[#F5F5F5] mb-4 leading-tight" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            {dream.title || "Untitled Dream"}
          </h1>
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <span className="text-[#B0B0C0] text-sm">{formatDate(dream.record_date)}</span>
            <span className="text-[#B0B0C0]/30">·</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm"
              style={{ background: `${moodColor}15`, border: `1px solid ${moodColor}40`, color: moodColor }}>
              {moodEmoji} {dream.mood_upon_waking}
            </div>
            {dream.is_lucid && <span className="lucid-glow px-2.5 py-1 rounded-full text-sm border border-[#C9A0FF]/30 bg-[#C9A0FF]/10">✦ Lucid Dream</span>}
          </div>
          {dream.tags.length > 0 && <div className="flex flex-wrap gap-1.5">{dream.tags.map((tag) => <span key={tag} className="tag-pill">{tag}</span>)}</div>}
        </div>
        <hr className="dream-divider" />
        {editing ? (
          <div className="dream-card p-6 animate-slide-up">
            <h2
              className="dream-title-glow text-xl font-semibold text-[#F5F5F5] mb-4"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Edit Dream
            </h2>
            <DreamEntryForm initialData={dream} onSubmit={handleEditSubmit} submitLabel="Save Changes" />
          </div>
        ) : (
          <div className="dream-card p-6 animate-slide-up">
            <p
              className="text-[#F5F5F5] leading-relaxed whitespace-pre-wrap"
              style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem", lineHeight: "1.8" }}
            >
              {dream.dream_content}
            </p>
          </div>
        )}
        <div className="animate-slide-up">
          {insight ? (
            <div className="insight-block p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#9F7AEA] text-xl">✦</span>
                <h2 className="dream-title-glow text-xl font-semibold text-[#F5F5F5]" style={{ fontFamily: "Cormorant Garamond, serif" }}>Gemini Insight & Significance</h2>
              </div>
              <div className="space-y-1">{formatInsight(insight.insight_content)}</div>
              <p className="text-[#B0B0C0]/40 text-xs mt-4">Generated {new Date(insight.insight_generated_at).toLocaleString("en-IN")}</p>
            </div>
          ) : (
            <div className="dream-card p-6 text-center">
              <div className="text-4xl mb-3">✦</div>
              <h3 className="dream-title-glow text-xl font-semibold text-[#F5F5F5] mb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>Unlock AI Dream Analysis</h3>
              <p className="text-[#B0B0C0] text-sm mb-4 max-w-md mx-auto">Let Gemini AI reveal the hidden symbolism, emotional patterns, and deeper meaning within your dream.</p>
              {!isPremium && <p className="text-[#B0B0C0] text-xs mb-4">{insightsRemaining > 0 ? `${insightsRemaining} of ${FREE_LIMIT} free insights remaining` : "You have used all 5 free insights"}</p>}
              {insightError && <p className="text-[#FF6B81] text-sm mb-3">{insightError}</p>}
              <button onClick={requestInsight} disabled={insightLoading} className="btn-primary px-6 py-3 text-sm font-medium">
                {insightLoading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing your dream...</span> : "Analyze Dream with AI ✦"}
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showPaywall} onClose={() => setShowPaywall(false)} title="Unlock Unlimited Insights" maxWidth="max-w-md">
        <div className="text-center">
          <div className="text-5xl mb-4">✦</div>
          <p className="text-[#B0B0C0] text-sm mb-6 leading-relaxed">You&apos;ve used all 5 free AI insights. Unlock unlimited dream analysis and discover your deepest subconscious patterns.</p>
          <div className="paywall-card p-4 mb-6">
            <p className="lucid-glow text-2xl font-bold mb-1">₹499<span className="text-sm font-normal text-[#B0B0C0]">/month</span></p>
            <p className="text-[#B0B0C0] text-sm">Unlimited AI dream insights · Cancel anytime</p>
          </div>
          <Link href="/upgrade" className="btn-primary btn-lucid inline-block px-8 py-3 text-sm font-medium mb-3 w-full text-center" onClick={() => setShowPaywall(false)}>
            Unlock Full Dream Potential ✦
          </Link>
          <button onClick={() => setShowPaywall(false)} className="text-[#B0B0C0] text-sm hover:text-[#F5F5F5] transition-colors">Maybe later</button>
        </div>
      </Modal>

      <Modal isOpen={deleteConfirm} onClose={() => setDeleteConfirm(false)} title="Erase This Memory?" maxWidth="max-w-sm">
        <p className="text-[#B0B0C0] text-sm mb-6 leading-relaxed">Are you sure you want to permanently erase this dream? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(false)} className="flex-1 py-2.5 text-sm border border-white/10 rounded-lg text-[#B0B0C0] hover:text-[#F5F5F5] hover:border-white/20 transition-colors">Keep it</button>
          <button onClick={handleDelete} className="flex-1 py-2.5 text-sm rounded-lg font-medium transition-colors"
            style={{ background: "rgba(255,107,129,0.2)", border: "1px solid rgba(255,107,129,0.4)", color: "#FF6B81" }}>
            Yes, erase
          </button>
        </div>
      </Modal>
    </div>
  );
}

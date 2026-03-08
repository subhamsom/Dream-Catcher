"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DreamEntryForm from "@/components/forms/DreamEntryForm";
import type { DreamEntry } from "@/lib/types";

export default function NewDreamPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login");
      else setUserId(data.user.id);
    });
  }, [router]);

  const handleSubmit = async (dreamData: Omit<DreamEntry, "id" | "user_id" | "recorded_at" | "insight">) => {
    if (!userId) throw new Error("Not authenticated");
    const res = await fetch("/api/dreams", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId, dream_content_encrypted: dreamData.dream_content,
        title: dreamData.title, record_date: dreamData.record_date,
        mood_upon_waking: dreamData.mood_upon_waking, is_lucid: dreamData.is_lucid, tags: dreamData.tags,
      }),
    });
    if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed to save dream"); }
    const { dream } = await res.json();
    router.push(`/dream/${dream.id}`);
  };

  if (!userId) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#9F7AEA]/30 border-t-[#9F7AEA] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-40 border-b border-[#9F7AEA]/10 bg-[#0A0E1F]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-[#B0B0C0] hover:text-[#F5F5F5] transition-colors">← Dashboard</Link>
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="dream-title-glow font-bold text-[#F5F5F5]" style={{ fontFamily: "Cinzel Decorative, serif", fontSize: "0.8rem" }}>Dream Catcher</span>
          </Link>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="dream-title-glow text-3xl font-semibold text-[#F5F5F5] mb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>Record a Dream</h1>
          <p className="text-[#B0B0C0] text-sm">Capture the details while they&apos;re still vivid.</p>
        </div>
        <div className="dream-card p-6">
          <DreamEntryForm onSubmit={handleSubmit} submitLabel="Save Dream" />
        </div>
      </div>
    </div>
  );
}

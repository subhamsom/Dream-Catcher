"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DreamCard from "@/components/ui/DreamCard";
import DreamStatsWidget from "@/components/ui/DreamStatsWidget";
import InsightCounter from "@/components/ui/InsightCounter";
import type { DreamEntry, User, Mood } from "@/lib/types";
import { computeStats } from "@/lib/utils";

const MOODS: Mood[] = ["Happy", "Anxious", "Calm", "Neutral", "Excited"];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterMood, setFilterMood] = useState<Mood | "">("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const loadDreams = useCallback(async (userId: string) => {
    const params = new URLSearchParams({ user_id: userId });
    if (search) params.set("search", search);
    if (filterMood) params.set("mood", filterMood);
    if (filterFrom) params.set("from", filterFrom);
    if (filterTo) params.set("to", filterTo);
    const res = await fetch(`/api/dreams?${params}`);
    if (res.ok) { const data = await res.json(); setDreams(data.dreams || []); }
  }, [search, filterMood, filterFrom, filterTo]);

  useEffect(() => {
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { router.push("/login"); return; }
      const { data: profile } = await supabase.from("users").select("*").eq("id", authUser.id).single();
      if (profile) { setUser(profile); await loadDreams(authUser.id); }
      setLoading(false);
    };
    init();
  }, [router, loadDreams]);

  const stats = computeStats(dreams);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><div className="text-5xl mb-4 animate-float">🌙</div><p className="text-[#B0B0C0]">Loading your dreamscape...</p></div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-40 border-b border-[#9F7AEA]/10 bg-[#0A0E1F]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌙</span>
            <span className="dream-title-glow font-bold text-[#F5F5F5]" style={{ fontFamily: "Cinzel Decorative, serif", fontSize: "0.9rem" }}>Dream Catcher</span>
          </div>
          <div className="flex items-center gap-3">
            {user && <InsightCounter user={user} />}
            <Link href="/dashboard/new" className="btn-primary px-4 py-2 text-sm">+ New Dream</Link>
            <Link href="/settings" className="text-[#B0B0C0] hover:text-[#F5F5F5] transition-colors text-sm hidden sm:block">Settings</Link>
          </div>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="dream-title-glow text-3xl font-semibold text-[#F5F5F5] mb-1" style={{ fontFamily: "Cormorant Garamond, serif" }}>Your Dreamscape</h1>
          <p className="text-[#B0B0C0] text-sm">{user?.email} · {stats.total} dream{stats.total !== 1 ? "s" : ""} recorded</p>
        </div>
        {stats.total > 0 && <DreamStatsWidget stats={stats} />}
        <div className="dream-card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input type="text" className="dream-input px-4 py-2.5 text-sm" placeholder="Search dreams by title or tags..."
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select className="dream-input px-3 py-2.5 text-sm w-auto" value={filterMood} onChange={(e) => setFilterMood(e.target.value as Mood | "")} style={{ colorScheme: "dark" }}>
                <option value="">All Moods</option>
                {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <input type="date" className="dream-input px-3 py-2.5 text-sm w-auto" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} style={{ colorScheme: "dark" }} />
              <input type="date" className="dream-input px-3 py-2.5 text-sm w-auto" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} style={{ colorScheme: "dark" }} />
              {(search || filterMood || filterFrom || filterTo) && (
                <button onClick={() => { setSearch(""); setFilterMood(""); setFilterFrom(""); setFilterTo(""); }}
                  className="text-[#B0B0C0] hover:text-[#FF6B81] text-sm px-2 transition-colors">Clear ✕</button>
              )}
            </div>
          </div>
        </div>
        {dreams.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 opacity-40">🌙</div>
            <p className="text-[#B0B0C0] mb-4">{search || filterMood || filterFrom || filterTo ? "No dreams match your filters." : "Your dream journal is empty. Start recording!"}</p>
            <Link href="/dashboard/new" className="btn-primary px-6 py-2.5 text-sm inline-block">Record Your First Dream</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dreams.map((dream) => <DreamCard key={dream.id} dream={dream} />)}
          </div>
        )}
      </div>
    </div>
  );
}

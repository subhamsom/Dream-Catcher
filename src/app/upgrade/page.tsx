"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@/lib/types";

export default function UpgradePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justSubscribed = searchParams?.get("subscribed") === "true";
  const cancelled = searchParams?.get("cancelled") === "true";
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      const { data: profile } = await supabase.from("users").select("*").eq("id", data.user.id).single();
      setUser(profile);
    });
  }, [router]);

  const handleSubscribe = async () => {
    if (!user) return;
    setLoading(true);
    const res = await fetch("/api/subscription", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, email: user.email }),
    });
    if (res.ok) { const { url } = await res.json(); if (url) window.location.href = url; }
    setLoading(false);
  };

  const isPremium = user?.subscription_status === "ACTIVE";

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-40 border-b border-[#9F7AEA]/10 bg-[#0A0E1F]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="text-[#B0B0C0] hover:text-[#F5F5F5] transition-colors text-sm">← Dashboard</Link>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-base">🌙</span>
            <span className="dream-title-glow font-bold text-[#F5F5F5]" style={{ fontFamily: "Cinzel Decorative, serif", fontSize: "0.8rem" }}>Dream Catcher</span>
          </Link>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        {justSubscribed && (
          <div className="mb-8 p-4 rounded-xl border border-[#C9A0FF]/30 bg-[#C9A0FF]/10">
            <p className="lucid-glow font-semibold">✦ Welcome to Premium!</p>
            <p className="text-[#B0B0C0] text-sm mt-1">You now have unlimited AI dream insights.</p>
          </div>
        )}
        {cancelled && (
          <div className="mb-8 p-4 rounded-xl border border-[#FF6B81]/30 bg-[#FF6B81]/10">
            <p className="text-[#FF6B81] text-sm">Subscription was cancelled. No charge was made.</p>
          </div>
        )}

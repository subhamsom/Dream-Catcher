"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@/lib/types";

function UpgradePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justSubscribed = searchParams?.get("subscribed") === "true";
  const cancelled = searchParams?.get("cancelled") === "true";
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

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
    setShowComingSoon(false);
    const res = await fetch("/api/subscription", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, email: user.email }),
    });
    const data = await res.json();
    if (data.coming_soon) {
      setShowComingSoon(true);
    } else if (res.ok && data.url) {
      window.location.href = data.url;
    }
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
        {showComingSoon && (
          <div className="mb-8 p-6 rounded-xl border border-[#C9A0FF]/30 bg-[#C9A0FF]/10">
            <p className="lucid-glow font-semibold text-lg">Coming Soon</p>
            <p className="text-[#B0B0C0] text-sm mt-1">Premium subscriptions are not yet available. Check back soon!</p>
          </div>
        )}
        {isPremium ? (
          <div className="paywall-card p-6 max-w-md mx-auto">
            <p className="lucid-glow font-semibold">✦ Welcome to Premium!</p>
            <p className="text-[#B0B0C0] text-sm mt-1">You have unlimited AI dream insights.</p>
          </div>
        ) : (
          <div className="paywall-card p-6 max-w-md mx-auto">
            <h2 className="dream-title-glow text-xl font-semibold text-[#F5F5F5] mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>Unlock Unlimited Insights</h2>
            <p className="text-[#C9A0FF] text-2xl font-bold mb-1">₹499<span className="text-sm font-normal text-[#B0B0C0]">/month</span></p>
            <p className="text-[#B0B0C0] text-sm mb-6">Unlimited AI dream analysis · Cancel anytime</p>
            <button onClick={handleSubscribe} disabled={loading} className="btn-primary btn-lucid w-full py-3 text-sm font-medium">
              {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</span> : "Unlock Now — ₹499/mo ✦"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-[#B0B0C0]">
          Loading upgrade options...
        </div>
      }
    >
      <UpgradePageContent />
    </Suspense>
  );
}

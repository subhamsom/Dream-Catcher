"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@/lib/types";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      const { data: profile } = await supabase.from("users").select("*").eq("id", data.user.id).single();
      setUser(profile);
      setLoading(false);
    });
  }, [router]);

  const handleSignOut = async () => {
    setSignOutLoading(true);
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    if (!user || deleteInput !== user.email) {
      setMessage({ type: "error", text: "Email doesn't match. Please type your email exactly." });
      return;
    }
    setDeleteLoading(true);
    try {
      // Delete all user data via service role (cascade deletes dreams, tags, insights)
      const res = await fetch("/api/auth", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });
      if (!res.ok) throw new Error("Failed to delete account");
      await supabase.auth.signOut();
      router.push("/");
    } catch {
      setMessage({ type: "error", text: "Failed to delete account. Please try again." });
      setDeleteLoading(false);
    }
  };

  const isPremium = user?.subscription_status === "ACTIVE";
  const insightsUsed = user?.free_insights_used ?? 0;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><div className="text-5xl mb-4 animate-float">🌙</div><p className="text-[#B0B0C0]">Loading settings...</p></div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-40 border-b border-[#9F7AEA]/10 bg-[#0A0E1F]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="text-[#B0B0C0] hover:text-[#F5F5F5] transition-colors text-sm">← Dashboard</Link>
          <span className="dream-title-glow font-bold text-[#F5F5F5]" style={{ fontFamily: "Cinzel Decorative, serif", fontSize: "0.85rem" }}>Dream Catcher</span>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <div className="mb-8">
          <h1 className="dream-title-glow text-3xl font-semibold text-[#F5F5F5] mb-1" style={{ fontFamily: "Cormorant Garamond, serif" }}>Settings</h1>
          <p className="text-[#B0B0C0] text-sm">Manage your account and preferences.</p>
        </div>
        {message && (
          <div className={`p-4 rounded-xl border text-sm ${message.type === "success" ? "border-[#9F7AEA]/30 bg-[#9F7AEA]/10 text-[#9F7AEA]" : "border-[#FF6B81]/30 bg-[#FF6B81]/10 text-[#FF6B81]"}`}>
            {message.text}
          </div>
        )}
        {/* Account Info */}
        <div className="dream-card p-6">
          <h2 className="text-[#F5F5F5] font-semibold mb-4" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem" }}>Account</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-[#B0B0C0] text-sm">Email</span>
              <span className="text-[#F5F5F5] text-sm">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-[#B0B0C0] text-sm">Member since</span>
              <span className="text-[#F5F5F5] text-sm">{user?.created_at ? new Date(user.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "—"}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[#B0B0C0] text-sm">Plan</span>
              {isPremium
                ? <span className="lucid-glow text-sm font-medium">✦ Premium</span>
                : <span className="text-[#9F7AEA] text-sm">Free ({insightsUsed}/5 insights used)</span>}
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="dream-card p-6">
          <h2 className="text-[#F5F5F5] font-semibold mb-4" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem" }}>Subscription</h2>
          {isPremium ? (
            <div>
              <div className="paywall-card p-4 mb-4">
                <p className="lucid-glow font-semibold text-sm">✦ Premium — Unlimited AI Insights</p>
                {user?.subscription_end_date && (
                  <p className="text-[#B0B0C0] text-xs mt-1">Renews {new Date(user.subscription_end_date).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}</p>
                )}
              </div>
              <p className="text-[#B0B0C0] text-xs">To cancel your subscription, please manage it through your payment provider.</p>
            </div>
          ) : (
            <div>
              <p className="text-[#B0B0C0] text-sm mb-4">You are on the Free plan. Upgrade to unlock unlimited AI dream analysis.</p>
              <Link href="/upgrade" className="btn-primary btn-lucid inline-block px-6 py-2.5 text-sm font-medium">Upgrade to Premium — ₹499/mo ✦</Link>
            </div>
          )}
        </div>

        {/* Sign Out */}
        <div className="dream-card p-6">
          <h2 className="text-[#F5F5F5] font-semibold mb-4" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem" }}>Session</h2>
          <button onClick={handleSignOut} disabled={signOutLoading}
            className="px-5 py-2.5 rounded-lg border border-white/10 text-[#B0B0C0] hover:text-[#F5F5F5] hover:border-white/20 transition-colors text-sm font-medium">
            {signOutLoading ? "Signing out..." : "Sign Out"}
          </button>
        </div>

        {/* Danger Zone */}
        <div className="dream-card p-6 border-[#FF6B81]/20">
          <h2 className="text-[#FF6B81] font-semibold mb-2" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem" }}>Danger Zone</h2>
          <p className="text-[#B0B0C0] text-sm mb-4">Permanently delete your account and all dream data. This cannot be undone.</p>
          {!deleteConfirm ? (
            <button onClick={() => setDeleteConfirm(true)}
              className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{ background: "rgba(255,107,129,0.1)", border: "1px solid rgba(255,107,129,0.3)", color: "#FF6B81" }}>
              Delete Account
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-[#B0B0C0] text-sm">Type your email <strong className="text-[#F5F5F5]">{user?.email}</strong> to confirm:</p>
              <input type="email" className="dream-input px-4 py-2.5 text-sm" placeholder={user?.email || "your@email.com"}
                value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)} />
              <div className="flex gap-3">
                <button onClick={() => { setDeleteConfirm(false); setDeleteInput(""); }}
                  className="flex-1 py-2.5 text-sm border border-white/10 rounded-lg text-[#B0B0C0] hover:text-[#F5F5F5] transition-colors">Cancel</button>
                <button onClick={handleDeleteAccount} disabled={deleteLoading}
                  className="flex-1 py-2.5 text-sm rounded-lg font-medium transition-colors"
                  style={{ background: "rgba(255,107,129,0.2)", border: "1px solid rgba(255,107,129,0.4)", color: "#FF6B81" }}>
                  {deleteLoading ? "Deleting..." : "Yes, delete everything"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

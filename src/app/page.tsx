"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DreamEntryForm from "@/components/forms/DreamEntryForm";
import type { DreamEntry } from "@/lib/types";

export default function LandingPage() {
  const router = useRouter();
  const [step, setStep] = useState<"landing" | "signup" | "dream">("landing");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const handleGoogleSignUp = async () => {
    try {
      setAuthLoading(true);
      setAuthError("");
      if (typeof window !== "undefined") localStorage.setItem("dc_oauth_next", "/dashboard/new");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) { setAuthError(error.message); setAuthLoading(false); }
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : "Failed to continue with Google");
      setAuthLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true); setAuthError("");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      const { data: siData, error: siErr } = await supabase.auth.signInWithPassword({ email, password });
      if (siErr) { setAuthError(siErr.message); setAuthLoading(false); return; }
      if (siData.user) { setUserId(siData.user.id); setStep("dream"); }
    } else if (data.user) { setUserId(data.user.id); setStep("dream"); }
    setAuthLoading(false);
  };

  const handleFirstDream = async (dreamData: Omit<DreamEntry, "id" | "user_id" | "recorded_at" | "insight">) => {
    if (!userId) return;
    const res = await fetch("/api/dreams", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, dream_content_encrypted: dreamData.dream_content,
        mood_upon_waking: "Neutral", is_lucid: false, tags: [], record_date: dreamData.record_date }),
    });
    if (!res.ok) throw new Error("Failed to save dream");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-[#9F7AEA]/10 bg-[#0A0E1F]/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl">🌙</span>
            <span className="dream-title-glow text-lg font-bold text-[#F5F5F5]" style={{ fontFamily: "Cinzel Decorative, serif", fontSize: "0.95rem" }}>Dream Catcher</span>
          </Link>
          <Link href="/login" className="text-[#B0B0C0] hover:text-[#F5F5F5] transition-colors text-sm">Sign In</Link>
        </div>
      </nav>

      {step === "landing" && <LandingContent onBegin={() => setStep("signup")} />}

      {step === "signup" && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="dream-card p-8 w-full max-w-md animate-slide-up">
            <div className="text-center mb-6">
              <span className="text-4xl mb-3 block animate-float">🌙</span>
              <h2 className="dream-title-glow text-2xl font-semibold text-[#F5F5F5]" style={{ fontFamily: "Cormorant Garamond, serif" }}>Begin Your Journey</h2>
              <p className="text-[#B0B0C0] text-sm mt-1">Create your account to start recording dreams.</p>
            </div>
            <button
              type="button"
              disabled={authLoading}
              onClick={handleGoogleSignUp}
              className="btn-oauth w-full py-3 text-sm font-medium flex items-center justify-center gap-2"
            >
              <GoogleIcon />
              Continue with Google
            </button>
            <div className="auth-divider my-4">or</div>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-[#B0B0C0] text-sm mb-1.5">Email</label>
                <input type="email" className="dream-input px-4 py-2.5 text-sm" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="block text-[#B0B0C0] text-sm mb-1.5">Password</label>
                <input type="password" className="dream-input px-4 py-2.5 text-sm" placeholder="Choose a secure password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
              </div>
              {authError && <p className="text-[#FF6B81] text-sm">{authError}</p>}
              <button type="submit" disabled={authLoading} className="btn-primary w-full py-3 text-sm font-medium mt-2">
                {authLoading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Entering...</span> : "Enter the Dream Realm →"}
              </button>
            </form>
            <p className="text-center text-[#B0B0C0] text-xs mt-4">Already have an account? <Link href="/login" className="text-[#9F7AEA] hover:underline">Sign in</Link></p>
          </div>
        </div>
      )}

      {step === "dream" && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="dream-card p-8 w-full max-w-lg animate-slide-up">
            <div className="text-center mb-6">
              <h2 className="dream-title-glow text-2xl font-semibold text-[#F5F5F5]" style={{ fontFamily: "Cormorant Garamond, serif" }}>Your First Dream</h2>
              <p className="text-[#B0B0C0] text-sm mt-1">Capture what your subconscious showed you last night.</p>
            </div>
            <DreamEntryForm simplified onSubmit={handleFirstDream} submitLabel="Save Dream & Enter App" />
          </div>
        </div>
      )}
    </div>
  );
}

function LandingContent({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="flex-1 flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="animate-float mb-6"><span className="text-7xl">🌙</span></div>
        <h1 className="dream-title-glow text-5xl sm:text-6xl font-bold text-[#F5F5F5] mb-4 leading-tight"
          style={{ fontFamily: "Cinzel Decorative, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
          Capture Your Nightly Journeys
        </h1>
        <p className="text-[#B0B0C0] text-lg sm:text-xl max-w-xl mx-auto mb-8 leading-relaxed"
          style={{ fontFamily: "Cormorant Garamond, serif" }}>
          Track your dreams. Unlock AI-powered insights. Discover the language of your subconscious.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <button onClick={onBegin} className="btn-primary px-8 py-3.5 text-base font-medium">Begin Your Journey ✦</button>
          <Link href="/login" className="text-[#B0B0C0] hover:text-[#F5F5F5] transition-colors text-sm px-4 py-3">Already have an account →</Link>
        </div>
        <p className="text-[#B0B0C0] text-xs opacity-70">Free tier includes 5 AI dream insights · No credit card required</p>
      </section>
      <section className="max-w-5xl mx-auto px-4 pb-20 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: "📖", title: "Detailed Journaling", desc: "Record every detail — mood, lucidity, tags, and the full narrative of each dream." },
          { icon: "✦", title: "AI Dream Analysis", desc: "Gemini AI reveals recurring themes, symbolic meanings, and emotional patterns in your dreams." },
          { icon: "🔒", title: "Privacy First", desc: "Your dreams are encrypted client-side with AES-256. Only you can read them." },
        ].map((f) => (
          <div key={f.title} className="dream-card p-6 text-center">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="text-[#F5F5F5] font-semibold mb-2 dream-title-glow" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.15rem" }}>{f.title}</h3>
            <p className="text-[#B0B0C0] text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>
      <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
        <h2 className="dream-title-glow text-3xl font-semibold text-[#F5F5F5] mb-8" style={{ fontFamily: "Cormorant Garamond, serif" }}>Simple, Transparent Pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="dream-card p-6">
            <h3 className="text-[#F5F5F5] text-lg font-semibold mb-1">Free</h3>
            <p className="text-[#9F7AEA] text-3xl font-bold mb-4">₹0</p>
            <ul className="space-y-2 text-[#B0B0C0] text-sm mb-6">
              <li>✓ Unlimited dream recordings</li><li>✓ Full metadata & tagging</li>
              <li>✓ 5 AI dream insights</li><li>✓ AES-256 encryption</li>
            </ul>
            <button onClick={onBegin} className="btn-primary w-full py-2.5 text-sm">Get Started Free</button>
          </div>
          <div className="paywall-card p-6">
            <h3 className="lucid-glow text-lg font-semibold mb-1">Premium</h3>
            <p className="text-[#C9A0FF] text-3xl font-bold mb-4">₹499<span className="text-base font-normal text-[#B0B0C0]">/mo</span></p>
            <ul className="space-y-2 text-[#B0B0C0] text-sm mb-6">
              <li>✓ Everything in Free</li><li>✓ <strong className="text-[#C9A0FF]">Unlimited</strong> AI insights</li>
              <li>✓ Deep pattern analysis</li><li>✓ Priority support</li>
            </ul>
            <button onClick={onBegin} className="btn-primary btn-lucid w-full py-2.5 text-sm">Unlock Full Potential ✦</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.648 32.658 29.201 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.176 6.053 29.3 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"/>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 16.108 19.01 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.176 6.053 29.3 4 24 4c-7.682 0-14.354 4.338-17.694 10.691z"/>
      <path fill="#4CAF50" d="M24 44c5.103 0 9.89-1.961 13.445-5.157l-6.213-5.257C29.113 35.091 26.689 36 24 36c-5.178 0-9.607-3.307-11.271-7.946l-6.52 5.025C9.505 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.071 5.586h.003l6.213 5.257C36.999 39.257 44 34 44 24c0-1.341-.138-2.651-.389-3.917z"/>
    </svg>
  );
}

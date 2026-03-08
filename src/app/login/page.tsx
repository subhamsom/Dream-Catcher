"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      if (typeof window !== "undefined") localStorage.setItem("dc_oauth_next", "/dashboard");
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (err) { setError(err.message); setLoading(false); }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to sign in with Google");
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); setLoading(false); }
    else router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-[#9F7AEA]/10 bg-[#0A0E1F]/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl">🌙</span>
            <span className="dream-title-glow text-lg font-bold text-[#F5F5F5]" style={{ fontFamily: "Cinzel Decorative, serif", fontSize: "0.95rem" }}>Dream Catcher</span>
          </Link>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="dream-card p-8 w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <span className="text-5xl mb-3 block animate-float">🌙</span>
            <h1 className="dream-title-glow text-3xl font-semibold text-[#F5F5F5]" style={{ fontFamily: "Cormorant Garamond, serif" }}>Welcome Back</h1>
            <p className="text-[#B0B0C0] text-sm mt-1">Return to your dream journal.</p>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="btn-oauth w-full py-3 text-sm font-medium flex items-center justify-center gap-2"
          >
            <GoogleIcon />
            Continue with Google
          </button>
          <div className="auth-divider my-4">or</div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[#B0B0C0] text-sm mb-1.5">Email</label>
              <input type="email" className="dream-input px-4 py-2.5 text-sm" placeholder="your@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div>
              <label className="block text-[#B0B0C0] text-sm mb-1.5">Password</label>
              <input type="password" className="dream-input px-4 py-2.5 text-sm" placeholder="Your password"
                value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>
            {error && <p className="text-[#FF6B81] text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm font-medium mt-2">
              {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</span> : "Enter the Dream Realm →"}
            </button>
          </form>
          <p className="text-center text-[#B0B0C0] text-xs mt-6">New here? <Link href="/" className="text-[#9F7AEA] hover:underline">Create an account</Link></p>
        </div>
      </div>
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

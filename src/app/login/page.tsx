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
          <Link href="/" className="flex items-center gap-2">
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

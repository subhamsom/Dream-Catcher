"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const oauthError = params.get("error_description") || params.get("error");
        if (oauthError) {
          setError(oauthError);
          return;
        }

        const code = params.get("code");
        if (code) {
          const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeErr) {
            setError(exchangeErr.message);
            return;
          }
        }

        // Best-effort: ensure user profile exists (depends on RLS policies)
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("users").upsert(
            {
              id: user.id,
              email: user.email,
              free_insights_used: 0,
              subscription_status: "FREE",
              is_active: true,
            },
            { onConflict: "id" }
          );
        }

        const next = localStorage.getItem("dc_oauth_next") || "/dashboard";
        localStorage.removeItem("dc_oauth_next");
        router.replace(next);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Authentication failed");
      }
    };

    run();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-[#9F7AEA]/10 bg-[#0A0E1F]/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🌙</span>
            <span
              className="dream-title-glow text-lg font-bold text-[#F5F5F5]"
              style={{ fontFamily: "Cinzel Decorative, serif", fontSize: "0.95rem" }}
            >
              Dream Catcher
            </span>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="dream-card p-8 w-full max-w-md animate-slide-up text-center">
          <div className="text-5xl mb-4 animate-float">🌙</div>
          <h1
            className="dream-title-glow text-2xl font-semibold text-[#F5F5F5]"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Returning from Google…
          </h1>
          <p className="text-[#B0B0C0] text-sm mt-2">
            We’re weaving your session into the dreamscape.
          </p>

          {error && (
            <div className="mt-5">
              <p className="text-[#FF6B81] text-sm">{error}</p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <Link href="/login" className="btn-primary px-5 py-2.5 text-sm">Back to Sign In</Link>
                <Link href="/" className="text-[#B0B0C0] hover:text-[#F5F5F5] text-sm">Home</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


"use client";
import Link from "next/link";
import type { User } from "@/lib/types";
import InsightCounter from "@/components/ui/InsightCounter";

export default function NavBar({ user }: { user?: User | null }) {
  return (
    <nav className="sticky top-0 z-40 border-b border-[#9F7AEA]/10 bg-[#0A0E1F]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl">🌙</span>
          <span className="dream-title-glow text-lg font-bold text-[#F5F5F5]"
            style={{ fontFamily: "Cinzel Decorative, serif", fontSize: "1rem" }}>
            Dream Catcher
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <InsightCounter user={user} />
              <Link href="/dashboard/new" className="btn-primary px-4 py-2 text-sm">+ New Dream</Link>
              <Link href="/settings" className="text-[#B0B0C0] hover:text-[#F5F5F5] transition-colors text-sm">Settings</Link>
            </>
          ) : (
            <Link href="/login" className="btn-primary px-4 py-2 text-sm">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

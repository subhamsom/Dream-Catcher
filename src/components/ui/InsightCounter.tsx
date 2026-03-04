"use client";
import Link from "next/link";
import type { User } from "@/lib/types";

const FREE_LIMIT = 5;

export default function InsightCounter({ user }: { user: User }) {
  const isPremium = user.subscription_status === "ACTIVE";
  const remaining = FREE_LIMIT - user.free_insights_used;

  if (isPremium) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C9A0FF]/30 bg-[#C9A0FF]/10">
        <span className="text-[#C9A0FF] text-sm">✦</span>
        <span className="text-[#C9A0FF] text-xs font-medium">Unlimited Access</span>
      </div>
    );
  }

  return (
    <Link href="/upgrade">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#9F7AEA]/30 bg-[#9F7AEA]/10 hover:border-[#9F7AEA]/60 transition-colors cursor-pointer">
        <div className="flex gap-0.5">
          {Array.from({ length: FREE_LIMIT }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full transition-all"
              style={{
                background: i < remaining ? "#9F7AEA" : "rgba(159,122,234,0.2)",
                boxShadow: i < remaining ? "0 0 4px rgba(159,122,234,0.6)" : "none",
              }} />
          ))}
        </div>
        <span className="text-[#B0B0C0] text-xs">{remaining}/{FREE_LIMIT} insights</span>
      </div>
    </Link>
  );
}

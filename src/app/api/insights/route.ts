import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { generateDreamInsight } from "@/lib/gemini";
import type { DreamEntry } from "@/lib/types";

const FREE_INSIGHT_LIMIT = 5;

export async function POST(req: NextRequest) {
  try {
    const { dream_id, user_id } = await req.json();
    if (!dream_id || !user_id) return NextResponse.json({ error: "dream_id and user_id required" }, { status: 400 });

    const db = createServiceClient();
    const { data: user, error: userErr } = await db.from("users")
      .select("free_insights_used, subscription_status").eq("id", user_id).single();
    if (userErr || !user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isPremium = user.subscription_status === "ACTIVE";
    if (!isPremium && user.free_insights_used >= FREE_INSIGHT_LIMIT) {
      return NextResponse.json({ error: "QUOTA_EXCEEDED", message: "You have used all 5 free insights." }, { status: 402 });
    }

    const { data: existingInsight } = await db.from("gemini_insights").select("*").eq("dream_id", dream_id).single();
    if (existingInsight) return NextResponse.json({ insight: existingInsight });

    const { data: dreamData, error: dreamErr } = await db.from("dream_entries")
      .select(`*, tags:dream_tags(tag_text)`).eq("id", dream_id).single();
    if (dreamErr || !dreamData) return NextResponse.json({ error: "Dream not found" }, { status: 404 });

    const dream: DreamEntry = {
      ...dreamData,
      tags: (dreamData.tags || []).map((t: { tag_text: string }) => t.tag_text),
      dream_content: dreamData.dream_content_encrypted || "",
    };

    const insightContent = await generateDreamInsight(dream);
    const { data: insight, error: insightErr } = await db.from("gemini_insights")
      .insert({ dream_id, insight_content: insightContent, analysis_type: "Thematic" }).select().single();
    if (insightErr) throw insightErr;

    if (!isPremium) {
      await db.from("users").update({ free_insights_used: user.free_insights_used + 1 }).eq("id", user_id);
    }
    return NextResponse.json({ insight });
  } catch (error) {
    console.error("POST /api/insights error:", error);
    return NextResponse.json({ error: "Failed to generate insight" }, { status: 500 });
  }
}

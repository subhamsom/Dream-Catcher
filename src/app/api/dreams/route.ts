import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { user_id, record_date, title, dream_content_encrypted, mood_upon_waking, is_lucid, tags } = await req.json();

    if (!user_id || !dream_content_encrypted) {
      return NextResponse.json(
        { error: "Missing required fields: user_id and dream_content_encrypted are required." },
        { status: 400 }
      );
    }

    const db = createServiceClient();
    const { data: dream, error: dreamError } = await db
      .from("dream_entries")
      .insert({
        user_id,
        record_date: record_date || new Date().toISOString().split("T")[0],
        title: title || null,
        dream_content_encrypted,
        mood_upon_waking: mood_upon_waking || "Neutral",
        is_lucid: is_lucid ?? false,
      })
      .select()
      .single();

    if (dreamError) {
      console.error("POST /api/dreams Supabase insert error:", dreamError);
      return NextResponse.json({ error: dreamError.message }, { status: 400 });
    }

    if (Array.isArray(tags) && tags.length > 0) {
      const { error: tagsError } = await db
        .from("dream_tags")
        .insert(tags.map((tag: string) => ({ dream_id: dream.id, tag_text: tag })));

      if (tagsError) {
        console.error("POST /api/dreams Supabase tags insert error:", tagsError);
        return NextResponse.json({ error: tagsError.message }, { status: 400 });
      }
    }

    return NextResponse.json({ dream }, { status: 201 });
  } catch (error) {
    console.error("POST /api/dreams error:", error);
    const message = error instanceof Error ? error.message : "Failed to save dream";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");
    const search = searchParams.get("search");
    const mood = searchParams.get("mood");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    if (!userId) return NextResponse.json({ error: "user_id required" }, { status: 400 });

    const db = createServiceClient();
    let query = db.from("dream_entries")
      .select(`*, tags:dream_tags(tag_text), insight:gemini_insights(*)`)
      .eq("user_id", userId).order("record_date", { ascending: false });
    if (mood) query = query.eq("mood_upon_waking", mood);
    if (from) query = query.gte("record_date", from);
    if (to) query = query.lte("record_date", to);

    const { data, error } = await query;
    if (error) throw error;

    let dreams = (data || []).map((d) => ({
      ...d, tags: (d.tags || []).map((t: { tag_text: string }) => t.tag_text), insight: d.insight?.[0] || null,
    }));
    if (search) {
      const q = search.toLowerCase();
      dreams = dreams.filter((d) => d.title?.toLowerCase().includes(q) || d.tags.some((t: string) => t.toLowerCase().includes(q)));
    }
    return NextResponse.json({ dreams });
  } catch (error) {
    console.error("GET /api/dreams error:", error);
    return NextResponse.json({ error: "Failed to fetch dreams" }, { status: 500 });
  }
}

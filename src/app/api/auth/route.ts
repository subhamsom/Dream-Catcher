import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, action } = await req.json();
    const db = createServiceClient();

    if (action === "signup") {
      const { data, error } = await db.auth.admin.createUser({ email, email_confirm: true });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      await db.from("users").insert({ id: data.user.id, email, free_insights_used: 0, subscription_status: "FREE", is_active: true });
      return NextResponse.json({ user: data.user });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/auth error:", error);
    return NextResponse.json({ error: "Auth failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { user_id } = await req.json();
    if (!user_id) return NextResponse.json({ error: "user_id required" }, { status: 400 });
    const db = createServiceClient();
    // Cascade deletes: dream_tags, gemini_insights, dream_entries, then users
    await db.from("gemini_insights").delete().in(
      "dream_id",
      (await db.from("dream_entries").select("id").eq("user_id", user_id)).data?.map((d: { id: string }) => d.id) ?? []
    );
    await db.from("dream_tags").delete().in(
      "dream_id",
      (await db.from("dream_entries").select("id").eq("user_id", user_id)).data?.map((d: { id: string }) => d.id) ?? []
    );
    await db.from("dream_entries").delete().eq("user_id", user_id);
    await db.from("users").delete().eq("id", user_id);
    await db.auth.admin.deleteUser(user_id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/auth error:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

const isStripeConfigured = () =>
  !!(
    process.env.STRIPE_SECRET_KEY?.trim() &&
    process.env.STRIPE_PRICE_ID?.trim()
  );

/** POST /api/subscription — create Stripe Checkout session */
export async function POST(req: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json({ coming_soon: true });
    }
    const { user_id, email } = await req.json();
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscribed=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade?cancelled=true`,
      metadata: { user_id },
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}

/** PUT /api/subscription — Stripe webhook handler */
export async function PUT(req: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json({ received: true });
    }
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const body = await req.text();
    const sig = req.headers.get("stripe-signature")!;
    let event;
    try { event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!); }
    catch { return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 }); }

    const db = createServiceClient();
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as { metadata?: { user_id?: string }; subscription?: string };
      const userId = session.metadata?.user_id;
      if (userId) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        const endDate = new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000).toISOString();
        await db.from("users").update({ subscription_status: "ACTIVE", subscription_end_date: endDate }).eq("id", userId);
      }
    }
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as { metadata?: { user_id?: string } };
      if (sub.metadata?.user_id) {
        await db.from("users").update({ subscription_status: "EXPIRED", subscription_end_date: null }).eq("id", sub.metadata.user_id);
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}

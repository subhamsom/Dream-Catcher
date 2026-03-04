# 🌙 Dream Catcher

> A stylized, AI-powered dream journal. Track your nightly journeys and unlock Gemini-driven insights into your subconscious.

## Features

- **Dream Recording** — Log dreams with title, date, mood, lucid flag, and tags
- **AI Insights** — Gemini AI analyzes symbolism, emotional patterns, and waking-life connections
- **Freemium Model** — 5 free AI insights; upgrade to Premium (₹499/mo) for unlimited access
- **Dark Aesthetic** — Deep navy/indigo theme with ethereal violet accents and cosmic animations
- **Client-Side Encryption** — AES-256-GCM encryption for dream content privacy
- **Dashboard** — Search, filter by mood/date, and visualize dream statistics

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 15, React 19, Tailwind CSS |
| Database & Auth | Supabase (PostgreSQL + Auth) |
| AI | Google Gemini 1.5 Flash |
| Payments | Stripe (recurring subscriptions) |
| Deployment | Vercel |

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables

Copy `.env.local` and fill in your credentials:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up the database

Run `supabase/schema.sql` in your Supabase project's SQL editor. This creates:
- `users`, `dream_entries`, `dream_tags`, `gemini_insights` tables
- Row Level Security policies (users only see their own data)
- Auto-profile trigger (creates a `users` row on sign-up)

### 4. Set up Stripe

1. Create a product in Stripe Dashboard: **₹499/month subscription**
2. Copy the **Price ID** → `STRIPE_PRICE_ID`
3. Set up a webhook pointing to `POST /api/subscription` with events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    page.tsx                  # Landing page + sign-up + first dream flow
    login/page.tsx            # Login page
    dashboard/page.tsx        # Dream list + search + filters + stats
    dashboard/new/page.tsx    # New dream entry form
    dream/[id]/page.tsx       # Dream detail + AI insight
    upgrade/page.tsx          # Subscription / paywall page
    settings/page.tsx         # Account settings + sign out + delete
    api/
      auth/route.ts           # Sign-up & account deletion
      dreams/route.ts         # Dream CRUD (GET, POST)
      insights/route.ts       # Gemini insight generation + quota check
      subscription/route.ts   # Stripe checkout + webhook
  components/
    forms/DreamEntryForm.tsx
    layout/NavBar.tsx
    ui/DreamCard.tsx, DreamStatsWidget.tsx, InsightCounter.tsx, Modal.tsx
  context/
    AuthContext.tsx, DreamContext.tsx
  lib/
    supabase.ts, gemini.ts, encryption.ts, types.ts, utils.ts
supabase/
  schema.sql                  # Full database schema + RLS + triggers
```

## Monetization

- **Free**: Unlimited dreams, 5 AI insights/month (resets on 1st of month)
- **Premium (₹499/mo)**: Unlimited AI insights

## Privacy

Dream content is encrypted client-side with AES-256-GCM before being sent to the server. Only the ciphertext is stored in Supabase.

export type Mood = "Happy" | "Anxious" | "Calm" | "Neutral" | "Excited";

export type SubscriptionStatus = "FREE" | "ACTIVE" | "TRIAL" | "EXPIRED";

export interface User {
  id: string;
  email: string;
  created_at: string;
  free_insights_used: number;
  subscription_status: SubscriptionStatus;
  subscription_end_date?: string | null;
}

export interface DreamEntry {
  id: string;
  user_id: string;
  record_date: string;
  title?: string | null;
  dream_content: string;
  mood_upon_waking: Mood;
  is_lucid: boolean;
  tags: string[];
  recorded_at: string;
  insight?: GeminiInsight | null;
}

export interface GeminiInsight {
  id: string;
  dream_id: string;
  insight_content: string;
  insight_generated_at: string;
  analysis_type: string;
}

export interface DreamStats {
  total: number;
  lucidCount: number;
  lucidPercentage: number;
  moodDistribution: Record<Mood, number>;
  recentFrequency: { date: string; count: number }[];
}

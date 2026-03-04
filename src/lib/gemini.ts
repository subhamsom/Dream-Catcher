import { GoogleGenerativeAI } from "@google/generative-ai";
import type { DreamEntry } from "./types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateDreamInsight(dream: DreamEntry): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are a compassionate and insightful dream analyst with expertise in Jungian psychology, symbolism, and emotional intelligence.

Analyze the following dream journal entry and provide a rich, thoughtful interpretation. Your analysis should feel personal, warm, and illuminating — like a trusted guide into the subconscious.

---
DREAM ENTRY
Date: ${dream.record_date}
Title: ${dream.title || "Untitled"}
Mood Upon Waking: ${dream.mood_upon_waking}
Was Lucid: ${dream.is_lucid ? "Yes" : "No"}
Tags/Keywords: ${dream.tags.join(", ") || "None provided"}

Dream Narrative:
${dream.dream_content}
---

Please structure your response with the following sections:

**🌙 Core Themes & Symbols**
Identify the recurring symbols and themes, and explain their potential psychological significance.

**💜 Emotional Landscape**
Connect the mood upon waking (${dream.mood_upon_waking}) with the emotional undercurrents in the dream.

**✨ Potential Waking Life Connections**
Reflect on how the dream's themes might relate to the dreamer's current waking life.

**🔮 Deeper Significance**
Offer a holistic interpretation of what this dream might be communicating.

Write with poetic sensitivity. Aim for 300-400 words.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

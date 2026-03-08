"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { parseInsightEmbed } from "@/lib/utils";
import type { DreamEntry } from "@/lib/types";

interface DreamContextType {
  dreams: DreamEntry[];
  loading: boolean;
  fetchDreams: (userId: string) => Promise<void>;
  addDream: (dream: DreamEntry) => void;
  updateDream: (dream: DreamEntry) => void;
  removeDream: (dreamId: string) => void;
}

const DreamContext = createContext<DreamContextType>({
  dreams: [], loading: false,
  fetchDreams: async () => {}, addDream: () => {}, updateDream: () => {}, removeDream: () => {},
});

export function DreamProvider({ children }: { children: React.ReactNode }) {
  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDreams = useCallback(async (userId: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("dream_entries")
      .select(`*, tags:dream_tags(tag_text), insight:gemini_insights(*)`)
      .eq("user_id", userId)
      .order("record_date", { ascending: false });
    if (data) {
      setDreams(data.map((d) => ({
        ...d,
        tags: (d.tags || []).map((t: { tag_text: string }) => t.tag_text),
        insight: parseInsightEmbed(d.insight),
        dream_content: d.dream_content_encrypted || "",
      })));
    }
    setLoading(false);
  }, []);

  const addDream = (dream: DreamEntry) => setDreams((prev) => [dream, ...prev]);
  const updateDream = (updated: DreamEntry) => setDreams((prev) => prev.map((d) => d.id === updated.id ? updated : d));
  const removeDream = (dreamId: string) => setDreams((prev) => prev.filter((d) => d.id !== dreamId));

  return (
    <DreamContext.Provider value={{ dreams, loading, fetchDreams, addDream, updateDream, removeDream }}>
      {children}
    </DreamContext.Provider>
  );
}

export const useDreams = () => useContext(DreamContext);

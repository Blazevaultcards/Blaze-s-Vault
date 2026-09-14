import { supabase } from "@/lib/supabaseClient";
import type { Card, GameId, Category } from "@/types";

export async function fetchCards(filters?: {
  game?: GameId | "all";
  category?: Category;
  search?: string;
}): Promise<Card[]> {
  let query = supabase.from("cards").select("*").order("created_at", { ascending: false });

  if (filters?.game && filters.game !== "all") {
    query = query.eq("game", filters.game);
  }
  if (filters?.category) {
    query = query.eq("category", filters.category);
  }
  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Card[];
}

export async function fetchCardById(id: string): Promise<Card | null> {
  const { data, error } = await supabase.from("cards").select("*").eq("id", id).single();
  if (error) return null;
  return data as Card;
}

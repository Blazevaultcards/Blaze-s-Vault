import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FG, MUTED, CARD_BG, BORDER } from "@/theme";
import type { Card, GameId, Category } from "@/types";
import { fetchCards } from "@/lib/cards";
import CardTile from "@/components/CardTile";
import GameFilterBar from "@/components/GameFilterBar";
import { EmptyState } from "@/pages/Home";

interface BrowseProps {
  /** Lock this page to one category (Singles / Sealed Product / Graded Cards pages reuse Browse). */
  category?: Category;
  title: string;
}

export default function Browse({ category, title }: BrowseProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const gameParam = (searchParams.get("game") as GameId | "all") || "all";
  const [search, setSearch] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCards({ game: gameParam, category })
      .then(setCards)
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, [gameParam, category]);

  const visible = search
    ? cards.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : cards;

  return (
    <div className="page-fade px-6 pt-28 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
          <h1 className="font-display font-bold text-4xl" style={{ color: FG }}>
            {title.toUpperCase()}
          </h1>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by card name…"
            className="px-4 py-2 rounded-lg text-sm outline-none w-64"
            style={{ background: CARD_BG, border: `1px solid ${BORDER}`, color: FG }}
          />
        </div>

        <GameFilterBar
          active={gameParam}
          onChange={(id) => {
            const next = new URLSearchParams(searchParams);
            if (id === "all") next.delete("game");
            else next.set("game", id);
            setSearchParams(next);
          }}
        />

        {loading ? (
          <div className="text-sm" style={{ color: MUTED }}>
            Loading…
          </div>
        ) : visible.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visible.map((card) => (
              <CardTile key={card.id} card={card} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

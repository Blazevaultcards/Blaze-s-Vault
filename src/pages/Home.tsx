import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bannerImg from "@/assets/banner.jpeg";
import { RED, GOLD, FIRE, BG, CARD_BG, FG, MUTED, BORDER, GAMES } from "@/theme";
import type { Card, GameId } from "@/types";
import { fetchCards } from "@/lib/cards";
import CardTile from "@/components/CardTile";
import GameFilterBar from "@/components/GameFilterBar";

const GAME_BANNERS: {
  id: GameId;
  label: string;
  desc: string;
  accent: string;
  borderClr: string;
  img: string;
}[] = [
  {
    id: "pokemon",
    label: "Pokémon TCG",
    desc: "Singles, sealed product & vintage",
    accent: "#facc15",
    borderClr: "rgba(250,204,21,0.3)",
    img: "https://images.unsplash.com/photo-1613771404721-1f92d799e49f?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: "yugioh",
    label: "Yu-Gi-Oh!",
    desc: "LOB to modern sets, tournament staples",
    accent: "#a78bfa",
    borderClr: "rgba(167,139,250,0.3)",
    img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: "onepiece",
    label: "One Piece TCG",
    desc: "All sets from OP-01 to latest releases",
    accent: "#f97316",
    borderClr: "rgba(249,115,22,0.3)",
    img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: "riftbound",
    label: "Riftbound",
    desc: "The newest TCG — get in early on Alpha",
    accent: "#06b6d4",
    borderClr: "rgba(6,182,212,0.3)",
    img: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&h=400&fit=crop&auto=format",
  },
];

export default function Home() {
  const [activeGame, setActiveGame] = useState<GameId | "all">("all");
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCards()
      .then(setCards)
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeGame === "all" ? cards : cards.filter((c) => c.game === activeGame);

  return (
    <div className="page-fade">
      {/* Hero Banner */}
      <section className="relative pt-16 overflow-hidden">
        <div className="relative w-full" style={{ maxHeight: "420px" }}>
          <img
            src={bannerImg}
            alt="Blaze's Vault Cards — fire TCG marketplace"
            className="w-full object-cover object-center"
            style={{ maxHeight: "420px", display: "block" }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, transparent, ${BG})` }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgba(8,8,8,0.3) 0%, transparent 15%, transparent 85%, rgba(8,8,8,0.3) 100%)",
            }}
          />
        </div>

        <div className="px-6 pb-14 -mt-2">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                style={{
                  background: "rgba(196,26,26,0.12)",
                  border: `1px solid rgba(196,26,26,0.35)`,
                  color: "#f87171",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: FIRE, boxShadow: `0 0 6px ${FIRE}` }} />
                New Drops Every Week
              </div>
              <h1 className="font-display font-black leading-none" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: FG }}>
                IGNITE YOUR <span className="holo-text">COLLECTION</span>
              </h1>
              <p className="text-sm mt-2 max-w-lg" style={{ color: MUTED }}>
                Premium Pokémon, Yu-Gi-Oh!, One Piece &amp; Riftbound singles — authenticated and shipped fast.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <Link
                  to="/browse"
                  className="px-8 py-3 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${RED}, #7a0f0f)`,
                    color: "#fff",
                    boxShadow: `0 0 30px rgba(196,26,26,0.45)`,
                  }}
                >
                  Browse Cards
                </Link>
                <Link
                  to="/sell"
                  className="px-8 py-3 rounded-xl font-semibold text-base transition-all duration-200"
                  style={{ border: `1px solid ${BORDER}`, color: "#b8a898" }}
                >
                  Sell Your Cards
                </Link>
              </div>
              <div className="flex items-center gap-8">
                {[
                  { val: `${cards.length}+`, label: "Listings" },
                  { val: "99%", label: "Auth." },
                  { val: "48h", label: "Ship" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="font-display font-bold text-xl" style={{ color: GOLD }}>
                      {s.val}
                    </div>
                    <div className="text-xs" style={{ color: MUTED }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        className="w-full h-px mx-auto max-w-6xl"
        style={{ background: `linear-gradient(to right, transparent, ${RED}, ${GOLD}, ${RED}, transparent)`, opacity: 0.5 }}
      />

      {/* Game categories */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display font-bold text-4xl" style={{ color: FG }}>
              SHOP BY GAME
            </h2>
            <Link to="/browse" className="text-sm font-medium" style={{ color: RED }}>
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {GAME_BANNERS.map((g) => (
              <div
                key={g.id}
                className="relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.02]"
                style={{ border: `1px solid ${g.borderClr}`, aspectRatio: "3/4", background: CARD_BG }}
                onClick={() => navigate(`/browse?game=${g.id}`)}
              >
                <img
                  src={g.img}
                  alt={g.label}
                  className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-55 transition-opacity duration-300"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(to top, rgba(8,8,8,0.97) 0%, rgba(8,8,8,0.4) 55%, transparent 100%)` }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-xs font-semibold mb-1" style={{ color: g.accent }}>
                    {cards.filter((c) => c.game === g.id).length} listed
                  </div>
                  <div className="font-display font-bold text-xl leading-tight" style={{ color: FG }}>
                    {g.label}
                  </div>
                  <div className="text-xs mt-1 leading-snug" style={{ color: MUTED }}>
                    {g.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Card listings */}
      <section className="px-6 py-8 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-display font-bold text-4xl" style={{ color: FG }}>
              FEATURED SINGLES
            </h2>
          </div>

          <GameFilterBar active={activeGame} onChange={setActiveGame} />

          {loading ? (
            <div className="text-sm" style={{ color: MUTED }}>
              Loading cards…
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.slice(0, 8).map((card) => (
                <CardTile key={card.id} card={card} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust bar */}
      <section className="px-6 py-10" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "🔒", title: "Authenticated", desc: "Every card verified by experts" },
            { icon: "📦", title: "Secure Shipping", desc: "Padded, tracked on every order" },
            { icon: "↩️", title: "Easy Returns", desc: "30-day hassle-free returns" },
            { icon: "⚡", title: "Fast Dispatch", desc: "Ships within 48 hours" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className="font-semibold text-sm mb-0.5" style={{ color: FG }}>
                  {item.title}
                </div>
                <div className="text-xs" style={{ color: MUTED }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function EmptyState({ message = "No cards found. Check back soon — new stock drops regularly." }: { message?: string }) {
  return (
    <div
      className="rounded-2xl p-10 text-center text-sm"
      style={{ background: CARD_BG, border: `1px solid ${BORDER}`, color: MUTED }}
    >
      {message}
    </div>
  );
}

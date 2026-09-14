import { useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import type { Card } from "@/types";
import { CARD_BG, GOLD, MUTED, FG } from "@/theme";
import { useCart } from "@/context/CartContext";

export default function CardTile({ card }: { card: Card }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(card, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <Link
      to={`/product/${card.id}`}
      className="rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-[1.02] card-shimmer block"
      style={{
        background: CARD_BG,
        border: `1px solid rgba(196,26,26,0.15)`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      }}
    >
      <div className="relative overflow-hidden bg-gray-950" style={{ aspectRatio: "3/4" }}>
        <img
          src={card.image_url}
          alt={card.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {card.foil && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%)",
            }}
          />
        )}
        {card.badge && (
          <div className="absolute top-2 left-2">
            <span
              className="text-white text-xs font-bold px-2 py-0.5 rounded-md"
              style={{ background: card.badge_color || "#c41a1a" }}
            >
              {card.badge}
            </span>
          </div>
        )}
        {card.foil && (
          <div className="absolute top-2 right-2">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-md"
              style={{
                background: "rgba(201,136,42,0.18)",
                border: "1px solid rgba(201,136,42,0.45)",
                color: GOLD,
              }}
            >
              ✦ HOLO
            </span>
          </div>
        )}
        {card.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(8,8,8,0.72)" }}>
            <span className="text-sm font-bold tracking-widest" style={{ color: "#f87171" }}>
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="text-xs mb-0.5" style={{ color: MUTED }}>
          {card.set_name}
        </div>
        <div className="font-display font-bold text-lg leading-tight mb-1" style={{ color: FG }}>
          {card.name}
        </div>
        <div className="text-xs mb-3" style={{ color: "#f87171" }}>
          {card.rarity}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-lg" style={{ color: GOLD }}>
              ${card.price.toFixed(2)}
            </div>
            <div className="text-xs" style={{ color: MUTED }}>
              {card.condition}
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={card.stock <= 0}
            className="px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 disabled:opacity-40"
            style={
              added
                ? { background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)", color: "#4ade80" }
                : { background: "rgba(196,26,26,0.14)", border: "1px solid rgba(196,26,26,0.38)", color: "#f87171" }
            }
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </Link>
  );
}

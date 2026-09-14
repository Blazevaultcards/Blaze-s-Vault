import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FG, MUTED, GOLD, CARD_BG, BORDER, RED } from "@/theme";
import type { Card } from "@/types";
import { fetchCardById } from "@/lib/cards";
import { useCart } from "@/context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchCardById(id)
      .then(setCard)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="pt-28 px-6 text-sm" style={{ color: MUTED }}>Loading…</div>;
  }

  if (!card) {
    return (
      <div className="pt-28 px-6 max-w-6xl mx-auto text-center">
        <p className="text-lg" style={{ color: FG }}>
          We couldn't find that card.
        </p>
        <Link to="/browse" className="text-sm mt-2 inline-block" style={{ color: RED }}>
          ← Back to Browse
        </Link>
      </div>
    );
  }

  return (
    <div className="page-fade px-6 pt-28 pb-24">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: CARD_BG, border: `1px solid ${BORDER}`, aspectRatio: "3/4" }}
        >
          <img src={card.image_url} alt={card.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <div className="text-xs mb-1" style={{ color: MUTED }}>
            {card.set_name}
          </div>
          <h1 className="font-display font-black text-3xl mb-2" style={{ color: FG }}>
            {card.name}
          </h1>
          <div className="text-sm mb-4" style={{ color: "#f87171" }}>
            {card.rarity} {card.foil && "· Holo"}
          </div>

          <div className="font-display font-bold text-3xl mb-1" style={{ color: GOLD }}>
            ${card.price.toFixed(2)}
          </div>
          <div className="text-sm mb-6" style={{ color: MUTED }}>
            Condition: {card.condition} · {card.stock > 0 ? `${card.stock} in stock` : "Sold out"}
          </div>

          {card.description && (
            <p className="text-sm mb-6 leading-relaxed" style={{ color: "#b8a898" }}>
              {card.description}
            </p>
          )}

          <button
            disabled={card.stock <= 0}
            onClick={() => {
              addToCart(card, 1);
              setAdded(true);
              setTimeout(() => setAdded(false), 1500);
            }}
            className="w-full py-3 rounded-xl font-semibold text-base transition-all duration-200 disabled:opacity-40"
            style={
              added
                ? { background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)", color: "#4ade80" }
                : { background: `linear-gradient(135deg, ${RED}, #7a0f0f)`, color: "#fff", boxShadow: `0 0 24px rgba(196,26,26,0.4)` }
            }
          >
            {card.stock <= 0 ? "Sold Out" : added ? "Added to Cart ✓" : "Add to Cart"}
          </button>

          <Link to="/cart" className="block text-center text-sm mt-4" style={{ color: MUTED }}>
            View Cart →
          </Link>
        </div>
      </div>
    </div>
  );
}

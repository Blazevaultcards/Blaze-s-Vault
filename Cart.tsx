import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FG, MUTED, GOLD, CARD_BG, BORDER, RED } from "@/theme";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CartPage() {
  const { lines, setQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/cart" } } });
      return;
    }
    setCheckingOut(true);
    setError(null);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ cardId: l.card.id, quantity: l.quantity })),
          userId: user.id,
          email: user.email,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout.");
      }
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || "Something went wrong starting checkout.");
      setCheckingOut(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="pt-28 px-6 max-w-3xl mx-auto text-center pb-24">
        <h1 className="font-display font-bold text-3xl mb-3" style={{ color: FG }}>
          Your Cart Is Empty
        </h1>
        <p className="text-sm mb-6" style={{ color: MUTED }}>
          Browse the catalog and add something to your vault.
        </p>
        <Link
          to="/browse"
          className="inline-block px-6 py-3 rounded-xl font-semibold"
          style={{ background: `linear-gradient(135deg, ${RED}, #7a0f0f)`, color: "#fff" }}
        >
          Browse Cards
        </Link>
      </div>
    );
  }

  return (
    <div className="page-fade px-6 pt-28 pb-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display font-bold text-4xl mb-8" style={{ color: FG }}>
          YOUR CART
        </h1>

        <div className="space-y-4 mb-8">
          {lines.map((line) => (
            <div
              key={line.card.id}
              className="flex items-center gap-4 rounded-2xl p-4"
              style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
            >
              <img
                src={line.card.image_url}
                alt={line.card.name}
                className="w-16 h-22 object-cover rounded-lg"
                style={{ aspectRatio: "3/4", width: "64px" }}
              />
              <div className="flex-1">
                <div className="font-display font-bold text-base" style={{ color: FG }}>
                  {line.card.name}
                </div>
                <div className="text-xs" style={{ color: MUTED }}>
                  {line.card.set_name} · {line.card.condition}
                </div>
                <div className="font-bold text-sm mt-1" style={{ color: GOLD }}>
                  ${line.card.price.toFixed(2)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(line.card.id, line.quantity - 1)}
                  className="w-7 h-7 rounded-lg text-sm"
                  style={{ border: `1px solid ${BORDER}`, color: FG }}
                >
                  −
                </button>
                <span className="w-6 text-center text-sm" style={{ color: FG }}>
                  {line.quantity}
                </span>
                <button
                  onClick={() => setQuantity(line.card.id, line.quantity + 1)}
                  className="w-7 h-7 rounded-lg text-sm"
                  style={{ border: `1px solid ${BORDER}`, color: FG }}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(line.card.id)}
                className="text-xs ml-2"
                style={{ color: "#f87171" }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <button onClick={clearCart} className="text-xs" style={{ color: MUTED }}>
            Clear cart
          </button>
          <div className="text-right">
            <div className="text-xs" style={{ color: MUTED }}>
              Subtotal
            </div>
            <div className="font-display font-bold text-2xl" style={{ color: GOLD }}>
              ${subtotal.toFixed(2)}
            </div>
          </div>
        </div>

        {error && (
          <div className="text-sm mb-4 px-4 py-3 rounded-lg" style={{ background: "rgba(196,26,26,0.12)", color: "#f87171" }}>
            {error}
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={checkingOut}
          className="w-full py-3 rounded-xl font-semibold text-base transition-all duration-200 disabled:opacity-50"
          style={{ background: `linear-gradient(135deg, ${RED}, #7a0f0f)`, color: "#fff", boxShadow: `0 0 24px rgba(196,26,26,0.4)` }}
        >
          {checkingOut ? "Redirecting to secure checkout…" : user ? "Checkout with Stripe" : "Sign In to Checkout"}
        </button>
        <p className="text-xs text-center mt-3" style={{ color: MUTED }}>
          Payment is processed securely by Stripe. Blaze's Vault never sees your card number.
        </p>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { FG, MUTED, GOLD, RED } from "@/theme";
import { useCart } from "@/context/CartContext";
import { useEffect } from "react";

export function OrderSuccess() {
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="page-fade px-6 pt-32 pb-24 max-w-lg mx-auto text-center">
      <h1 className="font-display font-black text-3xl mb-3" style={{ color: FG }}>
        Order Confirmed 🔥
      </h1>
      <p className="text-sm mb-8" style={{ color: MUTED }}>
        Thanks for your order! A confirmation has been sent to your email, and you can track status
        from your account page.
      </p>
      <Link to="/account" className="text-sm" style={{ color: GOLD }}>
        View Order History →
      </Link>
    </div>
  );
}

export function OrderCancelled() {
  return (
    <div className="page-fade px-6 pt-32 pb-24 max-w-lg mx-auto text-center">
      <h1 className="font-display font-black text-3xl mb-3" style={{ color: FG }}>
        Checkout Cancelled
      </h1>
      <p className="text-sm mb-8" style={{ color: MUTED }}>
        No charge was made. Your cart is still saved.
      </p>
      <Link to="/cart" className="text-sm" style={{ color: RED }}>
        ← Back to Cart
      </Link>
    </div>
  );
}

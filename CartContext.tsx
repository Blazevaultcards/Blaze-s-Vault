import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Card, CartLine } from "@/types";

interface CartContextValue {
  lines: CartLine[];
  addToCart: (card: Card, quantity?: number) => void;
  removeFromCart: (cardId: string) => void;
  setQuantity: (cardId: string, quantity: number) => void;
  clearCart: () => void;
  count: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "blazesvault_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartLine[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore storage errors (private browsing, etc.)
    }
  }, [lines]);

  function addToCart(card: Card, quantity = 1) {
    setLines((prev) => {
      const existing = prev.find((l) => l.card.id === card.id);
      if (existing) {
        return prev.map((l) =>
          l.card.id === card.id ? { ...l, quantity: l.quantity + quantity } : l
        );
      }
      return [...prev, { card, quantity }];
    });
  }

  function removeFromCart(cardId: string) {
    setLines((prev) => prev.filter((l) => l.card.id !== cardId));
  }

  function setQuantity(cardId: string, quantity: number) {
    if (quantity <= 0) return removeFromCart(cardId);
    setLines((prev) => prev.map((l) => (l.card.id === cardId ? { ...l, quantity } : l)));
  }

  function clearCart() {
    setLines([]);
  }

  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.card.price * l.quantity, 0);

  return (
    <CartContext.Provider
      value={{ lines, addToCart, removeFromCart, setQuantity, clearCart, count, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

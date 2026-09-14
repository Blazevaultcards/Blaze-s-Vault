import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FG, MUTED, GOLD, CARD_BG, BORDER, RED } from "@/theme";
import { supabase } from "@/lib/supabaseClient";
import type { Card } from "@/types";

export default function AdminDashboard() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("cards").select("*").order("created_at", { ascending: false });
    setCards((data as Card[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this listing? This can't be undone.")) return;
    await supabase.from("cards").delete().eq("id", id);
    load();
  }

  return (
    <div className="page-fade px-6 pt-28 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display font-bold text-4xl" style={{ color: FG }}>
              ADMIN
            </h1>
            <p className="text-sm" style={{ color: MUTED }}>
              Add, edit, and remove inventory. Only visible to your admin account.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/orders"
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ border: `1px solid ${BORDER}`, color: "#b8a898" }}
            >
              View Orders
            </Link>
            <Link
              to="/admin/sell-requests"
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ border: `1px solid ${BORDER}`, color: "#b8a898" }}
            >
              Sell Requests
            </Link>
            <Link
              to="/admin/cards/new"
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: `linear-gradient(135deg, ${RED}, #7a0f0f)`, color: "#fff" }}
            >
              + Add Card
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-sm" style={{ color: MUTED }}>
            Loading…
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: CARD_BG, color: MUTED }}>
                  <th className="text-left px-4 py-3 font-medium">Card</th>
                  <th className="text-left px-4 py-3 font-medium">Game</th>
                  <th className="text-left px-4 py-3 font-medium">Category</th>
                  <th className="text-left px-4 py-3 font-medium">Price</th>
                  <th className="text-left px-4 py-3 font-medium">Stock</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((c) => (
                  <tr key={c.id} style={{ borderTop: `1px solid ${BORDER}`, color: FG }}>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-xs" style={{ color: MUTED }}>
                        {c.set_name}
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">{c.game}</td>
                    <td className="px-4 py-3 capitalize">{c.category}</td>
                    <td className="px-4 py-3" style={{ color: GOLD }}>
                      ${c.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{c.stock}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/admin/cards/${c.id}`} className="text-xs mr-4" style={{ color: GOLD }}>
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(c.id)} className="text-xs" style={{ color: "#f87171" }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {cards.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center" style={{ color: MUTED }}>
                      No cards yet — add your first listing.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

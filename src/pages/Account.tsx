import { useEffect, useState } from "react";
import { FG, MUTED, GOLD, CARD_BG, BORDER } from "@/theme";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import type { Order } from "@/types";

export default function Account() {
  const { profile, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        setOrders((data as Order[]) || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  return (
    <div className="page-fade px-6 pt-28 pb-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display font-bold text-4xl mb-2" style={{ color: FG }}>
          MY ACCOUNT
        </h1>
        <p className="text-sm mb-10" style={{ color: MUTED }}>
          {profile?.full_name || user?.email} · {user?.email}
        </p>

        <h2 className="font-display font-bold text-xl mb-4" style={{ color: FG }}>
          Order History
        </h2>

        {loading ? (
          <div className="text-sm" style={{ color: MUTED }}>
            Loading…
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl p-8 text-sm text-center" style={{ background: CARD_BG, border: `1px solid ${BORDER}`, color: MUTED }}>
            No orders yet.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-xl p-4" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
                <div>
                  <div className="text-sm font-semibold" style={{ color: FG }}>
                    Order #{o.id.slice(0, 8)}
                  </div>
                  <div className="text-xs" style={{ color: MUTED }}>
                    {new Date(o.created_at).toLocaleDateString()} · {o.status}
                  </div>
                </div>
                <div className="font-bold" style={{ color: GOLD }}>
                  ${o.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

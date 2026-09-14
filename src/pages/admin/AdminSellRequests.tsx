import { useEffect, useState } from "react";
import { FG, MUTED, GOLD, CARD_BG, BORDER } from "@/theme";
import { supabase } from "@/lib/supabaseClient";

type SellSubmission = {
  id: string;
  name: string;
  contact: string;
  details: string;
  created_at: string;
};

export default function AdminSellRequests() {
  const [requests, setRequests] = useState<SellSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("sell_submissions")
          .select("*")
          .order("created_at", { ascending: false });
        setRequests((data as SellSubmission[]) || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="page-fade px-6 pt-28 pb-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display font-bold text-4xl mb-2" style={{ color: FG }}>
          SELL REQUESTS
        </h1>
        <p className="text-sm mb-8" style={{ color: MUTED }}>
          People who've filled out the "Sell Your Cards" form.
        </p>

        {loading ? (
          <div className="text-sm" style={{ color: MUTED }}>
            Loading…
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl p-8 text-sm text-center" style={{ background: CARD_BG, border: `1px solid ${BORDER}`, color: MUTED }}>
            No sell requests yet.
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="rounded-xl p-4" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="font-semibold text-sm" style={{ color: FG }}>
                    {r.name}{" "}
                    <span className="font-normal" style={{ color: GOLD }}>
                      · {r.contact}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: MUTED }}>
                    {new Date(r.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="text-sm whitespace-pre-wrap" style={{ color: "#b8a898" }}>
                  {r.details}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

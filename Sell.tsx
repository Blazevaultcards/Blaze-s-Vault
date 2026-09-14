import { useState, FormEvent } from "react";
import { FG, MUTED, GOLD, CARD_BG, BORDER, RED } from "@/theme";
import { supabase } from "@/lib/supabaseClient";
import { Field } from "@/pages/Login";

export default function Sell() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.from("sell_submissions").insert({
      name,
      contact,
      details,
    });
    setLoading(false);
    if (error) {
      setError("Couldn't submit right now — please DM @blazevaultcards on Instagram instead.");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="page-fade px-6 pt-32 pb-24 max-w-lg mx-auto text-center">
        <h1 className="font-display font-black text-3xl mb-3" style={{ color: FG }}>
          Got It 🔥
        </h1>
        <p className="text-sm" style={{ color: MUTED }}>
          We'll take a look at your collection and reach out to make an offer.
        </p>
      </div>
    );
  }

  return (
    <div className="page-fade px-6 pt-28 pb-24">
      <div className="max-w-lg mx-auto">
        <h1 className="font-display font-bold text-4xl mb-2" style={{ color: FG }}>
          SELL YOUR CARDS
        </h1>
        <p className="text-sm mb-8" style={{ color: MUTED }}>
          Tell us what you've got. We buy singles, sealed product, and full collections.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Your Name" type="text" value={name} onChange={setName} />
          <Field label="Email or Phone" type="text" value={contact} onChange={setContact} />
          <label className="block">
            <span className="text-xs mb-1 block" style={{ color: MUTED }}>
              What are you looking to sell?
            </span>
            <textarea
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={5}
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: CARD_BG, border: `1px solid ${BORDER}`, color: FG }}
              placeholder="e.g. Binder of ~200 modern Pokémon holos, few PSA 9s, some vintage WOTC..."
            />
          </label>

          {error && (
            <div className="text-sm px-4 py-3 rounded-lg" style={{ background: "rgba(196,26,26,0.12)", color: "#f87171" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-base disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, ${RED}, #7a0f0f)`, color: "#fff" }}
          >
            {loading ? "Sending…" : "Submit"}
          </button>
        </form>

        <p className="text-xs text-center mt-6" style={{ color: MUTED }}>
          Prefer social? DM{" "}
          <a href="https://instagram.com/blazevaultcards" target="_blank" rel="noreferrer" style={{ color: GOLD }}>
            @blazevaultcards
          </a>{" "}
          on Instagram.
        </p>
      </div>
    </div>
  );
}

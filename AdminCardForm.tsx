import { useEffect, useState, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FG, MUTED, CARD_BG, BORDER, RED } from "@/theme";
import { supabase } from "@/lib/supabaseClient";
import type { Card } from "@/types";

const EMPTY: Omit<Card, "id" | "created_at"> = {
  game: "pokemon",
  category: "singles",
  name: "",
  set_name: "",
  rarity: "",
  price: 0,
  condition: "Near Mint",
  image_url: "",
  badge: null,
  badge_color: "#c41a1a",
  foil: false,
  stock: 1,
  description: "",
};

export default function AdminCardForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("cards")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) setForm(data as Card);
        setLoading(false);
      });
  }, [id]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let imageUrl = form.image_url;

      if (imageFile) {
        const path = `${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage.from("card-images").upload(path, imageFile);
        if (uploadError) throw uploadError;
        const { data: publicUrl } = supabase.storage.from("card-images").getPublicUrl(path);
        imageUrl = publicUrl.publicUrl;
      }

      const payload = { ...form, image_url: imageUrl };

      if (isEdit) {
        const { error: updateError } = await supabase.from("cards").update(payload).eq("id", id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("cards").insert(payload);
        if (insertError) throw insertError;
      }

      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Could not save this card.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="pt-28 px-6 text-sm" style={{ color: MUTED }}>Loading…</div>;

  return (
    <div className="page-fade px-6 pt-28 pb-24">
      <div className="max-w-xl mx-auto">
        <h1 className="font-display font-bold text-3xl mb-6" style={{ color: FG }}>
          {isEdit ? "EDIT CARD" : "ADD CARD"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Game" value={form.game} onChange={(v) => update("game", v as Card["game"])} options={["pokemon", "yugioh", "onepiece", "riftbound"]} />
            <Select label="Category" value={form.category} onChange={(v) => update("category", v as Card["category"])} options={["singles", "sealed", "graded"]} />
          </div>

          <Text label="Name" value={form.name} onChange={(v) => update("name", v)} required />
          <Text label="Set" value={form.set_name} onChange={(v) => update("set_name", v)} required />
          <Text label="Rarity" value={form.rarity} onChange={(v) => update("rarity", v)} />

          <div className="grid grid-cols-2 gap-4">
            <Text label="Price (USD)" type="number" value={String(form.price)} onChange={(v) => update("price", parseFloat(v) || 0)} required />
            <Text label="Stock" type="number" value={String(form.stock)} onChange={(v) => update("stock", parseInt(v) || 0)} required />
          </div>

          <Text label="Condition" value={form.condition} onChange={(v) => update("condition", v)} />

          <div className="grid grid-cols-2 gap-4">
            <Text label="Badge text (optional)" value={form.badge || ""} onChange={(v) => update("badge", v)} />
            <Text label="Badge color" type="color" value={form.badge_color || "#c41a1a"} onChange={(v) => update("badge_color", v)} />
          </div>

          <label className="flex items-center gap-2 text-sm" style={{ color: FG }}>
            <input type="checkbox" checked={form.foil} onChange={(e) => update("foil", e.target.checked)} />
            Holo / foil finish
          </label>

          <label className="block">
            <span className="text-xs mb-1 block" style={{ color: MUTED }}>
              Card Image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="text-sm"
              style={{ color: FG }}
            />
            {!imageFile && (
              <Text label="or paste an image URL" value={form.image_url} onChange={(v) => update("image_url", v)} />
            )}
          </label>

          <label className="block">
            <span className="text-xs mb-1 block" style={{ color: MUTED }}>
              Description (optional)
            </span>
            <textarea
              rows={3}
              value={form.description || ""}
              onChange={(e) => update("description", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: CARD_BG, border: `1px solid ${BORDER}`, color: FG }}
            />
          </label>

          {error && (
            <div className="text-sm px-4 py-3 rounded-lg" style={{ background: "rgba(196,26,26,0.12)", color: "#f87171" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl font-semibold text-base disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, ${RED}, #7a0f0f)`, color: "#fff" }}
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Card"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Text({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs mb-1 block" style={{ color: MUTED }}>
        {label}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
        style={{ background: CARD_BG, border: `1px solid ${BORDER}`, color: FG }}
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="text-xs mb-1 block" style={{ color: MUTED }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg text-sm outline-none capitalize"
        style={{ background: CARD_BG, border: `1px solid ${BORDER}`, color: FG }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Drop-in replacement for the Claude-artifact `window.storage` API,
 * backed by a single `store_data` table (key text primary key, value text).
 * The `shared` argument is accepted for API compatibility but ignored —
 * every row in this table is effectively "shared" already.
 */
export const storage = {
  async get(key, _shared) {
    const { data, error } = await supabase
      .from("store_data")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error(`key not found: ${key}`); // mirrors window.storage's throw-on-missing behavior
    return { key, value: data.value, shared: true };
  },

  async set(key, value, _shared) {
    const { error } = await supabase
      .from("store_data")
      .upsert({ key, value }, { onConflict: "key" });

    if (error) throw error;
    return { key, value, shared: true };
  },

  async delete(key, _shared) {
    const { error } = await supabase.from("store_data").delete().eq("key", key);
    if (error) throw error;
    return { key, deleted: true, shared: true };
  },
};

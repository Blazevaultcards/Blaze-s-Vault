# Blaze's Vault

## 1. Set up Supabase (free)

1. Go to supabase.com → New project (any name, any region).
2. Once it's created, open **SQL Editor** → New query, paste in the contents of `supabase-setup.sql`, and run it.
3. Go to **Project Settings → API**. Copy the **Project URL** and the **anon public** key.

## 2. Configure the app

1. Copy `.env.example` to `.env`.
2. Paste your Project URL into `VITE_SUPABASE_URL` and your anon key into `VITE_SUPABASE_ANON_KEY`.

## 3. Run it locally (optional, to test first)

```
npm install
npm run dev
```

Opens at http://localhost:5173 — your catalog now saves to Supabase instead of just your browser.

## 4. Deploy for free (Vercel)

1. Push this folder to a new GitHub repo.
2. Go to vercel.com → New Project → import that repo.
3. Vercel auto-detects Vite. Before deploying, add your two env vars (same as your `.env`) under **Environment Variables**.
4. Deploy. You'll get a live URL like `blazevault-cards.vercel.app`.
5. (Optional) Add a custom domain later under Project Settings → Domains.

## Notes

- The catalog and orders now live in Supabase, so listings you add from the admin panel show up for every visitor, from any device.
- The `store_data` table's write access is currently open to anyone with your public anon key (see the comment in `supabase-setup.sql`). Fine for a small shop where you're the only one touching the admin panel — just don't publish the admin gear-icon flow anywhere public.
- Card photos are stored as embedded base64 inside the catalog data. That's fine for a handful of listings; if your catalog grows large, ask to move photos to Supabase Storage instead for better performance.

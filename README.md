# Blaze's Vault Cards

A real, deployable TCG storefront matching your Figma Make design — customer accounts,
a full catalog (Browse / Singles / Sealed Product / Graded Cards), a cart, real Stripe
checkout, and an admin-only dashboard for adding/editing cards, at your own domain.

## What's here

- **Frontend:** React + TypeScript + Tailwind v4, built with Vite. Pages: Home, Browse,
  Singles, Sealed Product, Graded Cards, Product Detail, Cart, Sign In / Create Account,
  My Account (order history), Sell Your Cards, About.
- **Auth & database:** Supabase (free tier works fine to start). Customers sign up for
  normal accounts. You get a *second* role — `admin` — on your own account, which is
  the only thing that unlocks `/admin` (add, edit, delete cards; view all orders).
  Regular customers never see or can reach the admin pages, even if they guess the URL —
  it's enforced by the database itself (Row Level Security), not just hidden in the UI.
- **Payments:** Stripe Checkout (Stripe's own hosted payment page) via two small
  serverless functions in `/api`. This is what actually replaces eBay — customers pay
  you directly, no marketplace cut.
- **Hosting:** Built for Vercel, which serves the site AND the `/api` functions together,
  and connects cleanly to a domain you already own.

Total ongoing cost at low volume: Vercel free tier ($0), Supabase free tier ($0), Stripe
takes 2.9% + $0.30 per transaction (only when you actually get paid — no monthly fee).

---

## 1. Add your real logo and banner images

I didn't have your actual logo/banner files, so `src/assets/logo.jpeg` and
`src/assets/banner.jpeg` are placeholders right now. Replace those two files with your
real images (same filenames, or update the two `import logoImg from ...` lines in
`src/components/Navbar.tsx`, `src/components/Footer.tsx`, and `src/pages/Home.tsx` if
you rename them).

## 2. Create a Supabase project (free)

1. Go to [supabase.com](https://supabase.com) → New Project. Pick any name/region, set
   a database password (save it somewhere).
2. Once it's created, go to **Project Settings → API**. You'll need three values:
   - `Project URL`
   - `anon public` key
   - `service_role` key (click "reveal" — keep this one secret, never put it in the
     frontend)
3. Go to **SQL Editor → New Query**, paste in the entire contents of
   `supabase/schema.sql` from this project, and click Run. This creates all the tables
   (cards, profiles, orders, etc.), the security rules that lock `/admin` to your
   account only, a storage bucket for card photos, and a few sample cards so the site
   isn't empty on first load.

## 3. Create your admin account

1. Once the site is live (step 6 below), go to `/signup` on your site and create an
   account with your own email — this account starts as a normal "customer".
2. Back in Supabase → SQL Editor, run (with your real email):
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```
3. Sign out and back in on the site. You'll now see an **Admin** link in the nav — that
   takes you to `/admin`, where you can add, edit, and delete card listings, and see all
   orders. No other account can reach this.

## 4. Create a Stripe account

1. Go to [stripe.com](https://stripe.com) and create an account (use your business info
   for Crestshire/BlazeVault as appropriate — Stripe will ask for basic identity/bank
   details before it lets you accept *live* payments, but you can test everything first
   in test mode with no real business info).
2. Go to **Developers → API keys**. Copy the **Secret key** (starts with `sk_test_...`
   while in test mode, `sk_live_...` once you activate the account).
3. You'll add a **webhook** once the site is deployed (step 6) — Stripe needs a live URL
   to send events to, so that step comes after deploying.

## 5. Push this project to GitHub

Vercel deploys straight from a GitHub repo.

```bash
cd blazes-vault
git init
git add .
git commit -m "Blaze's Vault Cards storefront"
```

Create a new empty repo on [github.com/new](https://github.com/new), then:

```bash
git remote add origin https://github.com/YOUR-USERNAME/blazes-vault.git
git branch -M main
git push -u origin main
```

## 6. Deploy to Vercel and connect your domain

1. Go to [vercel.com](https://vercel.com) → sign in with GitHub → **Add New → Project**
   → import the repo you just pushed.
2. Before clicking Deploy, open **Environment Variables** and add all of these
   (values from steps 2 and 4 above):

   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | your Supabase Project URL |
   | `VITE_SUPABASE_ANON_KEY` | your Supabase anon public key |
   | `SUPABASE_URL` | same Project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | your Supabase service_role key |
   | `STRIPE_SECRET_KEY` | your Stripe secret key |
   | `STRIPE_WEBHOOK_SECRET` | *(leave blank for now — added in the next step)* |

3. Click **Deploy**. In a minute or two you'll get a live URL like
   `blazes-vault.vercel.app` — confirm the site loads and shows the sample cards.
4. **Connect your domain:** In the Vercel project → **Settings → Domains** → add your
   domain. Vercel shows you either an A record or a CNAME to add — go to wherever you
   registered the domain (GoDaddy, Namecheap, etc.), open DNS settings, and add that
   record exactly as shown. It usually goes live within a few minutes to a few hours.
5. **Add the Stripe webhook** (this is what marks an order "paid" and updates stock
   after checkout): in Stripe → **Developers → Webhooks → Add endpoint**. Endpoint URL:
   `https://yourdomain.com/api/stripe-webhook`. Select the event
   `checkout.session.completed`. Save, then copy the **Signing secret** (starts with
   `whsec_...`) and add it as `STRIPE_WEBHOOK_SECRET` in Vercel's environment variables
   (Settings → Environment Variables → redeploy so it picks up the change).

That's it — the site is live on your domain, customers can create accounts, browse,
check out with a real card via Stripe, and only your account can add/edit inventory.

---

## Running it locally (optional, if you want to preview changes before pushing)

```bash
npm install
cp .env.example .env
# fill in .env with the same values as the Vercel table above
npm run dev
```

Note: the Stripe checkout button calls `/api/create-checkout-session`, which is a
Vercel serverless function — it won't run with plain `vite dev`. To test checkout
locally, install the Vercel CLI (`npm i -g vercel`) and run `vercel dev` instead.

## Going from test payments to real payments

Everything above works immediately with Stripe **test mode** (test card number
`4242 4242 4242 4242`, any future expiry, any CVC) — good for making sure the whole
flow works before you take real money. When ready: finish Stripe's account activation
(business details, bank account), then swap `STRIPE_SECRET_KEY` in Vercel for your
`sk_live_...` key and redeploy, and re-create the webhook endpoint using live mode.

## Adding/editing cards day to day

Sign in with your admin account → **Admin** in the nav → **Add Card**. Fill in game,
category (singles/sealed/graded), price, condition, stock count, and either upload a
photo or paste an image URL. Edits and deletes work the same way from the Admin table.

## If you want a developer's help later

This is a normal React + Vite + Supabase + Stripe project — no proprietary tooling.
Any web developer (or another AI coding tool) can open this folder and keep building on
it directly.

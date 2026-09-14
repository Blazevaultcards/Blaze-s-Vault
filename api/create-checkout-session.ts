// Vercel Function (Web Standard handler): POST /api/create-checkout-session
// Body: { items: { cardId: string; quantity: number }[], userId: string, email: string }
//
// Prices are re-looked-up from Supabase server-side (never trust the client's
// cart for the amount to charge), then a Stripe Checkout Session is created.
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

// Server-side Supabase client using the SERVICE ROLE key — this bypasses RLS,
// so it must only ever run in this backend function, never be shipped to the browser.
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(request: Request): Promise<Response> {
  try {
    const { items, userId, email } = (await request.json()) as {
      items: { cardId: string; quantity: number }[];
      userId: string;
      email: string;
    };

    if (!items || items.length === 0) {
      return Response.json({ error: "Cart is empty." }, { status: 400 });
    }

    const cardIds = items.map((i) => i.cardId);
    const { data: cards, error } = await supabaseAdmin.from("cards").select("*").in("id", cardIds);
    if (error || !cards) throw new Error("Could not verify cart items.");

    const line_items = items.map((item) => {
      const card = cards.find((c: any) => c.id === item.cardId);
      if (!card) throw new Error("A card in your cart is no longer available.");
      if (card.stock < item.quantity) throw new Error(`Only ${card.stock} left of ${card.name}.`);
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: card.name,
            description: `${card.set_name} · ${card.condition}`,
            images: card.image_url ? [card.image_url] : [],
          },
          unit_amount: Math.round(card.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const origin = request.headers.get("origin") || new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: email,
      shipping_address_collection: { allowed_countries: ["US"] },
      success_url: `${origin}/order/success`,
      cancel_url: `${origin}/order/cancelled`,
      metadata: {
        userId,
        cart: JSON.stringify(items),
      },
    });

    return Response.json({ url: session.url });
  } catch (err: any) {
    return Response.json({ error: err.message || "Checkout failed." }, { status: 400 });
  }
}

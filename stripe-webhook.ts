// Vercel Function (Web Standard handler): POST /api/stripe-webhook
// Configure this URL (https://yourdomain.com/api/stripe-webhook) in the Stripe
// Dashboard under Developers -> Webhooks, listening for checkout.session.completed.
//
// On a successful payment this records the order in Supabase and decrements
// stock for each card purchased. Uses the standard Request object (request.text())
// to get the exact raw body Stripe signed — required for signature verification.
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(request: Request): Promise<Response> {
  const sig = request.headers.get("stripe-signature") as string;
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err: any) {
    return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const cart = session.metadata?.cart ? JSON.parse(session.metadata.cart) : [];

    if (userId) {
      const { data: order } = await supabaseAdmin
        .from("orders")
        .insert({
          user_id: userId,
          status: "paid",
          total: (session.amount_total || 0) / 100,
          stripe_session_id: session.id,
        })
        .select()
        .single();

      for (const item of cart as { cardId: string; quantity: number }[]) {
        const { data: card } = await supabaseAdmin.from("cards").select("price, stock").eq("id", item.cardId).single();
        if (card) {
          await supabaseAdmin
            .from("cards")
            .update({ stock: Math.max(0, card.stock - item.quantity) })
            .eq("id", item.cardId);
        }
        if (order) {
          await supabaseAdmin.from("order_items").insert({
            order_id: order.id,
            card_id: item.cardId,
            quantity: item.quantity,
            price: card?.price ?? 0,
          });
        }
      }
    }
  }

  return Response.json({ received: true });
}

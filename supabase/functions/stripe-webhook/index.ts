// Supabase Edge Function: stripe-webhook
// Handles Stripe subscription events and syncs to database
//
// Deploy via Supabase Dashboard:
// 1. Go to Edge Functions
// 2. Click "New Function"
// 3. Name it "stripe-webhook"
// 4. Paste this code and deploy

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Map Stripe price IDs to subscription tiers
function getTierFromPriceId(priceId: string): string {
  const tierMap: Record<string, string> = {
    [Deno.env.get("STRIPE_PRICE_BASIC_MONTHLY") || ""]: "basic",
    [Deno.env.get("STRIPE_PRICE_BASIC_ANNUAL") || ""]: "basic",
    [Deno.env.get("STRIPE_PRICE_PRO_MONTHLY") || ""]: "pro",
    [Deno.env.get("STRIPE_PRICE_PRO_ANNUAL") || ""]: "pro",
    [Deno.env.get("STRIPE_PRICE_PREMIUM_MONTHLY") || ""]: "premium",
    [Deno.env.get("STRIPE_PRICE_PREMIUM_ANNUAL") || ""]: "premium",
  };
  return tierMap[priceId] || "free";
}

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response(JSON.stringify({ error: "No signature provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log("Received Stripe event:", event.type);

  try {
    switch (event.type) {
      // New subscription created via checkout
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (!subscriptionId) {
          console.log("No subscription in checkout session, skipping");
          break;
        }

        // Get the subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;
        const tier = getTierFromPriceId(priceId);

        console.log(`Checkout completed: customer=${customerId}, tier=${tier}`);

        // Update subscription in database
        const { error } = await supabase
          .from("subscriptions")
          .update({
            tier,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            current_period_start: new Date(
              subscription.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("Error updating subscription:", error);
          throw error;
        }

        console.log("Subscription updated successfully");
        break;
      }

      // Subscription updated (upgrade, downgrade, renewal)
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0].price.id;
        const tier = getTierFromPriceId(priceId);

        console.log(`Subscription updated: customer=${customerId}, tier=${tier}`);

        const { error } = await supabase
          .from("subscriptions")
          .update({
            tier,
            current_period_start: new Date(
              subscription.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("Error updating subscription:", error);
          throw error;
        }

        console.log("Subscription updated successfully");
        break;
      }

      // Subscription cancelled or expired
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        console.log(`Subscription deleted: customer=${customerId}`);

        // Revert to free tier
        const { error } = await supabase
          .from("subscriptions")
          .update({
            tier: "free",
            stripe_subscription_id: null,
            current_period_start: null,
            current_period_end: null,
            cancel_at_period_end: false,
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("Error reverting subscription:", error);
          throw error;
        }

        console.log("Subscription reverted to free tier");
        break;
      }

      // Invoice payment failed
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        console.log(`Payment failed for customer: ${customerId}`);
        // You could send an email notification here
        // or update a payment_status field
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return new Response(JSON.stringify({ error: "Webhook handler failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase admin client with the service role key.
 * WARNING: This client bypasses Row Level Security.
 * Only use in secure server-side contexts (API routes, webhooks, server actions).
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Track an analytics event (bypasses RLS).
 */
export async function trackEvent(
  listingId: string,
  eventType: 'view' | 'website_click' | 'phone_click' | 'inquiry',
  metadata?: {
    visitorId?: string;
    referrer?: string;
    userAgent?: string;
    ipCountry?: string;
  }
) {
  const supabase = createAdminClient();

  const { error } = await supabase.from('analytics_events').insert({
    listing_id: listingId,
    event_type: eventType,
    visitor_id: metadata?.visitorId,
    referrer: metadata?.referrer,
    user_agent: metadata?.userAgent,
    ip_country: metadata?.ipCountry,
  });

  if (error) {
    console.error('Failed to track event:', error);
  }
}

/**
 * Create or update subscription from Stripe webhook.
 */
export async function upsertSubscription(data: {
  operatorId: string;
  tier: 'free' | 'basic' | 'pro';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
}) {
  const supabase = createAdminClient();

  const { error } = await supabase.from('subscriptions').upsert(
    {
      operator_id: data.operatorId,
      tier: data.tier,
      stripe_customer_id: data.stripeCustomerId,
      stripe_subscription_id: data.stripeSubscriptionId,
      current_period_start: data.currentPeriodStart?.toISOString(),
      current_period_end: data.currentPeriodEnd?.toISOString(),
      cancel_at_period_end: data.cancelAtPeriodEnd ?? false,
    },
    {
      onConflict: 'operator_id',
    }
  );

  if (error) {
    console.error('Failed to upsert subscription:', error);
    throw error;
  }
}

/**
 * Create operator profile after signup.
 */
export async function createOperatorProfile(
  userId: string,
  email: string,
  businessName?: string
) {
  const supabase = createAdminClient();

  // Create operator profile
  const { error: operatorError } = await supabase.from('operators').insert({
    id: userId,
    email,
    business_name: businessName,
  });

  if (operatorError) {
    console.error('Failed to create operator:', operatorError);
    throw operatorError;
  }

  // Create free subscription
  const { error: subscriptionError } = await supabase
    .from('subscriptions')
    .insert({
      operator_id: userId,
      tier: 'free',
    });

  if (subscriptionError) {
    console.error('Failed to create subscription:', subscriptionError);
    throw subscriptionError;
  }
}

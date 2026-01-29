import Stripe from 'stripe';

// Lazy initialization to avoid build-time errors when env vars aren't set
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    });
  }
  return stripeInstance;
}

export const stripe = {
  get instance() {
    return getStripe();
  },
};

// Price IDs - these should match your Stripe dashboard
export const PRICE_IDS = {
  basic: {
    monthly: process.env.STRIPE_PRICE_BASIC_MONTHLY || 'price_basic_monthly',
    annual: process.env.STRIPE_PRICE_BASIC_ANNUAL || 'price_basic_annual',
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly',
    annual: process.env.STRIPE_PRICE_PRO_ANNUAL || 'price_pro_annual',
  },
  premium: {
    monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || 'price_premium_monthly',
    annual: process.env.STRIPE_PRICE_PREMIUM_ANNUAL || 'price_premium_annual',
  },
} as const;

// Map Stripe price IDs to tier names
export const PRICE_TO_TIER: Record<string, 'basic' | 'pro' | 'premium'> = {
  [PRICE_IDS.basic.monthly]: 'basic',
  [PRICE_IDS.basic.annual]: 'basic',
  [PRICE_IDS.pro.monthly]: 'pro',
  [PRICE_IDS.pro.annual]: 'pro',
  [PRICE_IDS.premium.monthly]: 'premium',
  [PRICE_IDS.premium.annual]: 'premium',
};

/**
 * Create a Stripe Checkout session for subscription upgrade
 */
export async function createCheckoutSession({
  customerId,
  priceId,
  operatorId,
  successUrl,
  cancelUrl,
}: {
  customerId?: string;
  priceId: string;
  operatorId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      operator_id: operatorId,
    },
    subscription_data: {
      metadata: {
        operator_id: operatorId,
      },
    },
    allow_promotion_codes: true,
  });

  return session;
}

/**
 * Create a Stripe Customer Portal session for billing management
 */
export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

/**
 * Get or create a Stripe customer for an operator
 */
export async function getOrCreateCustomer({
  operatorId,
  email,
  name,
}: {
  operatorId: string;
  email: string;
  name?: string;
}) {
  // Search for existing customer by metadata
  const existingCustomers = await getStripe().customers.search({
    query: `metadata['operator_id']:'${operatorId}'`,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  // Create new customer
  const customer = await getStripe().customers.create({
    email,
    name,
    metadata: {
      operator_id: operatorId,
    },
  });

  return customer;
}

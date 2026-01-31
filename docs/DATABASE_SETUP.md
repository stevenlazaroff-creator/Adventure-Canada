# Supabase Setup Guide for Adventure Canada

Follow these steps to deploy your Supabase backend. Everything can be done through the Supabase Dashboard in your browser.

---

## Step 1: Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in:
   - **Name:** `adventure-canada`
   - **Database Password:** (save this somewhere safe!)
   - **Region:** Choose closest to your users
4. Click **"Create new project"**
5. Wait ~2 minutes for provisioning

---

## Step 2: Run Database Migrations

Go to **SQL Editor** in the left sidebar, then run each migration file in order.

### Migration Order:

| Order | File | Description |
|-------|------|-------------|
| 1 | `001_extensions_and_enums.sql` | Enable extensions, create enum types |
| 2 | `002_core_tables.sql` | Create all database tables |
| 3 | `003_indexes.sql` | Add performance indexes |
| 4 | `004_functions_and_triggers.sql` | Add helper functions and auto-update triggers |
| 5 | `005_rls_policies.sql` | Enable Row Level Security policies |
| 6 | `006_seed_data.sql` | Insert regions and activities data |
| 7 | `007_storage_policies.sql` | Storage bucket policies (run AFTER creating bucket) |

### How to run:
1. Click **"+ New query"**
2. Copy the entire contents of each `.sql` file
3. Paste into the editor
4. Click **"Run"** (or press Cmd/Ctrl + Enter)
5. Verify it says "Success" before moving to the next file

---

## Step 3: Create Storage Bucket

1. Go to **Storage** in the left sidebar
2. Click **"New bucket"**
3. Configure:
   - **Name:** `listing-images`
   - **Public bucket:** Toggle **ON**
4. Click **"Create bucket"**
5. NOW run `007_storage_policies.sql` in the SQL Editor

---

## Step 4: Deploy Edge Functions

Go to **Edge Functions** in the left sidebar.

### Function 1: stripe-webhook

1. Click **"New Function"**
2. Name: `stripe-webhook`
3. Copy the code from `functions/stripe-webhook/index.ts`
4. Click **"Deploy"**

### Function 2: track-analytics

1. Click **"New Function"**
2. Name: `track-analytics`
3. Copy the code from `functions/track-analytics/index.ts`
4. Click **"Deploy"**

### Function 3: create-operator

1. Click **"New Function"**
2. Name: `create-operator`
3. Copy the code from `functions/create-operator/index.ts`
4. Click **"Deploy"**

---

## Step 5: Add Edge Function Secrets

Go to **Edge Functions** → **Manage Secrets**

Add these secrets (get values from Stripe Dashboard):

| Secret Name | Value |
|-------------|-------|
| `STRIPE_SECRET_KEY` | `sk_live_xxx` or `sk_test_xxx` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_xxx` (from Step 6) |
| `STRIPE_PRICE_BASIC_MONTHLY` | `price_xxx` |
| `STRIPE_PRICE_BASIC_ANNUAL` | `price_xxx` |
| `STRIPE_PRICE_PRO_MONTHLY` | `price_xxx` |
| `STRIPE_PRICE_PRO_ANNUAL` | `price_xxx` |
| `STRIPE_PRICE_PREMIUM_MONTHLY` | `price_xxx` |
| `STRIPE_PRICE_PREMIUM_ANNUAL` | `price_xxx` |

---

## Step 6: Configure Stripe Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Enter URL: `https://YOUR-PROJECT.supabase.co/functions/v1/stripe-webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (`whsec_xxx`)
7. Add it to Supabase Edge Function secrets as `STRIPE_WEBHOOK_SECRET`

---

## Step 7: Get Your API Keys

Go to **Settings** → **API** in Supabase Dashboard.

Copy these values to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 8: Create Stripe Products

In Stripe Dashboard → **Products**:

### Product 1: Basic Plan
- Name: `Adventure Canada Basic`
- Prices:
  - $29/month (recurring, monthly)
  - $290/year (recurring, yearly)

### Product 2: Pro Plan
- Name: `Adventure Canada Pro`
- Prices:
  - $79/month (recurring, monthly)
  - $790/year (recurring, yearly)

### Product 3: Premium Plan
- Name: `Adventure Canada Premium`
- Prices:
  - $149/month (recurring, monthly)
  - $1490/year (recurring, yearly)

Copy each price ID (`price_xxx`) to your environment variables.

---

## Step 9: Set Up Auth (Optional)

In Supabase Dashboard → **Authentication** → **Providers**:

1. **Email** is enabled by default
2. Configure email templates in **Email Templates**
3. Set your site URL in **URL Configuration**

---

## Verification Checklist

- [ ] All 7 SQL migrations ran successfully
- [ ] `listing-images` storage bucket created
- [ ] Storage policies applied
- [ ] 3 Edge Functions deployed
- [ ] Edge Function secrets configured
- [ ] Stripe webhook endpoint created
- [ ] Stripe products and prices created
- [ ] API keys copied to `.env.local`

---

## Database Schema Overview

```
┌─────────────┐     ┌───────────────┐     ┌──────────────┐
│  operators  │────▶│ subscriptions │     │   regions    │
└─────────────┘     └───────────────┘     └──────────────┘
       │                                         │
       ▼                                         │
┌─────────────┐     ┌───────────────┐            │
│  listings   │◀────│listing_images │            │
└─────────────┘     └───────────────┘            │
       │                                         │
       │            ┌───────────────┐            │
       ├───────────▶│  inquiries    │            │
       │            └───────────────┘            │
       │                                         │
       │            ┌───────────────────┐        │
       ├───────────▶│ analytics_events  │        │
       │            └───────────────────┘        │
       │                                         │
       │            ┌───────────────────┐   ┌────────────┐
       └───────────▶│listing_activities │◀──│ activities │
                    └───────────────────┘   └────────────┘
```

---

## Troubleshooting

### "permission denied" errors
- Make sure RLS policies (migration 005) were applied
- Check that the user is authenticated

### "relation does not exist" errors
- Run migrations in order (001 through 007)
- Make sure previous migration succeeded before running next

### Stripe webhook not working
- Verify the webhook URL matches your Edge Function URL exactly
- Check that `STRIPE_WEBHOOK_SECRET` is set correctly
- Look at Edge Function logs in Supabase Dashboard

### Images not uploading
- Verify the `listing-images` bucket exists
- Make sure it's set to Public
- Check that storage policies (migration 007) were applied

---

## Support

If you encounter issues:
1. Check Supabase Dashboard → **Logs** for errors
2. Check Edge Function logs for webhook issues
3. Verify all environment variables are set correctly

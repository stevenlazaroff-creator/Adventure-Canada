# Claude Code Instructions: adventure-canada.com

## Project Summary

Build a directory website for Canadian adventure tour operators with tiered SaaS subscriptions.

**Domain:** adventure-canada.com  
**Stack:** Next.js 14 (App Router) + Supabase + Stripe + Tailwind CSS  
**Hosting:** Netlify  
**Repo:** GitHub  

---

## Business Model

A searchable directory where visitors find adventure operators, and operators pay for visibility.

### Pricing Tiers

| Tier | Monthly | Annual | Key Features |
|------|---------|--------|--------------|
| Free | $0 | $0 | Name, location, category, email only |
| Basic | $29 | $290 | + Phone, website link (dofollow SEO backlink), 500-char description, 1 image |
| Pro | $79 | $790 | + 2000-char description, 5 images, logo, social links, analytics dashboard, inquiry form |
| Premium | $149 | $1,490 | + 15 images, featured placement, homepage rotation, verified badge, priority in search |

---

## Technical Requirements

### Stack Details

```
Frontend:       Next.js 14 with App Router
Styling:        Tailwind CSS
Database:       Supabase (PostgreSQL)
Auth:           Supabase Auth
File Storage:   Supabase Storage
Payments:       Stripe (subscriptions)
Hosting:        Netlify
Version Control: GitHub
```

### Project Structure

```
adventure-canada/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Home
│   ├── browse/
│   │   ├── activities/
│   │   │   └── [slug]/page.tsx
│   │   └── regions/
│   │       └── [slug]/page.tsx
│   ├── listing/
│   │   └── [slug]/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx              # Auth wrapper
│   │   ├── page.tsx                # Overview
│   │   ├── edit/page.tsx
│   │   ├── analytics/page.tsx
│   │   └── billing/page.tsx
│   ├── pricing/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── api/
│       ├── webhooks/stripe/route.ts
│       └── analytics/track/route.ts
├── components/
│   ├── ui/
│   ├── listings/
│   ├── search/
│   ├── dashboard/
│   ├── layout/
│   └── marketing/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── admin.ts
│   ├── stripe.ts
│   └── utils.ts
├── hooks/
├── types/
├── supabase/
│   └── migrations/
├── public/
├── netlify.toml
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## Database Schema (Supabase)

Create these tables with Row Level Security enabled:

### Core Tables

**operators** - Extends Supabase auth.users
- id (UUID, PK, references auth.users)
- email (TEXT)
- business_name (TEXT)
- phone (TEXT)
- created_at, updated_at (TIMESTAMPTZ)

**subscriptions** - Stripe subscription sync
- id (UUID, PK)
- operator_id (UUID, FK to operators, UNIQUE)
- tier (ENUM: free, basic, pro, premium)
- stripe_customer_id (TEXT)
- stripe_subscription_id (TEXT)
- current_period_start, current_period_end (TIMESTAMPTZ)
- cancel_at_period_end (BOOLEAN)

**activities** - Lookup table
- id (SERIAL, PK)
- name, slug (TEXT, UNIQUE)
- icon (TEXT)
- display_order (INT)

**regions** - Lookup table
- id (SERIAL, PK)
- name, slug (TEXT, UNIQUE)
- province_code (CHAR 2)
- display_order (INT)

**listings** - Main content
- id (UUID, PK)
- operator_id (UUID, FK)
- name, slug (TEXT)
- status (ENUM: draft, pending, active, suspended)
- contact_email (TEXT)
- address, city, postal_code (TEXT)
- region_id (INT, FK)
- latitude, longitude (DECIMAL)
- phone, website_url (TEXT) — Basic+ only
- description_short (TEXT, 500 chars) — Basic+
- description_long (TEXT, 2000 chars) — Pro+
- logo_url (TEXT) — Pro+
- instagram_url, facebook_url, youtube_url (TEXT) — Pro+
- is_featured, is_verified (BOOLEAN) — Premium
- price_range (TEXT)
- seasons (TEXT[])
- fts (TSVECTOR, generated) — Full-text search

**listing_activities** - Many-to-many
- listing_id (UUID, FK)
- activity_id (INT, FK)
- PRIMARY KEY (listing_id, activity_id)

**listing_images**
- id (UUID, PK)
- listing_id (UUID, FK)
- url (TEXT)
- alt_text (TEXT)
- display_order (INT)
- is_primary (BOOLEAN)

**analytics_events** - Page view tracking
- id (UUID, PK)
- listing_id (UUID, FK)
- event_type (TEXT: view, website_click, phone_click, inquiry)
- visitor_id (TEXT)
- referrer, user_agent, ip_country (TEXT)
- created_at (TIMESTAMPTZ)

**inquiries** - Contact form submissions
- id (UUID, PK)
- listing_id (UUID, FK)
- name, email, phone, message (TEXT)
- status (ENUM: new, read, replied, archived)
- created_at (TIMESTAMPTZ)

### Row Level Security Policies

- Operators can only read/write their own profile and subscription
- Anyone can read active listings
- Operators can only manage their own listings and images
- Analytics: operators can read their own; writes via service role only
- Inquiries: anyone can insert; operators can read their own

### Database Functions

- `get_image_limit(tier)` — Returns max images allowed per tier
- `get_listing_analytics(listing_id, start_date, end_date)` — Aggregates views, clicks, inquiries with daily breakdown
- `update_updated_at()` — Trigger to auto-update timestamps

---

## Key Features to Implement

### 1. Public Pages
- Home with hero, search, featured listings, category grid
- Browse by activity (/browse/activities/[slug])
- Browse by region (/browse/regions/[slug])
- Listing detail page with tier-appropriate fields
- Pricing page with comparison table
- Static pages (about, contact)

### 2. Authentication
- Email/password registration and login via Supabase Auth
- Protected dashboard routes
- Operator registration creates operator + free subscription records

### 3. Operator Dashboard
- Overview with profile completeness and current plan
- Edit listing form (fields gated by tier)
- Image upload to Supabase Storage (count gated by tier)
- Analytics dashboard (Pro+ only) with charts
- Billing page with Stripe Customer Portal link

### 4. Payments (Stripe)
- Checkout session creation for upgrades
- Webhook handler for subscription lifecycle events
- Tier sync from Stripe to Supabase subscriptions table
- Customer portal for self-service billing management

### 5. Analytics Tracking
- Track page views, website clicks, phone clicks on listings
- Anonymous visitor ID via cookie
- Aggregate function for dashboard display

### 6. Search & Filtering
- Full-text search on listing name and descriptions
- Filter by activity, region, price range
- Sort by relevance (featured first), rating, name

---

## Netlify Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=https://adventure-canada.com
```

---

## Design Requirements

- Mobile-first responsive design
- Clean, modern aesthetic (not generic template look)
- Minimal use of stock photography
- Color palette: blues and greens (adventure/nature theme)
- Typography: Clean sans-serif (Inter or similar)
- Cards with subtle shadows and hover states
- Prominent CTAs for operators to upgrade

---

## Implementation Order

### Phase 1: Foundation
1. Initialize Next.js project with Tailwind
2. Set up Supabase project and run migrations
3. Configure Supabase client (browser + server)
4. Implement auth (login, register, logout)
5. Create basic layout (header, footer, mobile nav)

### Phase 2: Public Site
6. Build home page with hero and category grid
7. Create listing card component
8. Build browse pages with filtering
9. Build listing detail page
10. Create pricing page

### Phase 3: Operator Dashboard
11. Create protected dashboard layout
12. Build listing edit form
13. Implement image upload to Supabase Storage
14. Build analytics tracking endpoint
15. Build analytics dashboard (Pro+ gated)

### Phase 4: Payments
16. Set up Stripe products and prices
17. Implement checkout session creation
18. Build webhook handler
19. Implement tier-based feature gating
20. Add Stripe Customer Portal link

### Phase 5: Polish & Launch
21. Add SEO metadata and sitemap
22. Seed 50+ sample listings
23. Write cornerstone content pages
24. Test mobile responsiveness
25. Deploy to Netlify

---

## Commands to Start

```bash
# Create Next.js project
npx create-next-app@latest adventure-canada --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

cd adventure-canada

# Install dependencies
npm install @supabase/supabase-js @supabase/ssr stripe @netlify/plugin-nextjs
npm install lucide-react recharts
npm install -D supabase

# Initialize Supabase
npx supabase init

# Initialize git and push to GitHub
git init
git add .
git commit -m "Initial Next.js setup"
git branch -M main
git remote add origin git@github.com:USERNAME/adventure-canada.git
git push -u origin main
```

---

## Reference

The full MVP specification with complete database schema SQL, component code examples, and detailed feature breakdowns is in the accompanying file: `adventure-canada-mvp.md`

---

## First Task for Claude Code

Start by:
1. Creating the Next.js project with the command above
2. Setting up the Supabase migrations with the full schema
3. Creating the Supabase client utilities (lib/supabase/client.ts, server.ts, admin.ts)
4. Building the basic layout components (Header, Footer, MobileNav)

Then proceed through the implementation phases in order.

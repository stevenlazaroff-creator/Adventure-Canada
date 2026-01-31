# adventure-canada.com MVP Specification

## Overview

A searchable directory of Canadian adventure tour operators with tiered subscription monetization. This document covers two implementation paths: WordPress (fastest to launch) and React + Supabase (custom, scalable).

---

# Part 1: Site Structure (Both Platforms)

## Information Architecture

```
adventure-canada.com/
├── Home
│   ├── Hero with search bar
│   ├── Featured listings (Pro tier)
│   ├── Popular categories
│   └── Recent blog posts
│
├── Browse/
│   ├── /browse/activities/
│   │   ├── /rafting
│   │   ├── /hiking
│   │   ├── /skiing
│   │   ├── /kayaking
│   │   ├── /wildlife-tours
│   │   ├── /dog-sledding
│   │   ├── /fishing
│   │   ├── /climbing
│   │   ├── /camping
│   │   └── /multi-sport
│   │
│   └── /browse/regions/
│       ├── /british-columbia
│       ├── /alberta
│       ├── /ontario
│       ├── /quebec
│       ├── /maritimes
│       ├── /yukon
│       ├── /northwest-territories
│       ├── /nunavut
│       ├── /manitoba
│       └── /saskatchewan
│
├── Listing Detail
│   └── /listing/[slug]
│
├── Operator Portal/
│   ├── /dashboard (requires login)
│   ├── /dashboard/edit-listing
│   ├── /dashboard/analytics (Pro+ tiers)
│   ├── /dashboard/billing
│   └── /dashboard/upgrade
│
├── Static Pages/
│   ├── /about
│   ├── /pricing
│   ├── /contact
│   ├── /list-your-business
│   └── /blog
│
└── Auth/
    ├── /login
    ├── /register
    └── /forgot-password
```

## Page Specifications

### Home Page
- **Hero**: Full-width image, tagline "Discover Canada's Greatest Adventures", prominent search bar
- **Search**: Activity type dropdown + Region dropdown + "Search" button
- **Featured Section**: 3-6 Pro tier listings with images (rotating)
- **Category Grid**: Visual cards for top 8 activity types
- **Region Map**: Interactive or static map linking to regional pages
- **Social Proof**: "500+ adventure operators listed" counter
- **CTA**: "List Your Business" button

### Category/Region Pages
- **Header**: Category/region name, hero image, brief description (SEO content)
- **Filters Sidebar**: Activity type, region, price range, rating
- **Listings Grid**: Cards showing image, name, location, rating, tier badge
- **Sorting**: Relevance (default = Pro first), Rating, Name A-Z
- **Pagination**: 20 listings per page

### Listing Detail Page
- **Gallery**: Main image + thumbnails (based on tier)
- **Header**: Business name, verified badge (if Pro), rating
- **Contact Box**: Phone (Basic+), website link (Basic+), inquiry form (Pro+)
- **Description**: Short (Basic) or extended (Pro+)
- **Details**: Location, activities offered, price range, seasons
- **Social Links**: (Pro+)
- **Map**: Embedded Google Map
- **Related Listings**: 4 similar operators

### Operator Dashboard
- **Overview**: Profile completeness, current plan, quick stats
- **Edit Listing**: Form to update all listing fields
- **Analytics** (Pro+): 
  - Page views (daily/weekly/monthly)
  - Website click-throughs
  - Inquiry form submissions
  - Comparison to category average
- **Billing**: Current plan, payment history, upgrade options

---

# Part 2: WordPress MVP

## Recommended Stack

| Component | Recommendation | Cost |
|-----------|---------------|------|
| Hosting | Cloudways (DigitalOcean $14/mo) | $14/mo |
| Theme | flavor flavor flavor flavor flavor Flavor Flavor

Apologies, let me fix this:

| Component | Recommendation | Cost |
|-----------|---------------|------|
| Hosting | Cloudways (DigitalOcean) | $14/mo |
| Theme | flavor flavor

I'm having the same issue. Let me use a different approach:

| Component | Recommendation | Cost |
|-----------|---------------|------|
| Hosting | Cloudways (DigitalOcean) | $14/mo |
| Theme | flavor GeoDirectory starter or flavor flavor flavor ListingPro | $60-200 |
| Directory Plugin | GeoDirectory + Pricing Manager | $0-199 |
| Payments | Stripe via plugin | 2.9% + $0.30 |
| Forms | WPForms or Gravity Forms | $0-50/yr |
| SEO | Yoast SEO (free) | $0 |
| Analytics | MonsterInsights (free) | $0 |

## Plugin Configuration

### GeoDirectory Setup
1. Install GeoDirectory (free core)
2. Add Pricing Manager addon ($99/yr) for subscription tiers
3. Configure custom fields:
   - `activities` (multi-select)
   - `regions` (taxonomy)
   - `price_range` (select)
   - `seasons` (multi-select)
   - `website_url` (URL, Basic+ only)
   - `phone` (text, Basic+ only)

### Pricing Tiers in WordPress

Create 4 membership levels via Pricing Manager:

**Free Tier**
- Package price: $0
- Expire after: Never
- Allowed: 1 listing
- Fields visible: name, location, category, contact email

**Basic Tier ($29/mo)**
- Package price: $29/month or $290/year
- Fields visible: + phone, website URL, 500-char description, 1 image

**Pro Tier ($79/mo)**
- Package price: $79/month or $790/year
- Fields visible: + 2000-char description, 15 images, logo, social links
- Analytics: Enable via GeoDirectory Analytics addon
- Featured placement: Enable "featured" flag
- Priority in search results

## WordPress File Structure

```
wp-content/themes/adventure-canada/
├── style.css
├── functions.php
├── header.php
├── footer.php
├── front-page.php
├── page-pricing.php
├── archive-gd_place.php (listings archive)
├── single-gd_place.php (listing detail)
└── geodirectory/
    └── (template overrides)
```

## Launch Checklist (WordPress)

- [ ] Purchase hosting, install WordPress
- [ ] Install and configure theme
- [ ] Install GeoDirectory + addons
- [ ] Configure custom fields and categories
- [ ] Set up Stripe payments
- [ ] Create pricing page with tier comparison
- [ ] Add 50-100 seed listings manually
- [ ] Write 5 SEO cornerstone articles
- [ ] Set up Google Analytics
- [ ] Configure Yoast SEO
- [ ] Test mobile responsiveness
- [ ] Create operator outreach email template

---

# Part 3: React + Supabase MVP

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage (images) |
| Payments | Stripe |
| Hosting | Vercel |
| Analytics | Plausible or PostHog |

## Project Structure

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
│       └── listings/route.ts
├── components/
│   ├── ui/                         # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── Modal.tsx
│   ├── listings/
│   │   ├── ListingCard.tsx
│   │   ├── ListingGrid.tsx
│   │   ├── ListingDetail.tsx
│   │   └── ListingForm.tsx
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   └── FilterSidebar.tsx
│   ├── dashboard/
│   │   ├── AnalyticsChart.tsx
│   │   ├── StatsCard.tsx
│   │   └── BillingInfo.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx
│   └── marketing/
│       ├── Hero.tsx
│       ├── PricingTable.tsx
│       └── CategoryGrid.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   ├── server.ts               # Server client
│   │   └── admin.ts                # Service role client
│   ├── stripe.ts
│   └── utils.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useListings.ts
│   └── useAnalytics.ts
├── types/
│   └── index.ts
└── supabase/
    ├── migrations/
    │   └── 001_initial_schema.sql
    └── seed.sql
```

---

## Supabase Database Schema

### Complete Schema SQL

```sql
-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'pro');
CREATE TYPE listing_status AS ENUM ('draft', 'pending', 'active', 'suspended');
CREATE TYPE inquiry_status AS ENUM ('new', 'read', 'replied', 'archived');

-- =============================================
-- TABLES
-- =============================================

-- Operators (extends Supabase auth.users)
CREATE TABLE operators (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    business_name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
    tier subscription_tier NOT NULL DEFAULT 'free',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(operator_id)
);

-- Activities (lookup table)
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    description TEXT,
    display_order INT DEFAULT 0
);

-- Regions (lookup table)
CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    province_code CHAR(2),
    description TEXT,
    display_order INT DEFAULT 0
);

-- Listings
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
    
    -- Basic info (all tiers)
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    status listing_status DEFAULT 'draft',
    contact_email TEXT NOT NULL,
    
    -- Location
    address TEXT,
    city TEXT,
    region_id INT REFERENCES regions(id),
    postal_code TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Basic+ fields
    phone TEXT,
    website_url TEXT,
    description_short TEXT,              -- 500 chars, Basic+
    
    -- Pro+ fields
    description_long TEXT,               -- 2000 chars, Pro+
    logo_url TEXT,
    instagram_url TEXT,
    facebook_url TEXT,
    youtube_url TEXT,

    -- Pro fields
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    price_range TEXT,                    -- '$', '$$', '$$$', '$$$$'
    seasons TEXT[],                      -- ['spring', 'summer', 'fall', 'winter']
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- Listing Activities (many-to-many)
CREATE TABLE listing_activities (
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    activity_id INT REFERENCES activities(id) ON DELETE CASCADE,
    PRIMARY KEY (listing_id, activity_id)
);

-- Listing Images
CREATE TABLE listing_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Events
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,            -- 'view', 'website_click', 'phone_click', 'inquiry'
    visitor_id TEXT,                     -- Anonymous visitor ID
    referrer TEXT,
    user_agent TEXT,
    ip_country TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inquiries
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status inquiry_status DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_listings_operator ON listings(operator_id);
CREATE INDEX idx_listings_region ON listings(region_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_featured ON listings(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_listing_activities_listing ON listing_activities(listing_id);
CREATE INDEX idx_listing_activities_activity ON listing_activities(activity_id);
CREATE INDEX idx_analytics_listing ON analytics_events(listing_id);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);
CREATE INDEX idx_analytics_type_date ON analytics_events(listing_id, event_type, created_at);

-- Full-text search
ALTER TABLE listings ADD COLUMN fts tsvector 
    GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(description_short, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(description_long, '')), 'C')
    ) STORED;
CREATE INDEX idx_listings_fts ON listings USING GIN(fts);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Operators: users can only see/edit their own
CREATE POLICY "Operators can view own profile" ON operators
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Operators can update own profile" ON operators
    FOR UPDATE USING (auth.uid() = id);

-- Subscriptions: users can only see their own
CREATE POLICY "Users can view own subscription" ON subscriptions
    FOR SELECT USING (auth.uid() = operator_id);

-- Listings: public read, owner write
CREATE POLICY "Anyone can view active listings" ON listings
    FOR SELECT USING (status = 'active');
CREATE POLICY "Operators can manage own listings" ON listings
    FOR ALL USING (auth.uid() = operator_id);

-- Images: public read for active listings, owner write
CREATE POLICY "Anyone can view images of active listings" ON listing_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = listing_images.listing_id 
            AND listings.status = 'active'
        )
    );
CREATE POLICY "Operators can manage own listing images" ON listing_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = listing_images.listing_id 
            AND listings.operator_id = auth.uid()
        )
    );

-- Analytics: owner read only (via service role for writes)
CREATE POLICY "Operators can view own analytics" ON analytics_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = analytics_events.listing_id 
            AND listings.operator_id = auth.uid()
        )
    );

-- Inquiries: owner read, public insert
CREATE POLICY "Operators can view own inquiries" ON inquiries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = inquiries.listing_id 
            AND listings.operator_id = auth.uid()
        )
    );
CREATE POLICY "Anyone can submit inquiries" ON inquiries
    FOR INSERT WITH CHECK (TRUE);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Get listing image limit by tier
CREATE OR REPLACE FUNCTION get_image_limit(tier subscription_tier)
RETURNS INT AS $$
BEGIN
    RETURN CASE tier
        WHEN 'free' THEN 0
        WHEN 'basic' THEN 1
        WHEN 'pro' THEN 15
        ELSE 0
    END;
END;
$$ LANGUAGE plpgsql;

-- Aggregate analytics for dashboard
CREATE OR REPLACE FUNCTION get_listing_analytics(
    p_listing_id UUID,
    p_start_date TIMESTAMPTZ,
    p_end_date TIMESTAMPTZ
)
RETURNS TABLE (
    total_views BIGINT,
    website_clicks BIGINT,
    phone_clicks BIGINT,
    inquiries BIGINT,
    views_by_day JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) FILTER (WHERE event_type = 'view') AS total_views,
        COUNT(*) FILTER (WHERE event_type = 'website_click') AS website_clicks,
        COUNT(*) FILTER (WHERE event_type = 'phone_click') AS phone_clicks,
        COUNT(*) FILTER (WHERE event_type = 'inquiry') AS inquiries,
        (
            SELECT jsonb_agg(
                jsonb_build_object('date', date, 'views', views)
                ORDER BY date
            )
            FROM (
                SELECT 
                    DATE(created_at) AS date,
                    COUNT(*) AS views
                FROM analytics_events
                WHERE listing_id = p_listing_id
                AND event_type = 'view'
                AND created_at BETWEEN p_start_date AND p_end_date
                GROUP BY DATE(created_at)
            ) daily
        ) AS views_by_day
    FROM analytics_events
    WHERE listing_id = p_listing_id
    AND created_at BETWEEN p_start_date AND p_end_date;
END;
$$ LANGUAGE plpgsql;

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listings_updated_at
    BEFORE UPDATE ON listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER operators_updated_at
    BEFORE UPDATE ON operators
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- SEED DATA
-- =============================================

-- Activities
INSERT INTO activities (name, slug, icon, display_order) VALUES
('Rafting', 'rafting', 'waves', 1),
('Hiking', 'hiking', 'mountain', 2),
('Skiing', 'skiing', 'snowflake', 3),
('Kayaking', 'kayaking', 'anchor', 4),
('Wildlife Tours', 'wildlife-tours', 'binoculars', 5),
('Dog Sledding', 'dog-sledding', 'paw-print', 6),
('Fishing', 'fishing', 'fish', 7),
('Climbing', 'climbing', 'mountain-snow', 8),
('Camping', 'camping', 'tent', 9),
('Multi-Sport', 'multi-sport', 'activity', 10);

-- Regions
INSERT INTO regions (name, slug, province_code, display_order) VALUES
('British Columbia', 'british-columbia', 'BC', 1),
('Alberta', 'alberta', 'AB', 2),
('Ontario', 'ontario', 'ON', 3),
('Quebec', 'quebec', 'QC', 4),
('Nova Scotia', 'nova-scotia', 'NS', 5),
('New Brunswick', 'new-brunswick', 'NB', 6),
('Prince Edward Island', 'prince-edward-island', 'PE', 7),
('Newfoundland', 'newfoundland', 'NL', 8),
('Manitoba', 'manitoba', 'MB', 9),
('Saskatchewan', 'saskatchewan', 'SK', 10),
('Yukon', 'yukon', 'YT', 11),
('Northwest Territories', 'northwest-territories', 'NT', 12),
('Nunavut', 'nunavut', 'NU', 13);
```

---

## Key React Components

### ListingCard.tsx

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, CheckCircle } from 'lucide-react';

interface ListingCardProps {
  listing: {
    id: string;
    slug: string;
    name: string;
    city: string;
    region: { name: string };
    description_short: string | null;
    price_range: string | null;
    is_featured: boolean;
    is_verified: boolean;
    primary_image: string | null;
    activities: { name: string }[];
  };
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link href={`/listing/${listing.slug}`}>
      <div className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="aspect-[4/3] relative bg-gray-100">
          {listing.primary_image ? (
            <Image
              src={listing.primary_image}
              alt={listing.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
          {listing.is_featured && (
            <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {listing.name}
            </h3>
            {listing.is_verified && (
              <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>{listing.city}, {listing.region.name}</span>
          </div>

          {listing.description_short && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {listing.description_short}
            </p>
          )}

          {/* Activities */}
          <div className="mt-3 flex flex-wrap gap-1">
            {listing.activities.slice(0, 3).map((activity) => (
              <span
                key={activity.name}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {activity.name}
              </span>
            ))}
            {listing.activities.length > 3 && (
              <span className="text-xs text-gray-400">
                +{listing.activities.length - 3}
              </span>
            )}
          </div>

          {/* Price */}
          {listing.price_range && (
            <div className="mt-3 text-sm font-medium text-gray-700">
              {listing.price_range}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
```

### AnalyticsChart.tsx (Pro+ Dashboard)

```tsx
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AnalyticsChartProps {
  listingId: string;
}

export function AnalyticsChart({ listingId }: AnalyticsChartProps) {
  const [data, setData] = useState<any>(null);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchAnalytics() {
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase.rpc('get_listing_analytics', {
        p_listing_id: listingId,
        p_start_date: startDate.toISOString(),
        p_end_date: new Date().toISOString(),
      });

      if (!error && data) {
        setData(data[0]);
      }
    }

    fetchAnalytics();
  }, [listingId, period, supabase]);

  if (!data) {
    return <div className="animate-pulse h-64 bg-gray-100 rounded-lg" />;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Page Views</h3>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-sm rounded-md ${
                period === p
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {data.total_views.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Views</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {data.website_clicks.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Website Clicks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {data.phone_clicks.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Phone Clicks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {data.inquiries.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Inquiries</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.views_by_day || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString('en-CA', {
                  month: 'short',
                  day: 'numeric',
                })
              }
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              labelFormatter={(date) =>
                new Date(date).toLocaleDateString('en-CA', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })
              }
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

### PricingTable.tsx

```tsx
import { Check, X } from 'lucide-react';
import Link from 'next/link';

const tiers = [
  {
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    description: 'Get listed in our directory',
    features: {
      'Business name & location': true,
      'Category listing': true,
      'Contact email': true,
      'Phone number': false,
      'Website link (SEO backlink)': false,
      'Business description': false,
      'Image uploads': '0',
      'Logo display': false,
      'Social links': false,
      'Analytics dashboard': false,
      'Priority placement': false,
      'Featured on homepage': false,
      'Inquiry form': false,
      'Verified badge': false,
    },
    cta: 'Get Started',
    href: '/register',
    highlighted: false,
  },
  {
    name: 'Basic',
    price: { monthly: 29, annual: 290 },
    description: 'Essential visibility for your business',
    features: {
      'Business name & location': true,
      'Category listing': true,
      'Contact email': true,
      'Phone number': true,
      'Website link (SEO backlink)': true,
      'Business description': '500 chars',
      'Image uploads': '1',
      'Logo display': true,
      'Social links': true,
      'Analytics dashboard': false,
      'Priority placement': false,
      'Featured on homepage': false,
      'Inquiry form': false,
      'Verified badge': false,
    },
    cta: 'Start Basic',
    href: '/register?plan=basic',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: { monthly: 79, annual: 790 },
    description: 'Maximum visibility & leads',
    features: {
      'Business name & location': true,
      'Category listing': true,
      'Contact email': true,
      'Phone number': true,
      'Website link (SEO backlink)': true,
      'Business description': '2000 chars',
      'Image uploads': '15',
      'Logo display': true,
      'Social links': true,
      'Analytics dashboard': true,
      'Priority placement': true,
      'Featured on homepage': true,
      'Inquiry form': true,
      'Verified badge': true,
    },
    cta: 'Start Pro',
    href: '/register?plan=pro',
    highlighted: true,
  },
];

export function PricingTable() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={`rounded-xl border ${
            tier.highlighted
              ? 'border-blue-500 ring-2 ring-blue-500'
              : 'border-gray-200'
          } bg-white p-6 flex flex-col`}
        >
          {tier.highlighted && (
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
              Most Popular
            </span>
          )}
          <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{tier.description}</p>

          <div className="mt-4">
            <span className="text-4xl font-bold text-gray-900">
              ${tier.price.monthly}
            </span>
            <span className="text-gray-500">/month</span>
          </div>
          {tier.price.annual > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              or ${tier.price.annual}/year (2 months free)
            </p>
          )}

          <Link
            href={tier.href}
            className={`mt-6 block text-center py-2.5 px-4 rounded-lg font-medium transition-colors ${
              tier.highlighted
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            {tier.cta}
          </Link>

          <ul className="mt-6 space-y-3 flex-1">
            {Object.entries(tier.features).map(([feature, value]) => (
              <li key={feature} className="flex items-start gap-2">
                {value === true ? (
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : value === false ? (
                  <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                ) : (
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                )}
                <span
                  className={`text-sm ${
                    value ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {feature}
                  {typeof value === 'string' && (
                    <span className="text-gray-500"> ({value})</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

---

## Stripe Integration

### Stripe Products Setup

Create these products in Stripe Dashboard:

| Product | Price ID (example) | Monthly | Annual |
|---------|-------------------|---------|--------|
| Basic | price_basic_monthly | $29 | - |
| Basic Annual | price_basic_annual | - | $290 |
| Pro | price_pro_monthly | $79 | - |
| Pro Annual | price_pro_annual | - | $790 |

### Webhook Handler (app/api/webhooks/stripe/route.ts)

```typescript
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const tierMap: Record<string, 'basic' | 'pro'> = {
  price_basic_monthly: 'basic',
  price_basic_annual: 'basic',
  price_pro_monthly: 'pro',
  price_pro_annual: 'pro',
};

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const operatorId = session.metadata?.operator_id;
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const priceId = subscription.items.data[0].price.id;

      await supabase.from('subscriptions').upsert({
        operator_id: operatorId,
        tier: tierMap[priceId] || 'basic',
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: subscription.id,
        current_period_start: new Date(
          subscription.current_period_start * 1000
        ).toISOString(),
        current_period_end: new Date(
          subscription.current_period_end * 1000
        ).toISOString(),
      });
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0].price.id;

      await supabase
        .from('subscriptions')
        .update({
          tier: tierMap[priceId] || 'basic',
          current_period_start: new Date(
            subscription.current_period_start * 1000
          ).toISOString(),
          current_period_end: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
        })
        .eq('stripe_subscription_id', subscription.id);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;

      await supabase
        .from('subscriptions')
        .update({ tier: 'free' })
        .eq('stripe_subscription_id', subscription.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

---

## Environment Variables

```env
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# App
NEXT_PUBLIC_APP_URL=https://adventure-canada.com
```

---

## Deployment Checklist (React + Supabase)

### Week 1: Foundation
- [ ] Create Supabase project
- [ ] Run database migrations
- [ ] Set up Next.js project with Tailwind
- [ ] Implement Supabase auth (login/register)
- [ ] Create basic layout components

### Week 2: Core Features
- [ ] Build listing card and grid components
- [ ] Create category/region browse pages
- [ ] Build listing detail page
- [ ] Implement search and filtering
- [ ] Set up image uploads to Supabase Storage

### Week 3: Operator Dashboard
- [ ] Create operator registration flow
- [ ] Build listing edit form
- [ ] Implement analytics tracking
- [ ] Build analytics dashboard (Pro+ only)

### Week 4: Monetization
- [ ] Set up Stripe products and prices
- [ ] Implement checkout flow
- [ ] Build webhook handler
- [ ] Implement tier-based feature gating
- [ ] Test subscription lifecycle

### Week 5: Launch Prep
- [ ] Seed 50-100 listings
- [ ] Write SEO content pages
- [ ] Set up analytics (Plausible/PostHog)
- [ ] Configure Vercel deployment
- [ ] Test mobile responsiveness
- [ ] Operator outreach campaign

---

## Cost Comparison

| Item | WordPress | React + Supabase |
|------|-----------|------------------|
| Hosting | $14-50/mo (Cloudways) | $0-20/mo (Vercel) |
| Database | Included | $0-25/mo (Supabase) |
| Theme/Boilerplate | $100-300 one-time | $0 |
| Plugins/Addons | $100-400/yr | $0 |
| Development time | 1-2 weeks | 4-6 weeks |
| Stripe fees | 2.9% + $0.30 | 2.9% + $0.30 |
| **Year 1 Total** | ~$400-800 + time | ~$0-500 + more time |

---

## Recommendation

**Choose WordPress if:**
- You want revenue within 30 days
- You're not a developer or don't have one
- You want to validate the business model before investing in custom code

**Choose React + Supabase if:**
- You're a developer comfortable with the stack
- You want full control and clean architecture
- You're planning for scale and additional features
- You're willing to invest 4-6 weeks before launch

Both paths lead to the same destination. WordPress gets you there faster; React gives you more control over the vehicle.

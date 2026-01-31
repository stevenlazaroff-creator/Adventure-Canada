-- ============================================================
-- ADVENTURE CANADA - COMPLETE SUPABASE SETUP
-- ============================================================
-- Copy this ENTIRE file and paste into Supabase SQL Editor
-- Then click "Run" - it will set up your entire database!
-- ============================================================

-- ============================================================
-- PART 1: EXTENSIONS & ENUMS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

DO $$ BEGIN
  CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'pro', 'premium');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE listing_status AS ENUM ('draft', 'pending', 'active', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE analytics_event_type AS ENUM ('view', 'website_click', 'phone_click', 'inquiry');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE inquiry_status AS ENUM ('new', 'read', 'replied', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- PART 2: CORE TABLES
-- ============================================================

-- Operators table
CREATE TABLE IF NOT EXISTS operators (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  business_name TEXT NOT NULL,
  phone TEXT,
  province TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Regions table
CREATE TABLE IF NOT EXISTS regions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  status listing_status NOT NULL DEFAULT 'draft',
  contact_email TEXT NOT NULL,
  phone TEXT,
  website_url TEXT,
  address TEXT,
  city TEXT,
  region_id UUID REFERENCES regions(id) ON DELETE SET NULL,
  postal_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  description_short TEXT,
  description_long TEXT,
  logo_url TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  youtube_url TEXT,
  price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
  seasons TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  fts TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(city, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description_short, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(description_long, '')), 'D')
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listing activities junction table
CREATE TABLE IF NOT EXISTS listing_activities (
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  PRIMARY KEY (listing_id, activity_id)
);

-- Listing images table
CREATE TABLE IF NOT EXISTS listing_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  display_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  event_type analytics_event_type NOT NULL,
  visitor_id TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status inquiry_status DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PART 3: INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_listings_operator ON listings(operator_id);
CREATE INDEX IF NOT EXISTS idx_listings_region ON listings(region_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_featured ON listings(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_listings_fts ON listings USING GIN(fts);
CREATE INDEX IF NOT EXISTS idx_listing_activities_listing ON listing_activities(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_activities_activity ON listing_activities(activity_id);
CREATE INDEX IF NOT EXISTS idx_listing_images_listing ON listing_images(listing_id);
CREATE INDEX IF NOT EXISTS idx_analytics_listing ON analytics_events(listing_id);
CREATE INDEX IF NOT EXISTS idx_analytics_type_date ON analytics_events(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_listing_date ON analytics_events(listing_id, created_at);
CREATE INDEX IF NOT EXISTS idx_inquiries_listing ON inquiries(listing_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_operator ON subscriptions(operator_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);

-- ============================================================
-- PART 4: FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers (drop first if exists to avoid errors)
DROP TRIGGER IF EXISTS operators_updated_at ON operators;
CREATE TRIGGER operators_updated_at
  BEFORE UPDATE ON operators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS subscriptions_updated_at ON subscriptions;
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS listings_updated_at ON listings;
CREATE TRIGGER listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS inquiries_updated_at ON inquiries;
CREATE TRIGGER inquiries_updated_at
  BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Get image limit by subscription tier
CREATE OR REPLACE FUNCTION get_image_limit(tier subscription_tier)
RETURNS INT AS $$
BEGIN
  RETURN CASE tier
    WHEN 'free' THEN 0
    WHEN 'basic' THEN 1
    WHEN 'pro' THEN 5
    WHEN 'premium' THEN 15
    ELSE 0
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Get listing analytics
CREATE OR REPLACE FUNCTION get_listing_analytics(
  p_listing_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS TABLE (
  date DATE,
  views BIGINT,
  website_clicks BIGINT,
  phone_clicks BIGINT,
  inquiries BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    DATE(ae.created_at) as date,
    COUNT(*) FILTER (WHERE ae.event_type = 'view') as views,
    COUNT(*) FILTER (WHERE ae.event_type = 'website_click') as website_clicks,
    COUNT(*) FILTER (WHERE ae.event_type = 'phone_click') as phone_clicks,
    COUNT(*) FILTER (WHERE ae.event_type = 'inquiry') as inquiries
  FROM analytics_events ae
  WHERE ae.listing_id = p_listing_id
    AND ae.created_at >= p_start_date
    AND ae.created_at <= p_end_date
  GROUP BY DATE(ae.created_at)
  ORDER BY date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- PART 5: ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (to make script re-runnable)
DROP POLICY IF EXISTS "Operators can view own profile" ON operators;
DROP POLICY IF EXISTS "Operators can update own profile" ON operators;
DROP POLICY IF EXISTS "Allow insert on signup" ON operators;
DROP POLICY IF EXISTS "Operators can view own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Anyone can view regions" ON regions;
DROP POLICY IF EXISTS "Anyone can view activities" ON activities;
DROP POLICY IF EXISTS "Anyone can view active listings" ON listings;
DROP POLICY IF EXISTS "Operators can view own listings" ON listings;
DROP POLICY IF EXISTS "Operators can insert own listings" ON listings;
DROP POLICY IF EXISTS "Operators can update own listings" ON listings;
DROP POLICY IF EXISTS "Operators can delete own listings" ON listings;
DROP POLICY IF EXISTS "Anyone can view listing activities for active listings" ON listing_activities;
DROP POLICY IF EXISTS "Operators can manage own listing activities" ON listing_activities;
DROP POLICY IF EXISTS "Anyone can view images for active listings" ON listing_images;
DROP POLICY IF EXISTS "Operators can manage own listing images" ON listing_images;
DROP POLICY IF EXISTS "Service role can insert analytics" ON analytics_events;
DROP POLICY IF EXISTS "Operators can view own listing analytics" ON analytics_events;
DROP POLICY IF EXISTS "Anyone can submit inquiries" ON inquiries;
DROP POLICY IF EXISTS "Operators can view own listing inquiries" ON inquiries;
DROP POLICY IF EXISTS "Operators can update own listing inquiries" ON inquiries;

-- Operators policies
CREATE POLICY "Operators can view own profile"
  ON operators FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Operators can update own profile"
  ON operators FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow insert on signup"
  ON operators FOR INSERT WITH CHECK (auth.uid() = id);

-- Subscriptions policies
CREATE POLICY "Operators can view own subscription"
  ON subscriptions FOR SELECT USING (auth.uid() = operator_id);

CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions FOR ALL USING (auth.role() = 'service_role');

-- Regions policies
CREATE POLICY "Anyone can view regions"
  ON regions FOR SELECT USING (true);

-- Activities policies
CREATE POLICY "Anyone can view activities"
  ON activities FOR SELECT USING (true);

-- Listings policies
CREATE POLICY "Anyone can view active listings"
  ON listings FOR SELECT USING (status = 'active');

CREATE POLICY "Operators can view own listings"
  ON listings FOR SELECT USING (auth.uid() = operator_id);

CREATE POLICY "Operators can insert own listings"
  ON listings FOR INSERT WITH CHECK (auth.uid() = operator_id);

CREATE POLICY "Operators can update own listings"
  ON listings FOR UPDATE USING (auth.uid() = operator_id);

CREATE POLICY "Operators can delete own listings"
  ON listings FOR DELETE USING (auth.uid() = operator_id);

-- Listing activities policies
CREATE POLICY "Anyone can view listing activities for active listings"
  ON listing_activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_activities.listing_id
      AND (listings.status = 'active' OR listings.operator_id = auth.uid())
    )
  );

CREATE POLICY "Operators can manage own listing activities"
  ON listing_activities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_activities.listing_id
      AND listings.operator_id = auth.uid()
    )
  );

-- Listing images policies
CREATE POLICY "Anyone can view images for active listings"
  ON listing_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_images.listing_id
      AND (listings.status = 'active' OR listings.operator_id = auth.uid())
    )
  );

CREATE POLICY "Operators can manage own listing images"
  ON listing_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_images.listing_id
      AND listings.operator_id = auth.uid()
    )
  );

-- Analytics policies
CREATE POLICY "Service role can insert analytics"
  ON analytics_events FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Operators can view own listing analytics"
  ON analytics_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = analytics_events.listing_id
      AND listings.operator_id = auth.uid()
    )
  );

-- Inquiries policies
CREATE POLICY "Anyone can submit inquiries"
  ON inquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "Operators can view own listing inquiries"
  ON inquiries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = inquiries.listing_id
      AND listings.operator_id = auth.uid()
    )
  );

CREATE POLICY "Operators can update own listing inquiries"
  ON inquiries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = inquiries.listing_id
      AND listings.operator_id = auth.uid()
    )
  );

-- ============================================================
-- PART 6: SEED DATA
-- ============================================================

-- Insert regions (skip if already exists)
INSERT INTO regions (name, slug, description, display_order)
SELECT 'Western Canada', 'western-canada', 'British Columbia, Alberta, Saskatchewan, Manitoba', 1
WHERE NOT EXISTS (SELECT 1 FROM regions WHERE slug = 'western-canada');

INSERT INTO regions (name, slug, description, display_order)
SELECT 'Eastern Canada', 'eastern-canada', 'Ontario, Quebec', 2
WHERE NOT EXISTS (SELECT 1 FROM regions WHERE slug = 'eastern-canada');

INSERT INTO regions (name, slug, description, display_order)
SELECT 'Atlantic Canada', 'atlantic-canada', 'New Brunswick, Nova Scotia, Prince Edward Island, Newfoundland and Labrador', 3
WHERE NOT EXISTS (SELECT 1 FROM regions WHERE slug = 'atlantic-canada');

INSERT INTO regions (name, slug, description, display_order)
SELECT 'Northern Canada', 'northern-canada', 'Yukon, Northwest Territories, Nunavut', 4
WHERE NOT EXISTS (SELECT 1 FROM regions WHERE slug = 'northern-canada');

-- Insert activities (skip if already exists)
INSERT INTO activities (name, slug, icon, description, display_order)
SELECT 'Rafting', 'rafting', 'waves', 'White water rafting adventures', 1
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE slug = 'rafting');

INSERT INTO activities (name, slug, icon, description, display_order)
SELECT 'Hiking', 'hiking', 'mountain', 'Mountain and trail hiking tours', 2
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE slug = 'hiking');

INSERT INTO activities (name, slug, icon, description, display_order)
SELECT 'Skiing', 'skiing', 'snowflake', 'Downhill and cross-country skiing', 3
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE slug = 'skiing');

INSERT INTO activities (name, slug, icon, description, display_order)
SELECT 'Kayaking', 'kayaking', 'anchor', 'Sea and river kayaking expeditions', 4
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE slug = 'kayaking');

INSERT INTO activities (name, slug, icon, description, display_order)
SELECT 'Wildlife Tours', 'wildlife-tours', 'paw-print', 'Wildlife watching and photography', 5
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE slug = 'wildlife-tours');

INSERT INTO activities (name, slug, icon, description, display_order)
SELECT 'Dog Sledding', 'dog-sledding', 'wind', 'Traditional dog sled experiences', 6
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE slug = 'dog-sledding');

INSERT INTO activities (name, slug, icon, description, display_order)
SELECT 'Fishing', 'fishing', 'fish', 'Sport fishing and fly fishing', 7
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE slug = 'fishing');

INSERT INTO activities (name, slug, icon, description, display_order)
SELECT 'Climbing', 'climbing', 'mountain-snow', 'Rock climbing and mountaineering', 8
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE slug = 'climbing');

INSERT INTO activities (name, slug, icon, description, display_order)
SELECT 'Camping', 'camping', 'tent', 'Wilderness camping and glamping', 9
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE slug = 'camping');

INSERT INTO activities (name, slug, icon, description, display_order)
SELECT 'Multi-Sport', 'multi-sport', 'trophy', 'Combined adventure packages', 10
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE slug = 'multi-sport');

INSERT INTO activities (name, slug, icon, description, display_order)
SELECT 'Snowboarding', 'snowboarding', 'snowflake', 'Snowboarding adventures', 11
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE slug = 'snowboarding');

INSERT INTO activities (name, slug, icon, description, display_order)
SELECT 'Canoeing', 'canoeing', 'sailboat', 'Canoe trips and expeditions', 12
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE slug = 'canoeing');

INSERT INTO activities (name, slug, icon, description, display_order)
SELECT 'Mountain Biking', 'mountain-biking', 'bike', 'Off-road cycling adventures', 13
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE slug = 'mountain-biking');

INSERT INTO activities (name, slug, icon, description, display_order)
SELECT 'Zip Lining', 'zip-lining', 'zap', 'Aerial zip line experiences', 14
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE slug = 'zip-lining');

INSERT INTO activities (name, slug, icon, description, display_order)
SELECT 'Whale Watching', 'whale-watching', 'eye', 'Marine wildlife tours', 15
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE slug = 'whale-watching');

INSERT INTO activities (name, slug, icon, description, display_order)
SELECT 'Northern Lights', 'northern-lights', 'star', 'Aurora borealis viewing tours', 16
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE slug = 'northern-lights');

INSERT INTO activities (name, slug, icon, description, display_order)
SELECT 'Snowshoeing', 'snowshoeing', 'footprints', 'Winter snowshoe excursions', 17
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE slug = 'snowshoeing');

INSERT INTO activities (name, slug, icon, description, display_order)
SELECT 'Ice Climbing', 'ice-climbing', 'thermometer-snowflake', 'Frozen waterfall climbing', 18
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE slug = 'ice-climbing');

INSERT INTO activities (name, slug, icon, description, display_order)
SELECT 'Surfing', 'surfing', 'waves', 'Ocean surfing lessons and tours', 19
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE slug = 'surfing');

INSERT INTO activities (name, slug, icon, description, display_order)
SELECT 'Sailing', 'sailing', 'sailboat', 'Sailing trips and charters', 20
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE slug = 'sailing');

-- ============================================================
-- DONE! Your database is now set up.
-- ============================================================
--
-- NEXT STEPS:
-- 1. Go to Storage and create a bucket called "listing-images" (make it public)
-- 2. Run the STORAGE_POLICIES.sql file after creating the bucket
-- 3. Deploy Edge Functions (see supabase/functions folder)
-- 4. Set up Stripe webhook
-- ============================================================

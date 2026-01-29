-- =============================================
-- Adventure Canada Database Schema
-- =============================================

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'pro', 'premium');
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

-- Regions (4 grouped regions: Western, Eastern, Atlantic, Northern)
CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
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

    -- Premium fields
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
CREATE POLICY "Operators can insert own profile" ON operators
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Subscriptions: users can only see their own
CREATE POLICY "Users can view own subscription" ON subscriptions
    FOR SELECT USING (auth.uid() = operator_id);

-- Listings: public read, owner write
CREATE POLICY "Anyone can view active listings" ON listings
    FOR SELECT USING (status = 'active');
CREATE POLICY "Operators can view own listings" ON listings
    FOR SELECT USING (auth.uid() = operator_id);
CREATE POLICY "Operators can insert own listings" ON listings
    FOR INSERT WITH CHECK (auth.uid() = operator_id);
CREATE POLICY "Operators can update own listings" ON listings
    FOR UPDATE USING (auth.uid() = operator_id);
CREATE POLICY "Operators can delete own listings" ON listings
    FOR DELETE USING (auth.uid() = operator_id);

-- Images: public read for active listings, owner write
CREATE POLICY "Anyone can view images of active listings" ON listing_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM listings
            WHERE listings.id = listing_images.listing_id
            AND listings.status = 'active'
        )
    );
CREATE POLICY "Operators can view own listing images" ON listing_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM listings
            WHERE listings.id = listing_images.listing_id
            AND listings.operator_id = auth.uid()
        )
    );
CREATE POLICY "Operators can insert own listing images" ON listing_images
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM listings
            WHERE listings.id = listing_images.listing_id
            AND listings.operator_id = auth.uid()
        )
    );
CREATE POLICY "Operators can update own listing images" ON listing_images
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM listings
            WHERE listings.id = listing_images.listing_id
            AND listings.operator_id = auth.uid()
        )
    );
CREATE POLICY "Operators can delete own listing images" ON listing_images
    FOR DELETE USING (
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
        WHEN 'pro' THEN 5
        WHEN 'premium' THEN 15
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

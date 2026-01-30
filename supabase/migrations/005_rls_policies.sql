-- Migration 005: Row Level Security Policies
-- Run this FIFTH in Supabase SQL Editor

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

-- ============================================
-- OPERATORS POLICIES
-- ============================================
CREATE POLICY "Operators can view own profile"
  ON operators FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Operators can update own profile"
  ON operators FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Allow insert on signup"
  ON operators FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- SUBSCRIPTIONS POLICIES
-- ============================================
CREATE POLICY "Operators can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = operator_id);

CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- REGIONS POLICIES (public read)
-- ============================================
CREATE POLICY "Anyone can view regions"
  ON regions FOR SELECT
  USING (true);

-- ============================================
-- ACTIVITIES POLICIES (public read)
-- ============================================
CREATE POLICY "Anyone can view activities"
  ON activities FOR SELECT
  USING (true);

-- ============================================
-- LISTINGS POLICIES
-- ============================================
CREATE POLICY "Anyone can view active listings"
  ON listings FOR SELECT
  USING (status = 'active');

CREATE POLICY "Operators can view own listings"
  ON listings FOR SELECT
  USING (auth.uid() = operator_id);

CREATE POLICY "Operators can insert own listings"
  ON listings FOR INSERT
  WITH CHECK (auth.uid() = operator_id);

CREATE POLICY "Operators can update own listings"
  ON listings FOR UPDATE
  USING (auth.uid() = operator_id);

CREATE POLICY "Operators can delete own listings"
  ON listings FOR DELETE
  USING (auth.uid() = operator_id);

-- ============================================
-- LISTING ACTIVITIES POLICIES
-- ============================================
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

-- ============================================
-- LISTING IMAGES POLICIES
-- ============================================
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

-- ============================================
-- ANALYTICS POLICIES
-- ============================================
CREATE POLICY "Service role can insert analytics"
  ON analytics_events FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Operators can view own listing analytics"
  ON analytics_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = analytics_events.listing_id
      AND listings.operator_id = auth.uid()
    )
  );

-- ============================================
-- INQUIRIES POLICIES
-- ============================================
CREATE POLICY "Anyone can submit inquiries"
  ON inquiries FOR INSERT
  WITH CHECK (true);

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

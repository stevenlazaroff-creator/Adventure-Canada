-- Migration 003: Create Indexes
-- Run this THIRD in Supabase SQL Editor

-- Listings indexes
CREATE INDEX idx_listings_operator ON listings(operator_id);
CREATE INDEX idx_listings_region ON listings(region_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_featured ON listings(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_listings_fts ON listings USING GIN(fts);

-- Listing activities indexes
CREATE INDEX idx_listing_activities_listing ON listing_activities(listing_id);
CREATE INDEX idx_listing_activities_activity ON listing_activities(activity_id);

-- Listing images indexes
CREATE INDEX idx_listing_images_listing ON listing_images(listing_id);

-- Analytics indexes
CREATE INDEX idx_analytics_listing ON analytics_events(listing_id);
CREATE INDEX idx_analytics_type_date ON analytics_events(event_type, created_at);
CREATE INDEX idx_analytics_listing_date ON analytics_events(listing_id, created_at);

-- Inquiries indexes
CREATE INDEX idx_inquiries_listing ON inquiries(listing_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);

-- Subscriptions indexes
CREATE INDEX idx_subscriptions_operator ON subscriptions(operator_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);

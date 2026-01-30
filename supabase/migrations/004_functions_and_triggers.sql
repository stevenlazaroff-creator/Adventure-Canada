-- Migration 004: Create Functions & Triggers
-- Run this FOURTH in Supabase SQL Editor

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
CREATE TRIGGER operators_updated_at
  BEFORE UPDATE ON operators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

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

-- Get listing analytics (for operator dashboard)
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

-- =============================================
-- Add Province Column to Listings
-- =============================================

-- Add province column to store the user's selected province/territory
ALTER TABLE listings ADD COLUMN province TEXT;

-- Create index for province filtering
CREATE INDEX idx_listings_province ON listings(province);

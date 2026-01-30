-- Migration 006: Seed Initial Data
-- Run this SIXTH in Supabase SQL Editor

-- ============================================
-- INSERT REGIONS
-- ============================================
INSERT INTO regions (name, slug, description, display_order) VALUES
  ('Western Canada', 'western-canada', 'British Columbia, Alberta, Saskatchewan, Manitoba', 1),
  ('Eastern Canada', 'eastern-canada', 'Ontario, Quebec', 2),
  ('Atlantic Canada', 'atlantic-canada', 'New Brunswick, Nova Scotia, Prince Edward Island, Newfoundland and Labrador', 3),
  ('Northern Canada', 'northern-canada', 'Yukon, Northwest Territories, Nunavut', 4);

-- ============================================
-- INSERT ACTIVITIES
-- ============================================
INSERT INTO activities (name, slug, icon, description, display_order) VALUES
  ('Rafting', 'rafting', 'waves', 'White water rafting adventures', 1),
  ('Hiking', 'hiking', 'mountain', 'Mountain and trail hiking tours', 2),
  ('Skiing', 'skiing', 'snowflake', 'Downhill and cross-country skiing', 3),
  ('Kayaking', 'kayaking', 'anchor', 'Sea and river kayaking expeditions', 4),
  ('Wildlife Tours', 'wildlife-tours', 'paw-print', 'Wildlife watching and photography', 5),
  ('Dog Sledding', 'dog-sledding', 'wind', 'Traditional dog sled experiences', 6),
  ('Fishing', 'fishing', 'fish', 'Sport fishing and fly fishing', 7),
  ('Climbing', 'climbing', 'mountain-snow', 'Rock climbing and mountaineering', 8),
  ('Camping', 'camping', 'tent', 'Wilderness camping and glamping', 9),
  ('Multi-Sport', 'multi-sport', 'trophy', 'Combined adventure packages', 10),
  ('Snowboarding', 'snowboarding', 'snowflake', 'Snowboarding adventures', 11),
  ('Canoeing', 'canoeing', 'sailboat', 'Canoe trips and expeditions', 12),
  ('Mountain Biking', 'mountain-biking', 'bike', 'Off-road cycling adventures', 13),
  ('Zip Lining', 'zip-lining', 'zap', 'Aerial zip line experiences', 14),
  ('Whale Watching', 'whale-watching', 'eye', 'Marine wildlife tours', 15),
  ('Northern Lights', 'northern-lights', 'star', 'Aurora borealis viewing tours', 16),
  ('Snowshoeing', 'snowshoeing', 'footprints', 'Winter snowshoe excursions', 17),
  ('Ice Climbing', 'ice-climbing', 'thermometer-snowflake', 'Frozen waterfall climbing', 18),
  ('Surfing', 'surfing', 'waves', 'Ocean surfing lessons and tours', 19),
  ('Sailing', 'sailing', 'sailboat', 'Sailing trips and charters', 20);

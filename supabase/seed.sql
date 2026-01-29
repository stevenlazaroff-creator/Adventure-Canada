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

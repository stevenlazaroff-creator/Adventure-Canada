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

-- Regions (4 grouped regions)
INSERT INTO regions (name, slug, description, display_order) VALUES
('Western Canada', 'western-canada', 'British Columbia, Alberta, Saskatchewan & Manitoba', 1),
('Eastern Canada', 'eastern-canada', 'Ontario & Quebec', 2),
('Atlantic Canada', 'atlantic-canada', 'Nova Scotia, New Brunswick, Prince Edward Island, Newfoundland & Labrador', 3),
('Northern Canada', 'northern-canada', 'Yukon, Northwest Territories & Nunavut', 4);

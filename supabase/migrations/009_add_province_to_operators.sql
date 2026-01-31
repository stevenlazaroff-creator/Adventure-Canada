-- =============================================
-- Add Province Column to Operators
-- =============================================

-- Add province column to store the operator's province/territory
ALTER TABLE operators ADD COLUMN province TEXT;

-- Create index for province filtering
CREATE INDEX idx_operators_province ON operators(province);

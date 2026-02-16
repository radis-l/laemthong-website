-- Remove the icon column from categories table.
-- This field stored a Lucide icon name used as a visual placeholder for products without images.
-- A generic Package icon is now used by default in the PlaceholderImage component.
ALTER TABLE categories DROP COLUMN IF EXISTS icon;

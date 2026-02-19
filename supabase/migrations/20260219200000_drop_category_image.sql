-- Remove unused image column from categories table.
-- Category images were never displayed on the public site after
-- category detail pages were consolidated into /products?category=slug.
ALTER TABLE categories DROP COLUMN IF EXISTS image;

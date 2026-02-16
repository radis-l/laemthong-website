-- Add ON UPDATE CASCADE to product foreign keys
-- This ensures slug renames on categories/brands automatically propagate to products

ALTER TABLE products
  DROP CONSTRAINT products_category_slug_fkey,
  ADD CONSTRAINT products_category_slug_fkey
    FOREIGN KEY (category_slug) REFERENCES categories(slug) ON UPDATE CASCADE;

ALTER TABLE products
  DROP CONSTRAINT products_brand_slug_fkey,
  ADD CONSTRAINT products_brand_slug_fkey
    FOREIGN KEY (brand_slug) REFERENCES brands(slug) ON UPDATE CASCADE;

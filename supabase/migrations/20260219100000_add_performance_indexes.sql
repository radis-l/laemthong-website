-- Performance indexes for scaling to 5,000+ products

-- updated_at index for "newest" sort
CREATE INDEX IF NOT EXISTS idx_products_updated_at ON products(updated_at DESC);

-- Composite indexes for common filter+sort patterns
CREATE INDEX IF NOT EXISTS idx_products_category_sort ON products(category_slug, sort_order);
CREATE INDEX IF NOT EXISTS idx_products_brand_sort ON products(brand_slug, sort_order);

-- pg_trgm extension + trigram indexes for ILIKE search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_products_name_th_trgm ON products USING gin ((name->>'th') gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_name_en_trgm ON products USING gin ((name->>'en') gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_short_desc_th_trgm ON products USING gin ((short_description->>'th') gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_short_desc_en_trgm ON products USING gin ((short_description->>'en') gin_trgm_ops);

-- Functional indexes for name-based sorting
CREATE INDEX IF NOT EXISTS idx_products_name_th ON products ((name->>'th'));
CREATE INDEX IF NOT EXISTS idx_products_name_en ON products ((name->>'en'));

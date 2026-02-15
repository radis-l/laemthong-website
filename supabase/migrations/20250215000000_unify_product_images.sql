-- Unify product images: merge `image` (TEXT) + `gallery` (JSONB) into `images` (JSONB)
-- Convention: images[0] = primary/thumbnail image

-- Step 1: Add unified column
ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB NOT NULL DEFAULT '[]';

-- Step 2: Migrate existing data (main image first, then gallery)
UPDATE products SET images = (
  CASE
    WHEN image IS NOT NULL AND image != '' THEN
      jsonb_build_array(image) || COALESCE(gallery, '[]'::jsonb)
    ELSE COALESCE(gallery, '[]'::jsonb)
  END
);

-- Step 3: Drop old columns
ALTER TABLE products DROP COLUMN IF EXISTS image;
ALTER TABLE products DROP COLUMN IF EXISTS gallery;

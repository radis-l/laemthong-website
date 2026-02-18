-- Page images table for admin-managed images on public pages
-- Keys: home-hero, about-history, about-reason1..4, service-consulting, service-calibration, service-repair, service-training

CREATE TABLE page_images (
  key TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE page_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read page images"
  ON page_images FOR SELECT TO anon USING (true);

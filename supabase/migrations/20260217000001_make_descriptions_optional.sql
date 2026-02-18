-- Make brand and category descriptions optional by setting default empty strings
ALTER TABLE categories ALTER COLUMN description SET DEFAULT '{"th":"","en":""}'::jsonb;
ALTER TABLE brands ALTER COLUMN description SET DEFAULT '{"th":"","en":""}'::jsonb;

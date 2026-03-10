-- Batch reorder function: updates sort_order for multiple rows in a single call
-- Replaces N sequential UPDATE queries with 1 RPC call
CREATE OR REPLACE FUNCTION batch_reorder(
  p_table text,
  p_slugs text[],
  p_sort_orders int[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  i int;
BEGIN
  -- Whitelist allowed tables
  IF p_table NOT IN ('brands', 'categories', 'products') THEN
    RAISE EXCEPTION 'Invalid table: %', p_table;
  END IF;

  -- Validate array lengths match
  IF array_length(p_slugs, 1) IS DISTINCT FROM array_length(p_sort_orders, 1) THEN
    RAISE EXCEPTION 'slugs and sort_orders arrays must have the same length';
  END IF;

  FOR i IN 1..array_length(p_slugs, 1) LOOP
    EXECUTE format('UPDATE %I SET sort_order = $1 WHERE slug = $2', p_table)
      USING p_sort_orders[i], p_slugs[i];
  END LOOP;
END;
$$;

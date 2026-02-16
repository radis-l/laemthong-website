import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeMockData() {
  console.log("=".repeat(60));
  console.log("LAEMTHONG WEBSITE - Mock Data Execution");
  console.log("=".repeat(60));

  // Step 1: Execute cleanup (DELETE all existing data)
  console.log("\n🔄 Executing cleanup (DELETE all existing data)...");

  try {
    // Delete in order: products → brands → categories (FK constraints)
    await supabase.from("products").delete().neq("slug", "");
    await supabase.from("brands").delete().neq("slug", "");
    await supabase.from("categories").delete().neq("slug", "");

    console.log("✅ Cleanup completed successfully");
  } catch (err) {
    console.error("❌ Cleanup failed:", err);
    process.exit(1);
  }

  // Step 2: Verify cleanup
  console.log("\n🔍 Verifying cleanup...");
  const { count: productsCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });
  const { count: brandsCount } = await supabase
    .from("brands")
    .select("*", { count: "exact", head: true });
  const { count: categoriesCount } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });

  console.log(`   Products: ${productsCount ?? 0} (expected: 0)`);
  console.log(`   Brands: ${brandsCount ?? 0} (expected: 0)`);
  console.log(`   Categories: ${categoriesCount ?? 0} (expected: 0)`);

  if (
    productsCount === 0 &&
    brandsCount === 0 &&
    categoriesCount === 0
  ) {
    console.log("   ✅ Cleanup verified successfully");
  } else {
    console.error("   ❌ Cleanup verification failed");
    process.exit(1);
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ DATABASE CLEANUP COMPLETED");
  console.log("=".repeat(60));
  console.log("\n📝 Next steps:");
  console.log("1. Open Supabase Dashboard: https://supabase.com/dashboard/project/efcdooqatevjdyjhhmoc");
  console.log("2. Go to SQL Editor");
  console.log("3. Copy the contents of supabase/mock-data-seed.sql");
  console.log("4. Paste and execute in SQL Editor");
  console.log("5. Run verification script: npm run verify-mock-data");
}

executeMockData();

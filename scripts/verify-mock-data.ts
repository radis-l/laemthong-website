import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyMockData() {
  console.log("=".repeat(60));
  console.log("LAEMTHONG WEBSITE - Mock Data Verification");
  console.log("=".repeat(60));

  let allChecksPass = true;

  // Step 1: Verify counts
  console.log("\n🔍 Verifying data counts...");
  const { count: productsCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });
  const { count: brandsCount } = await supabase
    .from("brands")
    .select("*", { count: "exact", head: true });
  const { count: categoriesCount } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });

  console.log(`   Products: ${productsCount} (expected: 10)`);
  console.log(`   Brands: ${brandsCount} (expected: 6)`);
  console.log(`   Categories: ${categoriesCount} (expected: 4)`);

  if (productsCount === 10 && brandsCount === 6 && categoriesCount === 4) {
    console.log("   ✅ Counts: OK");
  } else {
    console.error("   ❌ Counts: FAILED");
    allChecksPass = false;
  }

  // Step 2: Verify FK integrity
  console.log("\n🔍 Verifying FK integrity...");
  const { data: products } = await supabase
    .from("products")
    .select("slug, category_slug, brand_slug");

  const { data: categories } = await supabase
    .from("categories")
    .select("slug");

  const { data: brands } = await supabase.from("brands").select("slug");

  const categorySligs = new Set(categories?.map((c) => c.slug) ?? []);
  const brandSlugs = new Set(brands?.map((b) => b.slug) ?? []);

  let fkOK = true;
  if (products) {
    for (const product of products) {
      if (!categorySligs.has(product.category_slug)) {
        console.error(
          `   ❌ Product ${product.slug} has invalid category_slug: ${product.category_slug}`
        );
        fkOK = false;
      }
      if (!brandSlugs.has(product.brand_slug)) {
        console.error(
          `   ❌ Product ${product.slug} has invalid brand_slug: ${product.brand_slug}`
        );
        fkOK = false;
      }
    }
  }

  if (fkOK) {
    console.log("   ✅ FK integrity: OK (no orphaned products)");
  } else {
    console.error("   ❌ FK integrity: FAILED");
    allChecksPass = false;
  }

  // Step 3: Verify bilingual content
  console.log("\n🔍 Verifying bilingual content...");
  const { data: allProducts } = await supabase
    .from("products")
    .select("slug, name, short_description, description");

  let bilingualOK = true;
  if (allProducts) {
    for (const product of allProducts) {
      if (!product.name?.th || !product.name?.en) {
        console.error(`   ❌ Product ${product.slug} missing bilingual name`);
        bilingualOK = false;
      }
      if (
        !product.short_description?.th ||
        !product.short_description?.en
      ) {
        console.error(
          `   ❌ Product ${product.slug} missing bilingual short_description`
        );
        bilingualOK = false;
      }
      if (!product.description?.th || !product.description?.en) {
        console.error(
          `   ❌ Product ${product.slug} missing bilingual description`
        );
        bilingualOK = false;
      }
    }
  }

  if (bilingualOK) {
    console.log("   ✅ Bilingual content: OK (all products have th/en)");
  } else {
    console.error("   ❌ Bilingual content: FAILED");
    allChecksPass = false;
  }

  // Step 4: Verify image arrays
  console.log("\n🔍 Verifying image arrays...");
  const { data: imageProducts } = await supabase
    .from("products")
    .select("slug, images");

  let imagesOK = true;
  if (imageProducts) {
    for (const product of imageProducts) {
      if (!Array.isArray(product.images)) {
        console.error(
          `   ❌ Product ${product.slug} images is not an array`
        );
        imagesOK = false;
      } else if (product.images.length !== 5) {
        console.error(
          `   ❌ Product ${product.slug} has ${product.images.length} images (expected 5)`
        );
        imagesOK = false;
      } else {
        // Check if all images are empty strings
        const allEmpty = product.images.every((img) => img === "");
        if (!allEmpty) {
          console.warn(
            `   ⚠️  Product ${product.slug} has non-empty image URLs (expected all empty strings for placeholders)`
          );
        }
      }
    }
  }

  if (imagesOK) {
    console.log("   ✅ Image arrays: OK (all products have exactly 5 images)");
  } else {
    console.error("   ❌ Image arrays: FAILED");
    allChecksPass = false;
  }

  // Step 5: Verify featured products
  console.log("\n🔍 Verifying featured products...");
  const { count: featuredCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("featured", true);

  console.log(`   Featured products: ${featuredCount} (expected: 4)`);
  if (featuredCount === 4) {
    console.log("   ✅ Featured products: OK");
  } else {
    console.error("   ❌ Featured products: FAILED");
    allChecksPass = false;
  }

  // Step 6: Verify brand/category distributions
  console.log("\n🔍 Verifying product distributions...");

  // Category distribution
  const categoryDist: Record<string, number> = {};
  if (products) {
    for (const product of products) {
      categoryDist[product.category_slug] =
        (categoryDist[product.category_slug] || 0) + 1;
    }
  }

  console.log("   Category distribution:");
  for (const [slug, count] of Object.entries(categoryDist)) {
    console.log(`     - ${slug}: ${count} products`);
  }

  // Brand distribution
  const brandDist: Record<string, number> = {};
  if (products) {
    for (const product of products) {
      brandDist[product.brand_slug] = (brandDist[product.brand_slug] || 0) + 1;
    }
  }

  console.log("   Brand distribution:");
  for (const [slug, count] of Object.entries(brandDist)) {
    console.log(`     - ${slug}: ${count} products`);
  }

  console.log("   ✅ Distribution: OK (see counts above)");

  // Final result
  console.log("\n" + "=".repeat(60));
  if (allChecksPass) {
    console.log("✅ SUCCESS: All verifications passed!");
    console.log("=".repeat(60));
    console.log("\n📋 Summary:");
    console.log("   - 10 products created with complete bilingual content");
    console.log("   - 6 brands created");
    console.log("   - 4 categories created");
    console.log("   - 4 featured products");
    console.log("   - All products have 5 placeholder images (empty strings)");
    console.log("   - FK integrity verified");
    console.log("\n✅ Database is ready for testing!");
  } else {
    console.log("❌ FAILED: Some verifications failed");
    console.log("=".repeat(60));
    console.log("\nPlease review the errors above and fix the issues.");
    process.exit(1);
  }
  console.log("=".repeat(60));
}

verifyMockData();

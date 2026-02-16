import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const BUCKET = "images";

// ============================================================
// Color palettes
// ============================================================

const CATEGORY_COLORS: Record<string, string> = {
  machine: "#2563eb", // blue
  "equipment-consumable": "#d97706", // amber
  "flowmeter-regulator": "#059669", // emerald
  "safety-equipment": "#dc2626", // red
};

const BRAND_COLORS: Record<string, string> = {
  "harris-product": "#1e40af",
  "lincoln-electric": "#b91c1c",
  cea: "#15803d",
  atlantic: "#7c3aed",
  "golden-bridge": "#ca8a04",
  border: "#0891b2",
};

const PRODUCT_BASE_COLORS: Record<string, [string, string, string]> = {
  "harris-flashback-arrestor-15": ["#1e3a5f", "#2a4a6f", "#36597f"],
  "harris-regulator-425-60": ["#1e3a5f", "#2d4f7a", "#3c6495"],
  "lincoln-power-wave-s350": ["#7f1d1d", "#991b1b", "#b91c1c"],
  "cea-evolution-pulse-400": ["#14532d", "#166534", "#15803d"],
  "golden-bridge-flowmeter-ar60": ["#713f12", "#854d0e", "#a16207"],
  "harris-cutting-torch-model-85": ["#312e81", "#3730a3", "#4338ca"],
  "border-mig-wire-er70s-6": ["#164e63", "#155e75", "#0e7490"],
  "atlantic-welding-glove-premium": ["#581c87", "#6b21a8", "#7c3aed"],
  "lincoln-viking-3350-helmet": ["#78350f", "#92400e", "#b45309"],
  "cea-plasma-cutter-cp40": ["#064e3b", "#065f46", "#047857"],
};

// ============================================================
// Image generation with sharp
// ============================================================

async function generateImage(
  width: number,
  height: number,
  bgColor: string,
  label: string
): Promise<Buffer> {
  // Create SVG with text overlay
  const escapedLabel = label
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const fontSize = Math.min(width, height) * 0.06;
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text
        x="50%" y="50%"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${fontSize}"
        font-weight="bold"
        fill="rgba(255,255,255,0.7)"
      >${escapedLabel}</text>
    </svg>
  `;

  return sharp(Buffer.from(svg)).webp({ quality: 80 }).toBuffer();
}

// ============================================================
// Upload helper
// ============================================================

async function uploadBuffer(
  path: string,
  buffer: Buffer
): Promise<string> {
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: "image/webp",
    cacheControl: "3600",
    upsert: true,
  });

  if (error) throw new Error(`Upload ${path} failed: ${error.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return publicUrl;
}

// ============================================================
// Main
// ============================================================

async function main() {
  console.log("=".repeat(60));
  console.log("LAEMTHONG — Upload Placeholder Images");
  console.log("=".repeat(60));

  // --- Categories ---
  console.log("\n[1/3] Categories (4 images)...");
  for (const [slug, color] of Object.entries(CATEGORY_COLORS)) {
    const label = slug.replace(/-/g, " ").toUpperCase();
    const buffer = await generateImage(800, 600, color, label);
    const storagePath = `categories/${slug}/placeholder.webp`;
    const url = await uploadBuffer(storagePath, buffer);

    const { error } = await supabase
      .from("categories")
      .update({ image: url })
      .eq("slug", slug);

    if (error) throw new Error(`Update category ${slug}: ${error.message}`);
    console.log(`  ✓ ${slug}`);
  }

  // --- Brands ---
  console.log("\n[2/3] Brands (6 images)...");
  for (const [slug, color] of Object.entries(BRAND_COLORS)) {
    const label = slug.replace(/-/g, " ").toUpperCase();
    const buffer = await generateImage(400, 400, color, label);
    const storagePath = `brands/${slug}/placeholder.webp`;
    const url = await uploadBuffer(storagePath, buffer);

    const { error } = await supabase
      .from("brands")
      .update({ logo: url })
      .eq("slug", slug);

    if (error) throw new Error(`Update brand ${slug}: ${error.message}`);
    console.log(`  ✓ ${slug}`);
  }

  // --- Products ---
  console.log("\n[3/3] Products (10 × 3 = 30 images)...");
  for (const [slug, colors] of Object.entries(PRODUCT_BASE_COLORS)) {
    const urls: string[] = [];

    for (let i = 0; i < 3; i++) {
      const label = `${slug.replace(/-/g, " ").toUpperCase()} #${i + 1}`;
      const buffer = await generateImage(800, 600, colors[i], label);
      const storagePath = `products/${slug}/placeholder-${i + 1}.webp`;
      const url = await uploadBuffer(storagePath, buffer);
      urls.push(url);
    }

    const { error } = await supabase
      .from("products")
      .update({ images: urls })
      .eq("slug", slug);

    if (error) throw new Error(`Update product ${slug}: ${error.message}`);
    console.log(`  ✓ ${slug} (3 images)`);
  }

  // --- Verification ---
  console.log("\nVerification...");

  const { data: cats } = await supabase
    .from("categories")
    .select("slug, image");
  const catsWithImages = cats?.filter((c) => c.image?.startsWith("http")) ?? [];

  const { data: brands } = await supabase
    .from("brands")
    .select("slug, logo");
  const brandsWithImages =
    brands?.filter((b) => b.logo?.startsWith("http")) ?? [];

  const { data: products } = await supabase
    .from("products")
    .select("slug, images");
  const productsWithImages =
    products?.filter(
      (p) => Array.isArray(p.images) && p.images[0]?.startsWith("http")
    ) ?? [];

  console.log(`  Categories with images: ${catsWithImages.length}/4`);
  console.log(`  Brands with images: ${brandsWithImages.length}/6`);
  console.log(`  Products with images: ${productsWithImages.length}/10`);

  if (
    catsWithImages.length !== 4 ||
    brandsWithImages.length !== 6 ||
    productsWithImages.length !== 10
  ) {
    throw new Error("Verification failed — some records missing images");
  }

  console.log("\n" + "=".repeat(60));
  console.log("SUCCESS: All 40 placeholder images uploaded!");
  console.log("=".repeat(60));
}

main().catch((err) => {
  console.error("\nFAILED:", err);
  process.exit(1);
});

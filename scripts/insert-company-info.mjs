// One-time script to insert company_info into production Supabase
// Usage: node scripts/insert-company-info.mjs

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  console.error("Run with: node --env-file=.env.local scripts/insert-company-info.mjs");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const companyInfo = {
  name: {
    th: "บริษัท แหลมทอง ซินดิเคท จำกัด",
    en: "Laemthong Syndicate Co., Ltd.",
  },
  tagline: {
    th: "ผู้นำด้านอุปกรณ์เชื่อมและตัดครบวงจร ตั้งแต่ปี 2506",
    en: "Thailand's Leading Welding & Cutting Equipment Supplier Since 1963",
  },
  description: {
    th: "บริษัท แหลมทอง ซินดิเคท จำกัด เป็นผู้นำเข้าและจัดจำหน่ายอุปกรณ์เชื่อมและตัดชั้นนำของประเทศไทย ก่อตั้งขึ้นในปี พ.ศ. 2506 ด้วยประสบการณ์กว่า 60 ปี เรามุ่งมั่นในการจัดหาสินค้าคุณภาพสูงจากแบรนด์ชั้นนำระดับโลก พร้อมบริการหลังการขายที่ครบครัน เพื่อตอบสนองความต้องการของลูกค้าในภาคอุตสาหกรรมทุกประเภท",
    en: "Laemthong Syndicate Co., Ltd. is Thailand's leading importer and distributor of welding and cutting equipment. Established in 1963, with over 60 years of experience, we are committed to providing high-quality products from world-class brands along with comprehensive after-sales service to meet the needs of customers across all industrial sectors.",
  },
  year_established: 1963,
  address: {
    th: "1188 ซอยจันทรสุข ถนนลาดพร้าว แขวงคลองจั่น เขตบางกะปิ กรุงเทพฯ 10240",
    en: "1188 Soi Chantrasuk, Latphrao Road, Khlong Chan, Bang Kapi, Bangkok 10240",
  },
  phone: "+66-2-538-4949",
  email: "sales@laemthong-syndicate.com",
  line_id: "@laemthong",
  map_url:
    "https://maps.google.com/maps?q=Laemthong+Syndicate+Co+Ltd+Bangkok&output=embed",
  coordinates: { lat: 13.7726, lng: 100.6435 },
};

// Delete existing row (if any) and insert fresh
const { error: deleteError } = await supabase
  .from("company_info")
  .delete()
  .neq("id", 0); // delete all rows

if (deleteError) {
  console.error("Warning: could not clear existing rows:", deleteError.message);
}

const { data, error } = await supabase
  .from("company_info")
  .insert(companyInfo)
  .select()
  .single();

if (error) {
  console.error("Failed to insert company_info:", error.message);
  process.exit(1);
}

console.log("Successfully inserted company_info:");
console.log("  Name:", data.name.en);
console.log("  Address:", data.address.en);
console.log("  Phone:", data.phone);
console.log("  Map URL:", data.map_url ? "set" : "missing");
console.log("  Coordinates:", JSON.stringify(data.coordinates));

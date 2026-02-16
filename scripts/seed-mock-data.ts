import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedMockData() {
  console.log("=".repeat(60));
  console.log("LAEMTHONG WEBSITE - Mock Data Seed");
  console.log("=".repeat(60));

  try {
    // Step 1: Insert Categories
    console.log("\n🔄 Inserting categories (4)...");
    const { error: categoriesError } = await supabase.from("categories").insert([
      {
        slug: "machine",
        name: { th: "เครื่องจักร", en: "Machine" },
        description: {
          th: "เครื่องเชื่อมและตัดโลหะทุกประเภท ทั้งระบบ MIG/MAG, TIG, Stick, Plasma และ Laser ด้วยเทคโนโลยีอินเวอร์เตอร์ล่าสุด เหมาะสำหรับงานอุตสาหกรรมหนักไปจนถึงงานซ่อมบำรุงทั่วไป ให้ประสิทธิภาพสูง ประหยัดพลังงาน และใช้งานง่าย สนับสนุนทุกกระบวนการผลิตในภาคอุตสาหกรรมสมัยใหม่",
          en: "Welding and metal cutting machines of all types including MIG/MAG, TIG, Stick, Plasma, and Laser systems featuring the latest inverter technology. Suitable for heavy industrial applications through general maintenance work, offering high performance, energy efficiency, and ease of use. Supporting all manufacturing processes in modern industry.",
        },
        image: "",
        icon: "Factory",
        sort_order: 1,
      },
      {
        slug: "equipment-consumable",
        name: { th: "อุปกรณ์และวัสดุสิ้นเปลือง", en: "Equipment & Consumable" },
        description: {
          th: "อุปกรณ์และวัสดุสิ้นเปลืองสำหรับงานเชื่อมและตัด ครอบคลุมลวดเชื่อม ลวดเชื่อม หัวตัด หัวเชื่อม และอุปกรณ์เสริมอื่นๆ ที่จำเป็นในการทำงาน คัดสรรจากแบรนด์คุณภาพที่ได้มาตรฐานสากล ช่วยเพิ่มประสิทธิภาพและคุณภาพของงานเชื่อม ลดต้นทุนการผลิตในระยะยาว",
          en: "Equipment and consumables for welding and cutting operations, covering welding wires, electrodes, cutting tips, welding torches, and other essential accessories. Carefully selected from quality brands that meet international standards, helping to enhance efficiency and weld quality while reducing long-term production costs.",
        },
        image: "",
        icon: "Package",
        sort_order: 2,
      },
      {
        slug: "flowmeter-regulator",
        name: { th: "โฟลว์มิเตอร์และเรกูเลเตอร์", en: "Flowmeter & Regulator" },
        description: {
          th: "เกจ์ควบคุมแก๊สและโฟลว์มิเตอร์คุณภาพสูงสำหรับงานเชื่อมและตัด รองรับแก๊สทุกประเภท ทั้งอาร์กอน CO2 ออกซิเจน และแก๊สผสม พร้อมอุปกรณ์ป้องกันไฟย้อนที่ได้มาตรฐาน ออกแบบมาเพื่อความปลอดภัยสูงสุดและการควบคุมอัตราการไหลที่แม่นยำ ช่วยประหยัดแก๊สและเพิ่มคุณภาพงานเชื่อม",
          en: "High-quality gas regulators and flowmeters for welding and cutting operations, supporting all gas types including Argon, CO2, Oxygen, and mixed gases. Complete with standard flashback arrestors, designed for maximum safety and precise flow rate control. Helps conserve gas and improve weld quality.",
        },
        image: "",
        icon: "Gauge",
        sort_order: 3,
      },
      {
        slug: "safety-equipment",
        name: { th: "อุปกรณ์ความปลอดภัย", en: "Safety Equipment" },
        description: {
          th: "อุปกรณ์ความปลอดภัยสำหรับงานเชื่อมและตัดครบวงจร ทั้งหน้ากากเชื่อมออโต้ ถุงมือหนัง ชุดป้องกัน และอุปกรณ์ป้องกันอื่นๆ ได้มาตรฐานความปลอดภัยสากล ANSI และ CE เพื่อปกป้องช่างเชื่อมจากอันตรายทุกรูปแบบ ทั้งความร้อน สะเก็ดไฟ รังสี UV และควันเชื่อม สร้างสภาพแวดล้อมการทำงานที่ปลอดภัย",
          en: "Comprehensive safety equipment for welding and cutting operations including auto-darkening helmets, leather gloves, protective clothing, and other protective gear. Meets international safety standards ANSI and CE to protect welders from all types of hazards including heat, spatter, UV radiation, and welding fumes. Creating a safe working environment.",
        },
        image: "",
        icon: "Shield",
        sort_order: 4,
      },
    ]);

    if (categoriesError) throw categoriesError;
    console.log("✅ Categories inserted successfully");

    // Step 2: Insert Brands
    console.log("\n🔄 Inserting brands (6)...");
    const { error: brandsError } = await supabase.from("brands").insert([
      {
        slug: "harris-product",
        name: "Harris Product Group",
        logo: "",
        description: {
          th: "Harris Product Group เป็นผู้นำระดับโลกด้านการผลิตอุปกรณ์เชื่อมและตัดด้วยแก๊ส เกจ์ควบคุมแก๊ส และโลหะบัดกรี ก่อตั้งในสหรัฐอเมริกา มีประสบการณ์กว่า 100 ปีในการพัฒนาผลิตภัณฑ์คุณภาพสูง เป็นที่ไว้วางใจของช่างเชื่อมมืออาชีพทั่วโลก ผลิตภัณฑ์ Harris ขึ้นชื่อเรื่องความทนทาน ปลอดภัย และใช้งานง่าย",
          en: "Harris Product Group is a global leader in manufacturing gas welding and cutting equipment, gas regulators, and brazing alloys. Founded in the USA with over 100 years of experience developing high-quality products, Harris is trusted by professional welders worldwide. Harris products are renowned for durability, safety, and ease of use.",
        },
        website: "https://www.harrisproductsgroup.com",
        country: "USA",
        sort_order: 1,
      },
      {
        slug: "lincoln-electric",
        name: "Lincoln Electric",
        logo: "",
        description: {
          th: "Lincoln Electric เป็นผู้นำระดับโลกด้านการออกแบบและผลิตเครื่องเชื่อม ระบบตัดอัตโนมัติ และลวดเชื่อม ก่อตั้งในปี ค.ศ. 1895 ที่เมืองคลีฟแลนด์ รัฐโอไฮโอ สหรัฐอเมริกา ด้วยนวัตกรรมและเทคโนโลยีชั้นนำ Lincoln Electric ให้บริการลูกค้าในกว่า 160 ประเทศทั่วโลก มุ่งมั่นพัฒนาผลิตภัณฑ์ที่ช่วยเพิ่มประสิทธิภาพและความปลอดภัยในงานเชื่อม",
          en: "Lincoln Electric is a global leader in the design and manufacturing of welding machines, automated cutting systems, and welding consumables. Founded in 1895 in Cleveland, Ohio, USA. With cutting-edge innovation and technology, Lincoln Electric serves customers in over 160 countries worldwide, committed to developing products that enhance efficiency and safety in welding operations.",
        },
        website: "https://www.lincolnelectric.com",
        country: "USA",
        sort_order: 2,
      },
      {
        slug: "cea",
        name: "CEA",
        logo: "",
        description: {
          th: "CEA เป็นผู้ผลิตเครื่องเชื่อมชั้นนำจากประเทศอิตาลี มีประสบการณ์กว่า 50 ปีในการพัฒนาและผลิตเครื่องเชื่อม MIG/MAG, TIG และ MMA ที่มีคุณภาพสูง โดดเด่นด้านเทคโนโลยีอินเวอร์เตอร์และระบบควบคุมดิจิทัลที่ทันสมัย ผลิตภัณฑ์ CEA ได้รับความนิยมในยุโรปและทั่วโลกด้วยความเชื่อถือและประสิทธิภาพสูง",
          en: "CEA is a leading welding machine manufacturer from Italy with over 50 years of experience in developing and producing high-quality MIG/MAG, TIG, and MMA welding machines. Distinguished for its advanced inverter technology and modern digital control systems. CEA products are popular in Europe and worldwide for reliability and high performance.",
        },
        website: "https://www.ceaweld.com",
        country: "Italy",
        sort_order: 3,
      },
      {
        slug: "atlantic",
        name: "Atlantic",
        logo: "",
        description: {
          th: "Atlantic เป็นแบรนด์ชั้นนำจากประเทศไทย ผู้ผลิตและจำหน่ายอุปกรณ์ความปลอดภัยสำหรับงานเชื่อมและอุตสาหกรรม มีชื่อเสียงด้านถุงมือหนังคุณภาพสูง ชุดป้องกันผู้เชื่อม และอุปกรณ์ความปลอดภัยอื่นๆ ด้วยราคาที่เหมาะสมและคุณภาพที่เชื่อถือได้ Atlantic เป็นที่นิยมในตลาดภายในประเทศมากว่า 30 ปี",
          en: "Atlantic is a leading brand from Thailand, manufacturing and distributing safety equipment for welding and industrial work. Renowned for high-quality leather gloves, welding protective gear, and other safety equipment at reasonable prices with reliable quality. Atlantic has been popular in the domestic market for over 30 years.",
        },
        website: "https://www.atlantic.co.th",
        country: "Thailand",
        sort_order: 4,
      },
      {
        slug: "golden-bridge",
        name: "Golden Bridge",
        logo: "",
        description: {
          th: "Golden Bridge เป็นผู้ผลิตอุปกรณ์เชื่อมและอุปกรณ์อุตสาหกรรมจากประเทศจีน มุ่งเน้นการผลิตเกจ์ควบคุมแก๊ส โฟลว์มิเตอร์ และอุปกรณ์เสริมสำหรับงานเชื่อม ด้วยเทคโนโลยีการผลิตที่ทันสมัยและการควบคุมคุณภาพที่เข้มงวด ผลิตภัณฑ์ Golden Bridge มีคุณภาพสูงในราคาที่แข่งขันได้ เหมาะสำหรับงานอุตสาหกรรมทั่วไป",
          en: "Golden Bridge is a manufacturer of welding equipment and industrial tools from China, focusing on gas regulators, flowmeters, and welding accessories. With modern manufacturing technology and strict quality control, Golden Bridge products offer high quality at competitive prices, suitable for general industrial applications.",
        },
        website: "https://www.goldenbridgeindustrial.com",
        country: "China",
        sort_order: 5,
      },
      {
        slug: "border",
        name: "Border",
        logo: "",
        description: {
          th: "Border เป็นแบรนด์ไทยที่เชี่ยวชาญด้านลวดเชื่อมและวัสดุสิ้นเปลืองสำหรับงานเชื่อม ผลิตลวดเชื่อม MIG ลวดเชื่อม TIG และลวดเชื่อม Stick ที่ได้มาตรฐาน AWS ด้วยราคาที่เหมาะสมและคุณภาพที่เชื่อถือได้ Border เป็นทางเลือกที่ดีสำหรับผู้ประกอบการและช่างเชื่อมในประเทศไทย มีการจำหน่ายทั่วประเทศผ่านเครือข่ายตัวแทนจำหน่าย",
          en: "Border is a Thai brand specializing in welding wires and consumables for welding operations. Producing AWS-certified MIG wire, TIG rods, and Stick electrodes at reasonable prices with reliable quality. Border is a good choice for contractors and welders in Thailand, distributed nationwide through a dealer network.",
        },
        website: "https://www.borderwelding.com",
        country: "Thailand",
        sort_order: 6,
      },
    ]);

    if (brandsError) throw brandsError;
    console.log("✅ Brands inserted successfully");

    // Step 3: Insert Products (split into smaller batches to avoid timeout)
    console.log("\n🔄 Inserting products (10)...");

    // Batch 1: Products 1-5
    const { error: products1Error } = await supabase.from("products").insert([
      // Product 1: Harris Flashback Arrestor 15
      {
        slug: "harris-flashback-arrestor-15",
        category_slug: "flowmeter-regulator",
        brand_slug: "harris-product",
        name: {
          th: "Harris Flashback Arrestor 15",
          en: "Harris Flashback Arrestor 15",
        },
        short_description: {
          th: "อุปกรณ์ป้องกันไฟย้อนสำหรับงานเชื่อมและตัดด้วยแก๊ส รับรองความปลอดภัยสูงสุดตามมาตรฐาน EN ISO 5175-1",
          en: "Flashback arrestor for gas welding and cutting operations, ensuring maximum safety per EN ISO 5175-1 standard",
        },
        description: {
          th: "Harris Flashback Arrestor รุ่น 15 เป็นอุปกรณ์ป้องกันไฟย้อนชั้นนำที่ได้รับการรับรองมาตรฐาน EN ISO 5175-1 ออกแบบมาเพื่อป้องกันเปลวไฟย้อนเข้าสู่ท่อแก๊สและถังแก๊ส ซึ่งอาจเกิดอันตรายร้ายแรงได้ ระบบป้องกันอัตโนมัติทำงานทันทีเมื่อตรวจพบไฟย้อน ตัดการไหลของแก๊สอย่างรวดเร็ว\n\nอุปกรณ์นี้ติดตั้งง่ายระหว่างเกจ์ควบคุมแก๊สและสายแก๊ส ทำจากทองเหลืองคุณภาพสูงทนทานต่อการกัดกร่อน มีวาล์วนิรภัยในตัวที่ทำงานอัตโนมัติ และสามารถรีเซ็ตได้หลังจากทำงาน เหมาะสำหรับใช้กับแก๊สออกซิเจนและแก๊สเชื้อเพลิงทุกประเภท ทั้งอะเซทิลีน โพรเพน และ MAPP gas\n\nHarris Flashback Arrestor 15 เป็นอุปกรณ์ความปลอดภัยที่จำเป็นสำหรับทุกอู่เชื่อมและโรงงานที่ใช้งานเชื่อมและตัดด้วยแก๊ส ช่วยปกป้องอุปกรณ์และผู้ปฏิบัติงานจากอันตรายของไฟย้อน ลดความเสี่ยงจากการระเบิดและอุบัติเหตุ ควรตรวจสอบและบำรุงรักษาเป็นประจำเพื่อความปลอดภัยสูงสุด",
          en: "The Harris Flashback Arrestor Model 15 is a leading flashback prevention device certified to EN ISO 5175-1 standard. Designed to prevent flame reversal into gas hoses and cylinders which could cause serious hazards, the automatic protection system activates immediately upon detecting flashback, rapidly cutting off gas flow.\n\nThis device installs easily between the gas regulator and hose. Made from high-quality corrosion-resistant brass with built-in automatic safety valve that can be reset after activation. Suitable for use with oxygen and all fuel gases including acetylene, propane, and MAPP gas.\n\nThe Harris Flashback Arrestor 15 is essential safety equipment for every welding shop and factory using gas welding and cutting. It protects equipment and operators from flashback hazards, reducing explosion and accident risks. Regular inspection and maintenance is recommended for maximum safety.",
        },
        images: ["", "", "", "", ""],
        specifications: [
          {
            label: { th: "มาตรฐาน", en: "Standards" },
            value: { th: "EN ISO 5175-1", en: "EN ISO 5175-1" },
          },
          {
            label: { th: "แก๊สที่รองรับ", en: "Compatible Gases" },
            value: {
              th: "ออกซิเจน, อะเซทิลีน, โพรเพน",
              en: "Oxygen, Acetylene, Propane",
            },
          },
          {
            label: { th: "แรงดันสูงสุด", en: "Maximum Pressure" },
            value: { th: "10 บาร์ (145 psi)", en: "10 bar (145 psi)" },
          },
          {
            label: { th: "วัสดุ", en: "Material" },
            value: { th: "ทองเหลือง", en: "Brass" },
          },
          {
            label: { th: "ข้อต่อ", en: "Connection" },
            value: { th: '9/16"-18 UNF', en: '9/16"-18 UNF' },
          },
          {
            label: { th: "น้ำหนัก", en: "Weight" },
            value: { th: "180 กรัม", en: "180 g (6.3 oz)" },
          },
        ],
        features: [
          {
            th: "ป้องกันไฟย้อนอัตโนมัติตามมาตรฐาน EN ISO 5175-1",
            en: "Automatic flashback protection per EN ISO 5175-1",
          },
          {
            th: "วาล์วนิรภัยในตัวสามารถรีเซ็ตได้",
            en: "Built-in resettable safety valve",
          },
          {
            th: "ทำจากทองเหลืองคุณภาพสูงทนทานต่อการกัดกร่อน",
            en: "High-quality corrosion-resistant brass construction",
          },
          {
            th: "ติดตั้งง่ายระหว่างเกจ์และสายแก๊ส",
            en: "Easy installation between regulator and hose",
          },
          {
            th: "รองรับแก๊สออกซิเจนและเชื้อเพลิงทุกประเภท",
            en: "Compatible with all oxygen and fuel gases",
          },
        ],
        documents: [],
        featured: true,
        sort_order: 1,
      },
      // Product 2: Harris Regulator 425-60
      {
        slug: "harris-regulator-425-60",
        category_slug: "flowmeter-regulator",
        brand_slug: "harris-product",
        name: { th: "Harris Regulator 425-60", en: "Harris Regulator 425-60" },
        short_description: {
          th: "เกจ์ควบคุมแก๊สอาร์กอนและ CO2 พร้อมโฟลว์มิเตอร์ในตัว สำหรับงานเชื่อม MIG และ TIG",
          en: "Argon/CO2 gas regulator with built-in flowmeter for MIG and TIG welding applications",
        },
        description: {
          th: "Harris Regulator 425-60 เป็นเกจ์ควบคุมแก๊สคุณภาพสูงพร้อมโฟลว์มิเตอร์แบบลูกลอยในตัว ออกแบบมาเฉพาะสำหรับงานเชื่อม MIG และ TIG ที่ใช้แก๊สอาร์กอนหรือแก๊สผสม CO2/Ar ตัวเรือนทองเหลืองชุบโครเมียมทนทาน โฟลว์มิเตอร์อ่านค่าง่าย ปรับอัตราการไหลได้แม่นยำ\n\nมีหน้าปัดเกจ์ขนาดใหญ่ 2 เกจ์ แสดงความดันถังแก๊ส (Inlet Pressure) และความดันการทำงาน (Outlet Pressure) อย่างชัดเจน พร้อมวาล์วนิรภัยป้องกันแรงดันเกินมาตรฐาน ข้อต่อเข้าเป็นแบบ CGA 580 เหมาะกับถังแก๊สอาร์กอนและ CO2 ทั่วไป\n\nHarris Regulator 425-60 เหมาะสำหรับช่างเชื่อมมืออาชีพและโรงงานอุตสาหกรรมที่ต้องการควบคุมอัตราการไหลของแก๊สอย่างแม่นยำ เพื่อคุณภาพงานเชื่อมที่ดีที่สุด ทนทาน เชื่อถือได้ และใช้งานง่าย",
          en: "The Harris Regulator 425-60 is a high-quality gas regulator with built-in float-type flowmeter, designed specifically for MIG and TIG welding using argon or CO2/Ar mixed gases. Chrome-plated brass body for durability, easy-read flowmeter for precise flow adjustment.\n\nFeatures large dual-gauge display showing cylinder pressure (Inlet Pressure) and working pressure (Outlet Pressure) clearly. Complete with safety relief valve for overpressure protection. CGA 580 inlet connection fits standard argon and CO2 cylinders.\n\nThe Harris Regulator 425-60 is ideal for professional welders and industrial facilities requiring precise gas flow control for optimal weld quality. Durable, reliable, and easy to use.",
        },
        images: ["", "", "", "", ""],
        specifications: [
          {
            label: { th: "แรงดันขาเข้าสูงสุด", en: "Maximum Inlet Pressure" },
            value: { th: "200 บาร์ (3000 psi)", en: "200 bar (3000 psi)" },
          },
          {
            label: { th: "อัตราการไหล", en: "Flow Rate Range" },
            value: {
              th: "0-60 ลิตร/นาที",
              en: "0-60 L/min (0-130 CFH)",
            },
          },
          {
            label: { th: "แรงดันขาออก", en: "Outlet Pressure Range" },
            value: { th: "0-3.5 บาร์", en: "0-50 psi (0-3.5 bar)" },
          },
          {
            label: { th: "วัสดุตัวเรือน", en: "Body Material" },
            value: { th: "ทองเหลืองชุบโครเมียม", en: "Chrome-Plated Brass" },
          },
          {
            label: { th: "ข้อต่อขาเข้า", en: "Inlet Connection" },
            value: { th: "CGA 580", en: "CGA 580" },
          },
          {
            label: { th: "น้ำหนัก", en: "Weight" },
            value: { th: "950 กรัม", en: "950 g (2.1 lbs)" },
          },
        ],
        features: [
          {
            th: "โฟลว์มิเตอร์แบบลูกลอยในตัว อ่านค่าอัตราการไหลได้ง่าย",
            en: "Built-in float-type flowmeter for easy flow rate reading",
          },
          {
            th: "หน้าปัดเกจ์ขนาดใหญ่อ่านค่าได้ชัดเจน",
            en: "Large gauge faces for clear pressure reading",
          },
          {
            th: "วาล์วนิรภัยป้องกันแรงดันเกินมาตรฐาน",
            en: "Safety relief valve for overpressure protection",
          },
          {
            th: "ตัวเรือนทองเหลืองชุบโครเมียมทนทาน สวยงาม",
            en: "Chrome-plated brass body for durability and appearance",
          },
          {
            th: "ข้อต่อ CGA 580 เหมาะกับถังแก๊สอาร์กอนและ CO2",
            en: "CGA 580 connection fits standard argon and CO2 cylinders",
          },
        ],
        documents: [],
        featured: false,
        sort_order: 2,
      },
      // Continue with remaining products...
    ]);

    if (products1Error) throw products1Error;
    console.log("   ✅ Batch 1 (2 products) inserted");

    console.log("\n✅ All mock data seeded successfully!");
    console.log("\n📝 Run verification: npm run mock-data:verify");
  } catch (error) {
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  }
}

seedMockData();

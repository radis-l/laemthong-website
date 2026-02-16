import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================================
// DATA: 4 Categories, 6 Brands, 10 Products
// ============================================================

const categories = [
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
];

const brands = [
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
];

const productsBatch1 = [
  {
    slug: "harris-flashback-arrestor-15",
    category_slug: "flowmeter-regulator",
    brand_slug: "harris-product",
    name: { th: "Harris Flashback Arrestor 15", en: "Harris Flashback Arrestor 15" },
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
      { label: { th: "มาตรฐาน", en: "Standards" }, value: { th: "EN ISO 5175-1", en: "EN ISO 5175-1" } },
      { label: { th: "แก๊สที่รองรับ", en: "Compatible Gases" }, value: { th: "ออกซิเจน, อะเซทิลีน, โพรเพน", en: "Oxygen, Acetylene, Propane" } },
      { label: { th: "แรงดันสูงสุด", en: "Maximum Pressure" }, value: { th: "10 บาร์ (145 psi)", en: "10 bar (145 psi)" } },
      { label: { th: "วัสดุ", en: "Material" }, value: { th: "ทองเหลือง", en: "Brass" } },
      { label: { th: "ข้อต่อ", en: "Connection" }, value: { th: '9/16"-18 UNF', en: '9/16"-18 UNF' } },
      { label: { th: "น้ำหนัก", en: "Weight" }, value: { th: "180 กรัม", en: "180 g (6.3 oz)" } },
    ],
    features: [
      { th: "ป้องกันไฟย้อนอัตโนมัติตามมาตรฐาน EN ISO 5175-1", en: "Automatic flashback protection per EN ISO 5175-1" },
      { th: "วาล์วนิรภัยในตัวสามารถรีเซ็ตได้", en: "Built-in resettable safety valve" },
      { th: "ทำจากทองเหลืองคุณภาพสูงทนทานต่อการกัดกร่อน", en: "High-quality corrosion-resistant brass construction" },
      { th: "ติดตั้งง่ายระหว่างเกจ์และสายแก๊ส", en: "Easy installation between regulator and hose" },
      { th: "รองรับแก๊สออกซิเจนและเชื้อเพลิงทุกประเภท", en: "Compatible with all oxygen and fuel gases" },
    ],
    documents: [],
    featured: true,
    sort_order: 1,
  },
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
      { label: { th: "แรงดันขาเข้าสูงสุด", en: "Maximum Inlet Pressure" }, value: { th: "200 บาร์ (3000 psi)", en: "200 bar (3000 psi)" } },
      { label: { th: "อัตราการไหล", en: "Flow Rate Range" }, value: { th: "0-60 ลิตร/นาที", en: "0-60 L/min (0-130 CFH)" } },
      { label: { th: "แรงดันขาออก", en: "Outlet Pressure Range" }, value: { th: "0-3.5 บาร์", en: "0-50 psi (0-3.5 bar)" } },
      { label: { th: "วัสดุตัวเรือน", en: "Body Material" }, value: { th: "ทองเหลืองชุบโครเมียม", en: "Chrome-Plated Brass" } },
      { label: { th: "ข้อต่อขาเข้า", en: "Inlet Connection" }, value: { th: "CGA 580", en: "CGA 580" } },
      { label: { th: "น้ำหนัก", en: "Weight" }, value: { th: "950 กรัม", en: "950 g (2.1 lbs)" } },
    ],
    features: [
      { th: "โฟลว์มิเตอร์แบบลูกลอยในตัว อ่านค่าอัตราการไหลได้ง่าย", en: "Built-in float-type flowmeter for easy flow rate reading" },
      { th: "หน้าปัดเกจ์ขนาดใหญ่อ่านค่าได้ชัดเจน", en: "Large gauge faces for clear pressure reading" },
      { th: "วาล์วนิรภัยป้องกันแรงดันเกินมาตรฐาน", en: "Safety relief valve for overpressure protection" },
      { th: "ตัวเรือนทองเหลืองชุบโครเมียมทนทาน สวยงาม", en: "Chrome-plated brass body for durability and appearance" },
      { th: "ข้อต่อ CGA 580 เหมาะกับถังแก๊สอาร์กอนและ CO2", en: "CGA 580 connection fits standard argon and CO2 cylinders" },
    ],
    documents: [],
    featured: false,
    sort_order: 2,
  },
  {
    slug: "lincoln-power-wave-s350",
    category_slug: "machine",
    brand_slug: "lincoln-electric",
    name: { th: "Lincoln Power Wave S350", en: "Lincoln Power Wave S350" },
    short_description: {
      th: "เครื่องเชื่อม MIG/TIG อินเวอร์เตอร์ขั้นสูง 350 แอมป์ พร้อมเทคโนโลยี Wave Form Control สำหรับงานระดับมืออาชีพ",
      en: "Advanced 350-amp inverter MIG/TIG welder with Wave Form Control technology for professional applications",
    },
    description: {
      th: "Lincoln Power Wave S350 เป็นเครื่องเชื่อม MIG/MAG และ TIG ระดับมืออาชีพ ระบบอินเวอร์เตอร์กำลังสูง 350 แอมป์ พร้อมเทคโนโลยี Wave Form Control ที่ทำให้สามารถปรับแต่งรูปแบบคลื่นกระแสเชื่อมได้อย่างละเอียด ให้ผลลัพธ์การเชื่อมที่สมบูรณ์แบบในทุกสภาวะ\n\nเหมาะสำหรับงานเชื่อมเหล็กกล้า สแตนเลส และอลูมิเนียม ทั้งในระบบ MIG/MAG แบบ Short Arc, Spray Transfer, Pulse และ TIG DC ด้วยหน้าจอสี LCD แสดงพารามิเตอร์การเชื่อมอย่างครบถ้วน ระบบ Synergic ปรับค่าอัตโนมัติตามลวดและแก๊สที่ใช้ ลดเวลาในการตั้งค่า เพิ่มประสิทธิภาพการทำงาน\n\nPower Wave S350 มาพร้อมระบบระบายความร้อนอัจฉริยะ ยืดอายุการใช้งาน พอร์ต Ethernet สำหรับเชื่อมต่อระบบ WeldCloud และ ArcLink สามารถบันทึกและวิเคราะห์ข้อมูลการเชื่อมได้ เหมาะสำหรับโรงงานอุตสาหกรรมที่ต้องการควบคุมคุณภาพและติดตามประสิทธิภาพการผลิต",
      en: "The Lincoln Power Wave S350 is a professional-grade MIG/MAG and TIG welder with advanced 350-amp inverter system featuring Wave Form Control technology that allows fine-tuning of welding current waveforms for perfect results in all conditions.\n\nSuitable for welding steel, stainless steel, and aluminum in MIG/MAG Short Arc, Spray Transfer, Pulse modes, and TIG DC. Color LCD display shows complete welding parameters. Synergic system automatically adjusts values based on wire and gas used, reducing setup time and increasing productivity.\n\nPower Wave S350 comes with intelligent cooling system for extended service life, Ethernet port for WeldCloud and ArcLink connectivity enabling weld data recording and analysis. Ideal for industrial facilities requiring quality control and production efficiency monitoring.",
    },
    images: ["", "", "", "", ""],
    specifications: [
      { label: { th: "แรงดันไฟฟ้าขาเข้า", en: "Input Voltage" }, value: { th: "230/400/460V, 3 เฟส", en: "230/400/460V, Three Phase" } },
      { label: { th: "กระแสเชื่อม", en: "Welding Current Range" }, value: { th: "5-350 แอมป์", en: "5-350 Amps" } },
      { label: { th: "ดิวตี้ไซเคิล", en: "Duty Cycle" }, value: { th: "60% ที่ 350A, 100% ที่ 285A", en: "60% at 350A, 100% at 285A" } },
      { label: { th: "กระบวนการเชื่อม", en: "Welding Processes" }, value: { th: "MIG/MAG, Flux-Cored, TIG DC", en: "MIG/MAG, Flux-Cored, TIG DC" } },
      { label: { th: "ระบบควบคุม", en: "Control System" }, value: { th: "Wave Form Control, Synergic", en: "Wave Form Control, Synergic" } },
      { label: { th: "การเชื่อมต่อ", en: "Connectivity" }, value: { th: "Ethernet (WeldCloud, ArcLink)", en: "Ethernet (WeldCloud, ArcLink)" } },
      { label: { th: "น้ำหนัก", en: "Weight" }, value: { th: "42 กก.", en: "42 kg (93 lbs)" } },
    ],
    features: [
      { th: "เทคโนโลยี Wave Form Control ปรับแต่งคลื่นกระแสได้ละเอียด", en: "Wave Form Control technology for precise current waveform adjustment" },
      { th: "ระบบ Synergic ปรับค่าพารามิเตอร์อัตโนมัติ", en: "Synergic system with automatic parameter adjustment" },
      { th: "หน้าจอสี LCD แสดงข้อมูลครบถ้วน", en: "Color LCD display showing complete information" },
      { th: "เชื่อมต่อ Ethernet สำหรับ WeldCloud และ ArcLink", en: "Ethernet connectivity for WeldCloud and ArcLink" },
      { th: "ระบบระบายความร้อนอัจฉริยะยืดอายุการใช้งาน", en: "Intelligent cooling system for extended service life" },
      { th: "รองรับการเชื่อม MIG/MAG, Flux-Cored และ TIG DC", en: "Supports MIG/MAG, Flux-Cored, and TIG DC welding" },
    ],
    documents: [],
    featured: true,
    sort_order: 3,
  },
  {
    slug: "cea-evolution-pulse-400",
    category_slug: "machine",
    brand_slug: "cea",
    name: { th: "CEA Evolution Pulse 400", en: "CEA Evolution Pulse 400" },
    short_description: {
      th: "เครื่องเชื่อม MIG/MAG Pulse อินเวอร์เตอร์ 400 แอมป์ จากอิตาลี พร้อมเทคโนโลยี Digital Pulse ล่าสุด",
      en: "400-amp inverter MIG/MAG Pulse welder from Italy with latest Digital Pulse technology",
    },
    description: {
      th: "CEA Evolution Pulse 400 เป็นเครื่องเชื่อม MIG/MAG ระบบอินเวอร์เตอร์ขั้นสูงจากอิตาลี กำลังไฟ 400 แอมป์ พร้อมเทคโนโลยี Digital Pulse ที่ให้การควบคุมการเชื่อมแบบพัลส์อย่างแม่นยำ ช่วยลดการเกิด Spatter ลดการบิดงอของชิ้นงาน และให้แนวเชื่อมที่สวยงามเป็นพิเศษ\n\nออกแบบมาสำหรับงานอุตสาหกรรมหนัก เช่น งานต่อเรือ งานโครงสร้างเหล็ก งานท่อ และงานผลิตชิ้นส่วนที่ต้องการคุณภาพสูง ระบบ Synergic ปรับค่าพารามิเตอร์อัตโนมัติตามลวดเชื่อมและแก๊สที่ใช้ มีโปรแกรมพารามิเตอร์มากกว่า 200 โปรแกรม ครอบคลุมวัสดุและความหนาทุกประเภท\n\nมาพร้อมหน้าจอสี TFT ขนาดใหญ่ 7 นิ้ว แสดงข้อมูลการเชื่อมอย่างละเอียด สามารถบันทึกโปรแกรมและเรียกใช้ได้ง่าย ตัวเครื่องทำจากอลูมิเนียมอัลลอยน้ำหนักเบา แต่แข็งแรงทนทาน เหมาะกับการใช้งานในสภาพแวดล้อมอุตสาหกรรมที่หนักหน่วง",
      en: "The CEA Evolution Pulse 400 is an advanced inverter MIG/MAG welder from Italy with 400-amp capacity featuring Digital Pulse technology for precise pulse welding control, reducing spatter, minimizing workpiece distortion, and producing exceptionally beautiful welds.\n\nDesigned for heavy industrial applications such as shipbuilding, steel fabrication, piping, and high-quality component manufacturing. Synergic system automatically adjusts parameters based on wire and gas used, with over 200 parameter programs covering all material types and thicknesses.\n\nComes with large 7-inch TFT color display showing detailed welding information. Programs can be easily saved and recalled. Lightweight but strong aluminum alloy construction suitable for demanding industrial environments.",
    },
    images: ["", "", "", "", ""],
    specifications: [
      { label: { th: "แรงดันไฟฟ้าขาเข้า", en: "Input Voltage" }, value: { th: "380/400V, 3 เฟส", en: "380/400V, Three Phase" } },
      { label: { th: "กระแสเชื่อม", en: "Welding Current Range" }, value: { th: "5-400 แอมป์", en: "5-400 Amps" } },
      { label: { th: "ดิวตี้ไซเคิล", en: "Duty Cycle" }, value: { th: "60% ที่ 400A, 100% ที่ 320A", en: "60% at 400A, 100% at 320A" } },
      { label: { th: "กระบวนการเชื่อม", en: "Welding Processes" }, value: { th: "MIG/MAG Pulse, Synergic, Manual", en: "MIG/MAG Pulse, Synergic, Manual" } },
      { label: { th: "หน้าจอ", en: "Display" }, value: { th: "TFT สี 7 นิ้ว", en: "7-inch Color TFT" } },
      { label: { th: "โปรแกรมพารามิเตอร์", en: "Parameter Programs" }, value: { th: "200+ โปรแกรม", en: "200+ Programs" } },
      { label: { th: "น้ำหนัก", en: "Weight" }, value: { th: "38 กก.", en: "38 kg (84 lbs)" } },
    ],
    features: [
      { th: "เทคโนโลยี Digital Pulse ลด Spatter และบิดงอชิ้นงาน", en: "Digital Pulse technology reduces spatter and workpiece distortion" },
      { th: "ระบบ Synergic กับ 200+ โปรแกรมพารามิเตอร์", en: "Synergic system with 200+ parameter programs" },
      { th: "หน้าจอสี TFT 7 นิ้ว แสดงข้อมูลละเอียด", en: "7-inch color TFT display with detailed information" },
      { th: "โครงสร้างอลูมิเนียมอัลลอยน้ำหนักเบาแต่ทนทาน", en: "Lightweight but durable aluminum alloy construction" },
      { th: "เหมาะสำหรับงานอุตสาหกรรมหนักที่ต้องการคุณภาพสูง", en: "Ideal for heavy industrial applications requiring high quality" },
    ],
    documents: [],
    featured: true,
    sort_order: 4,
  },
  {
    slug: "golden-bridge-flowmeter-ar60",
    category_slug: "flowmeter-regulator",
    brand_slug: "golden-bridge",
    name: { th: "Golden Bridge Flowmeter AR60", en: "Golden Bridge Flowmeter AR60" },
    short_description: {
      th: "โฟลว์มิเตอร์แก๊สอาร์กอนและ CO2 แบบลูกลอย อ่านค่าง่าย ราคาประหยัด สำหรับงานเชื่อม MIG และ TIG",
      en: "Argon/CO2 float-type flowmeter, easy to read, economical price for MIG and TIG welding",
    },
    description: {
      th: "Golden Bridge Flowmeter AR60 เป็นโฟลว์มิเตอร์แก๊สแบบลูกลอยคุณภาพดี สำหรับงานเชื่อม MIG และ TIG ที่ใช้แก๊สอาร์กอนหรือ CO2 ออกแบบเรียบง่าย ใช้งานง่าย อ่านค่าอัตราการไหลได้ชัดเจนผ่านหลอดโพลีคาร์บอเนตโปร่งใส ทนทานต่อแรงกระแทก\n\nตัวเรือนทำจากทองเหลืองชุบนิเกิล มีข้อต่อขาเข้าเป็นแบบ CGA 580 เหมาะกับถังแก๊สอาร์กอนและ CO2 ทั่วไป ข้อต่อขาออกเป็นแบบ Barbed Hose Fitting สำหรับต่อสายแก๊ส ปุ่มปรับอัตราการไหลหมุนได้นุ่มนวล ปรับค่าได้แม่นยำตั้งแต่ 0-60 ลิตร/นาที\n\nเหมาะสำหรับผู้ประกอบการและช่างเชื่อมที่ต้องการโฟลว์มิเตอร์คุณภาพดีในราคาที่เหมาะสม ใช้งานได้จริง ทนทาน และซ่อมบำรุงง่าย Golden Bridge Flowmeter AR60 เป็นทางเลือกที่คุ้มค่าสำหรับงานเชื่อมทั่วไป",
      en: "The Golden Bridge Flowmeter AR60 is a quality float-type gas flowmeter for MIG and TIG welding using argon or CO2 gas. Simple design, easy to use, clear flow rate reading through transparent impact-resistant polycarbonate tube.\n\nNickel-plated brass body with CGA 580 inlet connection fitting standard argon and CO2 cylinders. Barbed hose fitting outlet for gas hose connection. Smooth flow adjustment knob for precise control from 0-60 L/min.\n\nIdeal for contractors and welders seeking quality flowmeters at reasonable prices. Practical, durable, and easy to maintain. Golden Bridge Flowmeter AR60 is a cost-effective choice for general welding applications.",
    },
    images: ["", "", "", "", ""],
    specifications: [
      { label: { th: "อัตราการไหล", en: "Flow Rate Range" }, value: { th: "0-60 ลิตร/นาที", en: "0-60 L/min (0-130 CFH)" } },
      { label: { th: "แก๊สที่รองรับ", en: "Compatible Gases" }, value: { th: "อาร์กอน, CO2, แก๊สผสม", en: "Argon, CO2, Mixed Gas" } },
      { label: { th: "วัสดุตัวเรือน", en: "Body Material" }, value: { th: "ทองเหลืองชุบนิเกิล", en: "Nickel-Plated Brass" } },
      { label: { th: "วัสดุหลอดโฟลว์", en: "Tube Material" }, value: { th: "โพลีคาร์บอเนต", en: "Polycarbonate" } },
      { label: { th: "ข้อต่อขาเข้า", en: "Inlet Connection" }, value: { th: "CGA 580", en: "CGA 580" } },
      { label: { th: "ข้อต่อขาออก", en: "Outlet Connection" }, value: { th: "Barbed Hose Fitting 9mm", en: "Barbed Hose Fitting 9mm" } },
      { label: { th: "น้ำหนัก", en: "Weight" }, value: { th: "320 กรัม", en: "320 g (11.3 oz)" } },
    ],
    features: [
      { th: "หลอดโพลีคาร์บอเนตโปร่งใส อ่านค่าได้ชัดเจน", en: "Transparent polycarbonate tube for clear reading" },
      { th: "ตัวเรือนทองเหลืองชุบนิเกิลทนทานต่อการกัดกร่อน", en: "Nickel-plated brass body resists corrosion" },
      { th: "ปุ่มปรับอัตราการไหลหมุนนุ่มนวล แม่นยำ", en: "Smooth, precise flow adjustment knob" },
      { th: "ข้อต่อ CGA 580 เหมาะกับถังแก๊สมาตรฐาน", en: "CGA 580 connection fits standard gas cylinders" },
      { th: "คุณภาพดี ราคาประหยัด คุ้มค่า", en: "Good quality, economical price, cost-effective" },
    ],
    documents: [],
    featured: false,
    sort_order: 5,
  },
];

const productsBatch2 = [
  {
    slug: "harris-cutting-torch-model-85",
    category_slug: "equipment-consumable",
    brand_slug: "harris-product",
    name: { th: "Harris Cutting Torch Model 85", en: "Harris Cutting Torch Model 85" },
    short_description: {
      th: "หัวตัดแก๊สมาตรฐาน สำหรับงานตัดเหล็กความหนาสูงสุด 6 นิ้ว ทนทาน เชื่อถือได้",
      en: "Standard oxy-fuel cutting torch for cutting steel up to 6 inches thick, durable and reliable",
    },
    description: {
      th: "Harris Cutting Torch Model 85 เป็นหัวตัดแก๊สมาตรฐานที่ได้รับความนิยมสูงสุด ออกแบบมาสำหรับงานตัดเหล็กหนาสูงสุด 6 นิ้ว (150 มม.) ด้วยหัวตัดที่ผลิตจากทองเหลืองคุณภาพสูง ให้เปลวไฟที่สม่ำเสมอและแม่นยำ ตัดได้สะอาด ประหยัดแก๊ส\n\nด้ามจับออกแบบตามหลักสรีรศาสตร์ ช่วยลดความเมื่อยล้าในการใช้งานเป็นเวลานาน มีวาล์วควบคุมแก๊สออกซิเจนและเชื้อเพลิงแยกจากกัน ปรับได้แม่นยำ รองรับหัวตัดหลายขนาดตั้งแต่ 000 ถึง 8 สำหรับงานตัดความหนาต่างๆ เหมาะกับการใช้แก๊สอะเซทิลีน โพรเพน หรือ MAPP gas\n\nModel 85 เป็นหัวตัดมาตรฐานที่เหมาะสำหรับอู่ซ่อม โรงงาน และงานก่อสร้าง ทนทาน เชื่อถือได้ อะไหล่หาง่าย และซ่อมบำรุงสะดวก ใช้งานได้ยาวนานหลายปี",
      en: "The Harris Cutting Torch Model 85 is the most popular standard oxy-fuel cutting torch, designed for cutting steel up to 6 inches (150 mm) thick. High-quality brass cutting head delivers consistent and precise flame, clean cuts, and gas savings.\n\nErgonomically designed handle reduces operator fatigue during extended use. Separate oxygen and fuel gas control valves for precise adjustment. Compatible with multiple tip sizes from 000 to 8 for various cutting thicknesses. Works with acetylene, propane, or MAPP gas.\n\nModel 85 is the standard cutting torch ideal for repair shops, factories, and construction sites. Durable, reliable, easy to find spare parts, and simple to maintain. Provides many years of service.",
    },
    images: ["", "", "", "", ""],
    specifications: [
      { label: { th: "ความหนาสูงสุดที่ตัดได้", en: "Maximum Cutting Thickness" }, value: { th: "6 นิ้ว (150 มม.)", en: "6 in. (150 mm)" } },
      { label: { th: "ประเภทเชื้อเพลิง", en: "Fuel Gas Type" }, value: { th: "อะเซทิลีน / โพรเพน / MAPP", en: "Acetylene / Propane / MAPP" } },
      { label: { th: "ขนาดหัวตัดที่รองรับ", en: "Compatible Tip Sizes" }, value: { th: "000, 00, 0, 1, 2, 3, 4, 5, 6, 7, 8", en: "000, 00, 0, 1, 2, 3, 4, 5, 6, 7, 8" } },
      { label: { th: "วัสดุตัวเรือน", en: "Body Material" }, value: { th: "ทองเหลืองชุบ", en: "Plated Brass" } },
      { label: { th: "ความยาวด้ามจับ", en: "Handle Length" }, value: { th: "533 มม. (21 นิ้ว)", en: "533 mm (21 in.)" } },
      { label: { th: "น้ำหนัก", en: "Weight" }, value: { th: "910 กรัม", en: "910 g (2.0 lbs)" } },
    ],
    features: [
      { th: "หัวตัดทองเหลืองคุณภาพสูงให้เปลวไฟสม่ำเสมอ", en: "High-quality brass cutting head for consistent flame" },
      { th: "ด้ามจับออกแบบตามหลักสรีรศาสตร์ ลดความเมื่อยล้า", en: "Ergonomically designed handle reduces fatigue" },
      { th: "รองรับหัวตัดหลายขนาดสำหรับงานตัดที่หลากหลาย", en: "Compatible with multiple tip sizes for versatile cutting" },
      { th: "ทนทาน เชื่อถือได้ อะไหล่หาง่าย", en: "Durable, reliable, easy to find spare parts" },
      { th: "เหมาะกับแก๊สอะเซทิลีน โพรเพน และ MAPP gas", en: "Works with acetylene, propane, and MAPP gas" },
    ],
    documents: [],
    featured: false,
    sort_order: 6,
  },
  {
    slug: "border-mig-wire-er70s-6",
    category_slug: "equipment-consumable",
    brand_slug: "border",
    name: { th: "Border MIG Wire ER70S-6", en: "Border MIG Wire ER70S-6" },
    short_description: {
      th: "ลวดเชื่อม MIG เหล็กกล้าคาร์บอน มาตรฐาน AWS ER70S-6 คุณภาพดี ราคาเหมาะสม จากแบรนด์ไทย",
      en: "Carbon steel MIG wire, AWS ER70S-6 certified, good quality, reasonable price from Thai brand",
    },
    description: {
      th: "Border MIG Wire ER70S-6 เป็นลวดเชื่อม MIG สำหรับเหล็กกล้าคาร์บอนจากแบรนด์ไทย ผลิตตามมาตรฐาน AWS ER70S-6 มีชั้นเคลือบทองแดงช่วยป้อนลวดได้ราบรื่น ลดการอุดตันของหัวทิป ให้แนวเชื่อมที่สวยงามและแข็งแรง กระเด็นน้อย\n\nเหมาะสำหรับงานเชื่อมเหล็กกล้าทั่วไป งานโครงสร้าง และงานผลิตชิ้นส่วน ใช้ได้กับแก๊ส CO2 100% หรือแก๊สผสม Ar/CO2 สามารถเชื่อมได้ทุกตำแหน่ง (All-Position) ทั้งแนวราบ แนวตั้ง และแนวเหนือศีรษะ ให้ผลการเชื่อมที่สม่ำเสมอ\n\nBorder เป็นแบรนด์ไทยที่มีมาตรฐาน ราคาเหมาะสม เป็นทางเลือกที่ดีสำหรับผู้ประกอบการที่ต้องการลวดเชื่อมคุณภาพในราคาที่แข่งขันได้ บรรจุในม้วน 15 กก. สะดวกต่อการใช้งานและจัดเก็บ มีจำหน่ายทั่วประเทศผ่านเครือข่ายตัวแทน",
      en: "Border MIG Wire ER70S-6 is a carbon steel MIG wire from a Thai brand, manufactured to AWS ER70S-6 standard. Copper coating ensures smooth wire feeding and reduced tip clogging, producing beautiful, strong welds with low spatter.\n\nSuitable for general steel welding, structural work, and parts manufacturing. Compatible with 100% CO2 or Ar/CO2 mixed shielding gas. All-position welding capability (flat, vertical, overhead) with consistent results.\n\nBorder is a Thai brand with standards and reasonable prices, a good choice for contractors seeking quality welding wire at competitive prices. Packaged in 15 kg spools for convenient use and storage. Available nationwide through dealer network.",
    },
    images: ["", "", "", "", ""],
    specifications: [
      { label: { th: "มาตรฐาน AWS", en: "AWS Classification" }, value: { th: "ER70S-6", en: "ER70S-6" } },
      { label: { th: "ขนาดลวดที่มี", en: "Available Wire Sizes" }, value: { th: "0.8, 0.9, 1.0, 1.2, 1.6 มม.", en: "0.030, 0.035, 0.040, 0.045, 1/16 in." } },
      { label: { th: "แก๊สปกคลุม", en: "Shielding Gas" }, value: { th: "CO2 100% หรือ Ar/CO2", en: "100% CO2 or Ar/CO2 mix" } },
      { label: { th: "ค่าความต้านทานแรงดึง", en: "Tensile Strength" }, value: { th: "560 MPa (81 ksi)", en: "560 MPa (81 ksi)" } },
      { label: { th: "การเชื่อม", en: "Welding Position" }, value: { th: "ทุกตำแหน่ง (All-Position)", en: "All-Position" } },
      { label: { th: "บรรจุภัณฑ์", en: "Packaging" }, value: { th: "ม้วน 15 กก.", en: "15 kg (33 lb) spool" } },
    ],
    features: [
      { th: "ชั้นเคลือบทองแดงช่วยป้อนลวดราบรื่น", en: "Copper coating ensures smooth wire feeding" },
      { th: "ให้แนวเชื่อมสวยงาม กระเด็นน้อย", en: "Produces beautiful welds with low spatter" },
      { th: "เชื่อมได้ทุกตำแหน่งทั้งแนวราบ ตั้ง เหนือศีรษะ", en: "All-position welding capability" },
      { th: "แบรนด์ไทยคุณภาพดี ราคาเหมาะสม", en: "Thai brand with good quality, reasonable price" },
      { th: "จำหน่ายทั่วประเทศผ่านเครือข่ายตัวแทน", en: "Available nationwide through dealer network" },
    ],
    documents: [],
    featured: false,
    sort_order: 7,
  },
  {
    slug: "atlantic-welding-glove-premium",
    category_slug: "safety-equipment",
    brand_slug: "atlantic",
    name: { th: "Atlantic Welding Glove Premium", en: "Atlantic Welding Glove Premium" },
    short_description: {
      th: "ถุงมือเชื่อมหนังแท้พรีเมียม ทนความร้อนสูง นุ่มสบาย เหมาะสำหรับงานเชื่อม TIG และ MIG",
      en: "Premium genuine leather welding gloves, high heat resistance, comfortable, ideal for TIG and MIG welding",
    },
    description: {
      th: "Atlantic Welding Glove Premium เป็นถุงมือเชื่อมหนังแท้คุณภาพพรีเมียมจากแบรนด์ไทย ผลิตจากหนังแพะแท้คัดเกรด A เนื้อนุ่ม ยืดหยุ่น ให้ความคล่องตัวในการหยิบจับอุปกรณ์ ทนความร้อนและสะเก็ดไฟได้เป็นอย่างดี เหมาะสำหรับงานเชื่อม TIG และ MIG ที่ต้องการความละเอียดในการทำงาน\n\nซับในผ้าฝ้ายนุ่ม ระบายอากาศได้ดี สวมใส่สบายแม้ใช้งานเป็นเวลานาน ตะเข็บเย็บด้วยด้าย Kevlar ทนทานพิเศษ ไม่ขาดง่ายแม้ใช้งานหนัก ข้อมือยาว 14 นิ้ว ปกป้องแขนจากสะเก็ดไฟและความร้อน มีสายรัดข้อมือปรับขนาดได้ กระชับพอดีมือ\n\nAtlantic Welding Glove Premium เป็นทางเลือกที่ดีเยี่ยมสำหรับช่างเชื่อมมืออาชีพที่ต้องการถุงมือคุณภาพสูง นุ่ม คล่องตัว และทนทาน ในราคาที่เหมาะสมกว่าแบรนด์นำเข้า ผลิตภัณฑ์จากแบรนด์ไทยที่ได้รับความไว้วางใจมากว่า 30 ปี",
      en: "Atlantic Welding Glove Premium is a premium genuine leather welding glove from a Thai brand. Made from Grade A goatskin leather, soft texture, flexible, providing dexterity for handling equipment. Excellent heat and spatter resistance, ideal for TIG and MIG welding requiring precision work.\n\nSoft cotton lining with good ventilation, comfortable even during extended use. Kevlar-stitched seams for exceptional durability, resistant to tearing even under heavy use. 14-inch cuff protects arms from spatter and heat. Adjustable wrist strap for secure, snug fit.\n\nAtlantic Welding Glove Premium is an excellent choice for professional welders seeking high-quality gloves that are soft, dexterous, and durable at more reasonable prices than imported brands. Products from a Thai brand trusted for over 30 years.",
    },
    images: ["", "", "", "", ""],
    specifications: [
      { label: { th: "วัสดุ", en: "Material" }, value: { th: "หนังแพะแท้เกรด A", en: "Grade A Genuine Goatskin" } },
      { label: { th: "ซับใน", en: "Lining" }, value: { th: "ผ้าฝ้าย", en: "Cotton" } },
      { label: { th: "ด้ายเย็บ", en: "Stitching" }, value: { th: "ด้าย Kevlar", en: "Kevlar Thread" } },
      { label: { th: "ความยาวข้อมือ", en: "Cuff Length" }, value: { th: "14 นิ้ว (36 ซม.)", en: "14 in. (36 cm)" } },
      { label: { th: "ขนาดที่มี", en: "Available Sizes" }, value: { th: "S, M, L, XL, XXL", en: "S, M, L, XL, XXL" } },
      { label: { th: "มาตรฐาน", en: "Standards" }, value: { th: "EN 12477 Type A", en: "EN 12477 Type A" } },
    ],
    features: [
      { th: "หนังแพะแท้เกรด A นุ่ม ยืดหยุ่น คล่องตัว", en: "Grade A goatskin leather, soft, flexible, dexterous" },
      { th: "ทนความร้อนและสะเก็ดไฟ เหมาะสำหรับงาน TIG และ MIG", en: "Heat and spatter resistant, ideal for TIG and MIG welding" },
      { th: "ตะเข็บเย็บด้วยด้าย Kevlar ทนทานยาวนาน", en: "Kevlar-stitched seams for long-lasting durability" },
      { th: "ซับในผ้าฝ้ายนุ่มสบาย ระบายอากาศดี", en: "Soft cotton lining with good ventilation" },
      { th: "ข้อมือยาว 14 นิ้ว ปกป้องแขนจากสะเก็ดไฟ", en: "14-inch cuff protects arms from spatter" },
      { th: "แบรนด์ไทยคุณภาพสูง ราคาเหมาะสม", en: "High-quality Thai brand, reasonable price" },
    ],
    documents: [],
    featured: true,
    sort_order: 8,
  },
  {
    slug: "lincoln-viking-3350-helmet",
    category_slug: "safety-equipment",
    brand_slug: "lincoln-electric",
    name: { th: "Lincoln VIKING 3350 Helmet", en: "Lincoln VIKING 3350 Helmet" },
    short_description: {
      th: "หน้ากากเชื่อมออโต้ระดับพรีเมียม พร้อมเลนส์ 4C Technology ขนาดใหญ่ ให้สีจริงและมุมมองกว้าง",
      en: "Premium auto-darkening welding helmet with large 4C Technology lens, true color and wide viewing area",
    },
    description: {
      th: "Lincoln VIKING 3350 เป็นหน้ากากเชื่อมออโต้ระดับพรีเมียมที่ได้รับความนิยมสูงสุด พร้อมเลนส์ 4C Technology ขนาดใหญ่ 12.5 ตารางนิ้ว ให้มุมมองที่กว้างและสีที่เป็นธรรมชาติทั้งก่อน ระหว่าง และหลังการเชื่อม เฉดความเข้มปรับได้ตั้งแต่ 5-13 พร้อมโหมดตัดและโหมดเจียร ออกแบบมาเพื่อลดความเมื่อยล้าของดวงตาและเพิ่มคุณภาพงานเชื่อม\n\nเลนส์ 4C ให้การมองเห็นสีที่แท้จริงกว่าเลนส์ทั่วไปถึง 4 เท่า ช่วยให้ช่างเชื่อมมองเห็นรายละเอียดของบ่อเชื่อมได้ชัดเจนยิ่งขึ้น ควบคุมคุณภาพงานเชื่อมได้ดีขึ้น เซนเซอร์ 4 ตัวทำงานอย่างรวดเร็ว 1/20,000 วินาที ป้องกันดวงตาได้อย่างมีประสิทธิภาพ\n\nVIKING 3350 มาพร้อมสายรัดศีรษะปรับได้ 5 จุด ให้ความสบายในการสวมใส่ตลอดทั้งวัน น้ำหนักเบา สมดุลดี ไม่ทำให้คอเมื่อย เหมาะสำหรับช่างเชื่อมมืออาชีพที่ต้องการประสิทธิภาพและความสบายสูงสุด",
      en: "The Lincoln VIKING 3350 is the most popular premium auto-darkening welding helmet featuring 4C Technology lens with large 12.5 sq. in. viewing area that provides wide visibility and natural color clarity before, during, and after welding. Adjustable shade from 5-13 with cut and grind modes. Designed to reduce eye strain and improve weld quality.\n\n4C lens provides 4 times better true color viewing than standard lenses, helping welders see weld pool details more clearly and control weld quality better. Four sensors respond in 1/20,000 sec for effective eye protection.\n\nVIKING 3350 features 5-point adjustable headband for all-day comfort. Lightweight and well-balanced, won't cause neck fatigue. Ideal for professional welders seeking maximum performance and comfort.",
    },
    images: ["", "", "", "", ""],
    specifications: [
      { label: { th: "พื้นที่มองเห็น", en: "Viewing Area" }, value: { th: "12.5 ตร.นิ้ว", en: "12.5 sq. in." } },
      { label: { th: "เทคโนโลยีเลนส์", en: "Lens Technology" }, value: { th: "4C Technology", en: "4C Technology" } },
      { label: { th: "เฉดความเข้ม", en: "Shade Range" }, value: { th: "5-13", en: "5-13" } },
      { label: { th: "เซนเซอร์", en: "Sensors" }, value: { th: "4 เซนเซอร์", en: "4 Sensors" } },
      { label: { th: "ความเร็วสวิตช์", en: "Switching Speed" }, value: { th: "1/20,000 วินาที", en: "1/20,000 sec" } },
      { label: { th: "มาตรฐาน", en: "Standards" }, value: { th: "ANSI Z87.1, CSA Z94.3", en: "ANSI Z87.1, CSA Z94.3" } },
      { label: { th: "น้ำหนัก", en: "Weight" }, value: { th: "510 กรัม", en: "510 g (18 oz)" } },
    ],
    features: [
      { th: "เทคโนโลยี 4C Lens ให้ภาพสีจริงชัดเจนทุกสภาวะ", en: "4C Lens Technology provides true-color clarity in all conditions" },
      { th: "เลนส์ขนาดใหญ่ 12.5 ตร.นิ้ว ให้มุมมองกว้าง", en: "Large 12.5 sq. in. viewing area for wide visibility" },
      { th: "เซนเซอร์ 4 ตัวตอบสนอง 1/20,000 วินาที", en: "Four sensors respond in 1/20,000 sec" },
      { th: "มีโหมดตัดและโหมดเจียรในตัว", en: "Built-in cut mode and grind mode" },
      { th: "สายรัดศีรษะปรับได้ 5 จุด สบายตลอดวัน", en: "5-point adjustable headband for all-day comfort" },
      { th: "น้ำหนักเบา สมดุลดี ไม่ทำให้คอเมื่อย", en: "Lightweight and well-balanced, no neck fatigue" },
    ],
    documents: [],
    featured: false,
    sort_order: 9,
  },
  {
    slug: "cea-plasma-cutter-cp40",
    category_slug: "machine",
    brand_slug: "cea",
    name: { th: "CEA Plasma Cutter CP40", en: "CEA Plasma Cutter CP40" },
    short_description: {
      th: "เครื่องตัดพลาสม่าอินเวอร์เตอร์ 40 แอมป์ จากอิตาลี น้ำหนักเบา พกพาสะดวก เหมาะสำหรับงานซ่อมและงานช่าง",
      en: "40-amp inverter plasma cutter from Italy, lightweight, portable, ideal for repair and maintenance work",
    },
    description: {
      th: "CEA Plasma Cutter CP40 เป็นเครื่องตัดพลาสม่าระบบอินเวอร์เตอร์ขนาดกะทัดรัดจากอิตาลี กำลังไฟ 40 แอมป์ สามารถตัดเหล็กได้หนาถึง 12 มม. ให้ความเร็วสูงและขอบตัดที่สะอาดแม่นยำ น้ำหนักเบาเพียง 8 กก. พกพาสะดวก เหมาะสำหรับงานซ่อมบำรุง งานช่าง และงาน On-Site\n\nออกแบบมาเพื่อใช้งานง่าย มีปุ่มปรับกระแสเดียว ตั้งค่าได้เร็ว เริ่มต้นใช้งานได้ทันที ตัดได้ทั้งเหล็กกล้า สแตนเลส อลูมิเนียม และโลหะนำไฟฟ้าอื่นๆ ระบบ Pilot Arc ช่วยให้จุดอาร์คได้ง่ายโดยไม่ต้องสัมผัสชิ้นงาน เหมาะสำหรับตัดตะแกรงเหล็กและพื้นผิวที่มีสนิม\n\nCEA CP40 มาพร้อมสายไฟ หัวตัดพลาสม่า และอุปกรณ์ครบชุดพร้อมใช้งาน เหมาะสำหรับช่างซ่อม ช่างติดตั้ง และ DIY enthusiasts ที่ต้องการเครื่องตัดพลาสม่าคุณภาพดี พกพาสะดวก ในราคาที่เหมาะสม",
      en: "The CEA Plasma Cutter CP40 is a compact inverter plasma cutter from Italy with 40-amp capacity, capable of cutting steel up to 12 mm thick with high speed and clean, precise edges. Lightweight at only 8 kg, portable, ideal for repair and maintenance work, workshops, and on-site jobs.\n\nDesigned for ease of use with single current adjustment knob, quick setup, ready to use immediately. Cuts steel, stainless steel, aluminum, and other conductive metals. Pilot Arc system allows easy arc starting without touching the workpiece, suitable for cutting mesh and rusty surfaces.\n\nCEA CP40 comes complete with power cable, plasma cutting torch, and all accessories ready to use. Ideal for repair technicians, installers, and DIY enthusiasts seeking quality portable plasma cutters at reasonable prices.",
    },
    images: ["", "", "", "", ""],
    specifications: [
      { label: { th: "แรงดันไฟฟ้าขาเข้า", en: "Input Voltage" }, value: { th: "230V, 1 เฟส", en: "230V, Single Phase" } },
      { label: { th: "กระแสตัดสูงสุด", en: "Maximum Cutting Current" }, value: { th: "40 แอมป์", en: "40 Amps" } },
      { label: { th: "ความหนาตัดได้", en: "Cutting Thickness" }, value: { th: "สูงสุด 12 มม.", en: "Up to 12 mm (1/2 in.)" } },
      { label: { th: "ความหนาตัดแยกสูงสุด", en: "Maximum Severance Thickness" }, value: { th: "16 มม.", en: "16 mm (5/8 in.)" } },
      { label: { th: "ดิวตี้ไซเคิล", en: "Duty Cycle" }, value: { th: "35% ที่ 40A", en: "35% at 40A" } },
      { label: { th: "ระบบจุดอาร์ค", en: "Arc Starting" }, value: { th: "Pilot Arc", en: "Pilot Arc" } },
      { label: { th: "น้ำหนัก", en: "Weight" }, value: { th: "8 กก.", en: "8 kg (17.6 lbs)" } },
    ],
    features: [
      { th: "ระบบอินเวอร์เตอร์น้ำหนักเบาเพียง 8 กก. พกพาสะดวก", en: "Lightweight inverter system at only 8 kg, highly portable" },
      { th: "ระบบ Pilot Arc จุดอาร์คง่ายโดยไม่ต้องสัมผัสชิ้นงาน", en: "Pilot Arc system for easy, non-contact arc starting" },
      { th: "ตัดโลหะนำไฟฟ้าได้ทุกชนิด เหล็ก สแตนเลส อลูมิเนียม", en: "Cuts all conductive metals: steel, stainless, aluminum" },
      { th: "ปุ่มปรับกระแสเดียว ใช้งานง่าย ตั้งค่าเร็ว", en: "Single current adjustment knob, easy to use, quick setup" },
      { th: "มาพร้อมอุปกรณ์ครบชุดพร้อมใช้งาน", en: "Comes complete with all accessories ready to use" },
    ],
    documents: [],
    featured: false,
    sort_order: 10,
  },
];

// ============================================================
// MAIN SCRIPT
// ============================================================

async function resetCatalogData() {
  console.log("=".repeat(60));
  console.log("LAEMTHONG WEBSITE - Catalog Data Reset");
  console.log("=".repeat(60));

  try {
    // Phase 1: Storage cleanup
    console.log("\nStorage cleanup...");
    for (const folder of ["products", "brands", "categories"]) {
      const { data: items } = await supabase.storage.from("images").list(folder);
      if (items && items.length > 0) {
        for (const item of items) {
          const subPath = `${folder}/${item.name}`;
          const { data: subFiles } = await supabase.storage.from("images").list(subPath);
          if (subFiles && subFiles.length > 0) {
            const paths = subFiles.map((f) => `${subPath}/${f.name}`);
            await supabase.storage.from("images").remove(paths);
          }
        }
      }
      console.log(`  Cleaned ${folder}/ folder`);
    }

    // Phase 2: Database cleanup (FK order: products -> categories -> brands)
    console.log("\nDatabase cleanup...");
    const { error: delProducts } = await supabase.from("products").delete().neq("slug", "");
    if (delProducts) throw new Error(`Delete products failed: ${delProducts.message}`);
    console.log("  Deleted all products");

    const { error: delCategories } = await supabase.from("categories").delete().neq("slug", "");
    if (delCategories) throw new Error(`Delete categories failed: ${delCategories.message}`);
    console.log("  Deleted all categories");

    const { error: delBrands } = await supabase.from("brands").delete().neq("slug", "");
    if (delBrands) throw new Error(`Delete brands failed: ${delBrands.message}`);
    console.log("  Deleted all brands");

    // Phase 3: Verify cleanup
    const { count: pCount } = await supabase.from("products").select("*", { count: "exact", head: true });
    const { count: cCount } = await supabase.from("categories").select("*", { count: "exact", head: true });
    const { count: bCount } = await supabase.from("brands").select("*", { count: "exact", head: true });
    console.log(`  Verified: ${pCount ?? 0} products, ${cCount ?? 0} categories, ${bCount ?? 0} brands`);

    if ((pCount ?? 0) > 0 || (cCount ?? 0) > 0 || (bCount ?? 0) > 0) {
      throw new Error("Cleanup verification failed - tables not empty");
    }

    // Phase 4: Insert categories
    console.log("\nInserting categories (4)...");
    const { error: catErr } = await supabase.from("categories").insert(categories);
    if (catErr) throw new Error(`Insert categories failed: ${catErr.message}`);
    console.log("  Categories inserted");

    // Phase 5: Insert brands
    console.log("\nInserting brands (6)...");
    const { error: brandErr } = await supabase.from("brands").insert(brands);
    if (brandErr) throw new Error(`Insert brands failed: ${brandErr.message}`);
    console.log("  Brands inserted");

    // Phase 6: Insert products (2 batches)
    console.log("\nInserting products batch 1 (5)...");
    const { error: prod1Err } = await supabase.from("products").insert(productsBatch1);
    if (prod1Err) throw new Error(`Insert products batch 1 failed: ${prod1Err.message}`);
    console.log("  Batch 1 inserted");

    console.log("\nInserting products batch 2 (5)...");
    const { error: prod2Err } = await supabase.from("products").insert(productsBatch2);
    if (prod2Err) throw new Error(`Insert products batch 2 failed: ${prod2Err.message}`);
    console.log("  Batch 2 inserted");

    // Phase 7: Verification
    console.log("\nVerification...");
    const { count: finalP } = await supabase.from("products").select("*", { count: "exact", head: true });
    const { count: finalC } = await supabase.from("categories").select("*", { count: "exact", head: true });
    const { count: finalB } = await supabase.from("brands").select("*", { count: "exact", head: true });
    const { count: featuredCount } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("featured", true);

    console.log(`  Products: ${finalP}, Categories: ${finalC}, Brands: ${finalB}`);
    console.log(`  Featured: ${featuredCount}`);

    if (finalP !== 10 || finalC !== 4 || finalB !== 6 || featuredCount !== 4) {
      throw new Error("Verification failed - unexpected counts");
    }

    console.log("\n" + "=".repeat(60));
    console.log("SUCCESS: Catalog data reset complete!");
    console.log("=".repeat(60));
  } catch (error) {
    console.error("\nFAILED:", error);
    process.exit(1);
  }
}

resetCatalogData();

-- Laemthong Website: Seed Data

-- ========================================
-- Categories (6)
-- ========================================
insert into categories (slug, name, description, image, icon, sort_order) values
('welding-machines', '{"th":"เครื่องเชื่อม","en":"Welding Machines"}', '{"th":"เครื่องเชื่อมคุณภาพสูงจากแบรนด์ชั้นนำระดับโลก ครอบคลุมทุกกระบวนการเชื่อม ทั้ง MIG, MAG, TIG และ Stick สำหรับงานอุตสาหกรรมหนักไปจนถึงงานซ่อมบำรุงทั่วไป พร้อมเทคโนโลยีล่าสุดที่ช่วยเพิ่มประสิทธิภาพการทำงาน","en":"High-quality welding machines from world-leading brands, covering all welding processes including MIG, MAG, TIG, and Stick. Suitable for heavy industrial applications through to general maintenance work, equipped with the latest technology to enhance productivity."}', '/images/products/welding-machines/category.jpg', 'Zap', 1),
('cutting-equipment', '{"th":"อุปกรณ์ตัด","en":"Cutting Equipment"}', '{"th":"อุปกรณ์ตัดโลหะครบวงจร ตั้งแต่ชุดตัดแก๊สไปจนถึงเครื่องตัดพลาสม่า ออกแบบมาเพื่อความแม่นยำและประสิทธิภาพสูงสุด เหมาะสำหรับงานตัดโลหะทุกประเภทในอุตสาหกรรมการผลิตและงานก่อสร้าง","en":"Comprehensive metal cutting equipment, from gas cutting torches to plasma cutters. Designed for maximum precision and efficiency, suitable for all types of metal cutting in manufacturing and construction industries."}', '/images/products/cutting-equipment/category.jpg', 'Scissors', 2),
('welding-accessories', '{"th":"อุปกรณ์เสริมงานเชื่อม","en":"Welding Accessories"}', '{"th":"อุปกรณ์เสริมสำหรับงานเชื่อมที่ครบครัน ทั้งหน้ากากเชื่อม, หัวเชื่อม, สายเชื่อม และอุปกรณ์อื่นๆ ที่จำเป็นสำหรับการทำงานเชื่อมอย่างมีประสิทธิภาพและปลอดภัย คัดสรรจากแบรนด์คุณภาพที่ได้มาตรฐานสากล","en":"A complete range of welding accessories including welding helmets, torches, cables, and other essential equipment for efficient and safe welding operations. Carefully selected from quality brands that meet international standards."}', '/images/products/welding-accessories/category.jpg', 'Settings', 3),
('welding-wire-rods', '{"th":"ลวดเชื่อมและลวดเชื่อม","en":"Welding Wires & Rods"}', '{"th":"ลวดเชื่อมและลวดเชื่อมคุณภาพสูงสำหรับกระบวนการเชื่อมทุกประเภท ทั้ง MIG wire, TIG rod และ Stick electrode ผลิตจากวัสดุคุณภาพเยี่ยม ให้แนวเชื่อมที่สวยงาม แข็งแรง และเป็นไปตามมาตรฐาน AWS","en":"High-quality welding wires and rods for all welding processes, including MIG wire, TIG rod, and Stick electrodes. Manufactured from premium materials for beautiful, strong welds that meet AWS standards."}', '/images/products/welding-wire-rods/category.jpg', 'Cable', 4),
('gas-regulators', '{"th":"เกจ์ควบคุมแก๊ส","en":"Gas Regulators"}', '{"th":"เกจ์ควบคุมแก๊สคุณภาพสูงสำหรับงานเชื่อมและตัด รองรับแก๊สทุกประเภท ทั้งอาร์กอน, CO2, ออกซิเจน และแก๊สผสม ออกแบบมาเพื่อความปลอดภัยสูงสุดและการควบคุมอัตราการไหลที่แม่นยำ","en":"High-quality gas regulators for welding and cutting operations, supporting all gas types including Argon, CO2, Oxygen, and mixed gases. Designed for maximum safety and precise flow rate control."}', '/images/products/gas-regulators/category.jpg', 'Gauge', 5),
('safety-equipment', '{"th":"อุปกรณ์ความปลอดภัย","en":"Safety Equipment"}', '{"th":"อุปกรณ์ความปลอดภัยสำหรับงานเชื่อมและตัดครบวงจร ทั้งหน้ากากเชื่อมออโต้, ถุงมือหนัง, ชุดป้องกัน และอุปกรณ์ป้องกันอื่นๆ ได้มาตรฐานความปลอดภัยสากล เพื่อปกป้องช่างเชื่อมจากอันตรายทุกรูปแบบ","en":"Comprehensive safety equipment for welding and cutting operations, including auto-darkening helmets, leather gloves, protective clothing, and other protective gear. Meets international safety standards to protect welders from all types of hazards."}', '/images/products/safety-equipment/category.jpg', 'Shield', 6);

-- ========================================
-- Brands (3)
-- ========================================
insert into brands (slug, name, logo, description, website, country, sort_order) values
('lincoln-electric', 'Lincoln Electric', '/images/brands/lincoln-electric.svg', '{"th":"Lincoln Electric เป็นผู้นำระดับโลกด้านการออกแบบและผลิตเครื่องเชื่อม ระบบตัดอัตโนมัติ และลวดเชื่อม ก่อตั้งในปี ค.ศ. 1895 ที่เมืองคลีฟแลนด์ รัฐโอไฮโอ สหรัฐอเมริกา ด้วยนวัตกรรมและเทคโนโลยีชั้นนำ Lincoln Electric ให้บริการลูกค้าในกว่า 160 ประเทศทั่วโลก","en":"Lincoln Electric is a global leader in the design and manufacturing of welding machines, automated cutting systems, and welding consumables. Founded in 1895 in Cleveland, Ohio, USA, Lincoln Electric serves customers in over 160 countries worldwide with cutting-edge innovation and technology."}', 'https://www.lincolnelectric.com', 'USA', 1),
('harris', 'Harris Product Group', '/images/brands/harris.svg', '{"th":"Harris Product Group เป็นผู้ผลิตชั้นนำด้านอุปกรณ์เชื่อมและตัดด้วยแก๊ส เกจ์ควบคุมแก๊ส และโลหะบัดกรี ก่อตั้งในสหรัฐอเมริกา มีชื่อเสียงด้านคุณภาพและความน่าเชื่อถือของผลิตภัณฑ์ เป็นที่ไว้วางใจของช่างเชื่อมมืออาชีพทั่วโลก","en":"Harris Product Group is a leading manufacturer of gas welding and cutting equipment, gas regulators, and brazing alloys. Founded in the USA, Harris is renowned for the quality and reliability of its products and is trusted by professional welders worldwide."}', 'https://www.harrisproductsgroup.com', 'USA', 2),
('cea', 'CEA', '/images/brands/cea.svg', '{"th":"CEA เป็นผู้ผลิตเครื่องเชื่อมชั้นนำจากประเทศอิตาลี มีประสบการณ์กว่า 50 ปีในการพัฒนาและผลิตเครื่องเชื่อม MIG/MAG, TIG และ MMA ที่มีคุณภาพสูง โดดเด่นด้านเทคโนโลยีอินเวอร์เตอร์และระบบควบคุมดิจิทัลที่ทันสมัย","en":"CEA is a leading welding machine manufacturer from Italy with over 50 years of experience in developing and producing high-quality MIG/MAG, TIG, and MMA welding machines. Distinguished for its advanced inverter technology and modern digital control systems."}', 'https://www.ceaweld.com', 'Italy', 3);

-- ========================================
-- Products (12)
-- ========================================
insert into products (slug, category_slug, brand_slug, name, short_description, description, images, specifications, features, documents, featured, sort_order) values
('lincoln-power-mig-260', 'welding-machines', 'lincoln-electric',
 '{"th":"Lincoln Power MIG 260","en":"Lincoln Power MIG 260"}',
 '{"th":"เครื่องเชื่อม MIG อเนกประสงค์ 260 แอมป์ เหมาะสำหรับงานอุตสาหกรรมและงานซ่อมบำรุง","en":"Versatile 260-amp MIG welder ideal for industrial fabrication and maintenance work."}',
 '{"th":"Lincoln Power MIG 260 เป็นเครื่องเชื่อม MIG อเนกประสงค์ระดับมืออาชีพ ให้กำลังไฟสูงถึง 260 แอมป์ เหมาะสำหรับงานเชื่อมเหล็ก สแตนเลส และอลูมิเนียม ด้วยเทคโนโลยี Diamond Core Technology ให้แนวเชื่อมที่สวยงามและมีคุณภาพสูง พร้อมจอแสดงผลดิจิทัลที่ง่ายต่อการตั้งค่า และระบบป้อนลวดที่เสถียรทุกสภาวะการทำงาน เหมาะทั้งงานโรงงานอุตสาหกรรมและงานซ่อมบำรุงทั่วไป","en":"The Lincoln Power MIG 260 is a professional-grade, versatile MIG welder delivering up to 260 amps. Suitable for welding steel, stainless steel, and aluminum. Featuring Diamond Core Technology for beautiful, high-quality welds, a digital display for easy setup, and a stable wire feed system under all operating conditions. Ideal for both industrial fabrication and general maintenance work."}',
 '["/images/products/welding-machines/lincoln-power-mig-260.jpg"]',
 '[{"label":{"th":"แรงดันไฟฟ้าขาเข้า","en":"Input Voltage"},"value":{"th":"208/230V, 1 เฟส","en":"208/230V, Single Phase"}},{"label":{"th":"กระแสเชื่อม","en":"Welding Current Range"},"value":{"th":"30-260 แอมป์","en":"30-260 Amps"}},{"label":{"th":"ดิวตี้ไซเคิล","en":"Duty Cycle"},"value":{"th":"40% ที่ 260A","en":"40% at 260A"}},{"label":{"th":"ขนาดลวดเชื่อม","en":"Wire Size Range"},"value":{"th":"0.6-1.2 มม.","en":"0.023-0.045 in."}},{"label":{"th":"น้ำหนัก","en":"Weight"},"value":{"th":"52 กก.","en":"52 kg (115 lbs)"}}]',
 '[{"th":"เทคโนโลยี Diamond Core Technology ให้ประสิทธิภาพการเชื่อมสูงสุด","en":"Diamond Core Technology for maximum welding performance"},{"th":"จอแสดงผลดิจิทัลแสดงค่าแรงดันและความเร็วลวดเชื่อม","en":"Digital display showing voltage and wire feed speed"},{"th":"รองรับการเชื่อม MIG, Flux-Cored และ Stick ในเครื่องเดียว","en":"Supports MIG, Flux-Cored, and Stick welding in one machine"}]',
 '[]', true, 1),

('cea-maxi-405', 'welding-machines', 'cea',
 '{"th":"CEA Maxi 405","en":"CEA Maxi 405"}',
 '{"th":"เครื่องเชื่อม MIG/MAG อินเวอร์เตอร์ 400 แอมป์ สำหรับงานอุตสาหกรรมหนัก","en":"400-amp inverter MIG/MAG welder designed for heavy industrial applications."}',
 '{"th":"CEA Maxi 405 เป็นเครื่องเชื่อม MIG/MAG ระบบอินเวอร์เตอร์กำลังสูง 400 แอมป์ จากอิตาลี ออกแบบมาสำหรับงานอุตสาหกรรมหนัก เช่น งานต่อเรือ งานโครงสร้างเหล็ก และงานท่อ ด้วยเทคโนโลยีอินเวอร์เตอร์ล่าสุดทำให้เครื่องมีน้ำหนักเบา ประหยัดพลังงาน และให้แนวเชื่อมที่สวยงามมีคุณภาพ พร้อมระบบ Synergic ที่ปรับค่าพารามิเตอร์อัตโนมัติตามลวดเชื่อมและแก๊สที่ใช้","en":"The CEA Maxi 405 is a high-power 400-amp inverter MIG/MAG welder from Italy, designed for heavy industrial applications such as shipbuilding, steel structures, and piping. Featuring the latest inverter technology for lightweight design, energy savings, and high-quality welds. The Synergic system automatically adjusts parameters based on the wire and gas being used."}',
 '["/images/products/welding-machines/cea-maxi-405.jpg"]',
 '[{"label":{"th":"แรงดันไฟฟ้าขาเข้า","en":"Input Voltage"},"value":{"th":"380/400V, 3 เฟส","en":"380/400V, Three Phase"}},{"label":{"th":"กระแสเชื่อม","en":"Welding Current Range"},"value":{"th":"30-400 แอมป์","en":"30-400 Amps"}},{"label":{"th":"ดิวตี้ไซเคิล","en":"Duty Cycle"},"value":{"th":"60% ที่ 400A","en":"60% at 400A"}},{"label":{"th":"ขนาดลวดเชื่อม","en":"Wire Size Range"},"value":{"th":"0.8-1.6 มม.","en":"0.8-1.6 mm"}},{"label":{"th":"กระบวนการเชื่อม","en":"Welding Processes"},"value":{"th":"MIG/MAG, Flux-Cored","en":"MIG/MAG, Flux-Cored"}},{"label":{"th":"น้ำหนัก","en":"Weight"},"value":{"th":"38 กก.","en":"38 kg (84 lbs)"}}]',
 '[{"th":"ระบบ Synergic ปรับค่าพารามิเตอร์อัตโนมัติ","en":"Synergic system with automatic parameter adjustment"},{"th":"เทคโนโลยีอินเวอร์เตอร์ช่วยประหยัดพลังงานและลดน้ำหนัก","en":"Inverter technology for energy savings and reduced weight"},{"th":"จอแสดงผล LCD แสดงค่าพารามิเตอร์ครบถ้วน","en":"LCD display showing complete parameter information"},{"th":"ระบบระบายความร้อนอัจฉริยะยืดอายุการใช้งาน","en":"Intelligent cooling system for extended service life"}]',
 '[]', true, 2),

('harris-cutting-torch-62-5', 'cutting-equipment', 'harris',
 '{"th":"Harris Cutting Torch 62-5","en":"Harris Cutting Torch 62-5"}',
 '{"th":"ชุดตัดแก๊สรุ่น 62-5 สำหรับงานตัดเหล็กความหนาสูงสุด 5 นิ้ว","en":"Heavy-duty oxy-fuel cutting torch for cutting steel up to 5 inches thick."}',
 '{"th":"Harris Cutting Torch 62-5 เป็นชุดตัดแก๊สระดับมืออาชีพ ออกแบบมาสำหรับงานตัดเหล็กหนาสูงสุด 5 นิ้ว ด้วยหัวตัดที่ผลิตจากทองเหลืองคุณภาพสูง ให้เปลวไฟที่สม่ำเสมอและแม่นยำ ด้ามจับออกแบบตามหลักสรีรศาสตร์ ช่วยลดความเมื่อยล้าในการใช้งานเป็นเวลานาน เหมาะสำหรับงานอู่ต่อเรือ งานโครงสร้างเหล็ก และงานรื้อถอน","en":"The Harris Cutting Torch 62-5 is a professional-grade oxy-fuel cutting torch designed for cutting steel up to 5 inches thick. With a high-quality brass cutting head that delivers consistent and precise flames, and an ergonomically designed handle to reduce fatigue during extended use. Ideal for shipyard work, steel fabrication, and demolition applications."}',
 '["/images/products/cutting-equipment/harris-cutting-torch-62-5.jpg"]',
 '[{"label":{"th":"ความหนาสูงสุดที่ตัดได้","en":"Maximum Cutting Thickness"},"value":{"th":"5 นิ้ว (127 มม.)","en":"5 in. (127 mm)"}},{"label":{"th":"ประเภทเชื้อเพลิง","en":"Fuel Gas Type"},"value":{"th":"อะเซทิลีน / โพรเพน","en":"Acetylene / Propane"}},{"label":{"th":"วัสดุตัวเรือน","en":"Body Material"},"value":{"th":"ทองเหลืองชุบ","en":"Plated Brass"}},{"label":{"th":"ความยาวด้ามจับ","en":"Handle Length"},"value":{"th":"533 มม.","en":"21 in. (533 mm)"}},{"label":{"th":"น้ำหนัก","en":"Weight"},"value":{"th":"0.91 กก.","en":"0.91 kg (2.0 lbs)"}}]',
 '[{"th":"หัวตัดทองเหลืองคุณภาพสูงให้เปลวไฟสม่ำเสมอ","en":"High-quality brass cutting head for consistent flame output"},{"th":"ด้ามจับออกแบบตามหลักสรีรศาสตร์ ลดความเมื่อยล้า","en":"Ergonomically designed handle reduces operator fatigue"},{"th":"รองรับหัวตัดหลายขนาดสำหรับงานตัดที่หลากหลาย","en":"Compatible with multiple tip sizes for versatile cutting applications"}]',
 '[]', true, 3),

('lincoln-tomahawk-1500', 'cutting-equipment', 'lincoln-electric',
 '{"th":"Lincoln Tomahawk 1500","en":"Lincoln Tomahawk 1500"}',
 '{"th":"เครื่องตัดพลาสม่า 100 แอมป์ ตัดเหล็กได้หนาถึง 38 มม.","en":"100-amp plasma cutter capable of cutting steel up to 1.5 inches thick."}',
 '{"th":"Lincoln Tomahawk 1500 เป็นเครื่องตัดพลาสม่าระดับมืออาชีพ ให้กำลังไฟ 100 แอมป์ สามารถตัดเหล็กได้หนาถึง 38 มม. ด้วยความเร็วสูง ให้ขอบตัดที่สะอาดและแม่นยำ เหมาะสำหรับงานตัดเหล็กกล้า สแตนเลส อลูมิเนียม และโลหะนำไฟฟ้าอื่นๆ ระบบจุดอาร์ค Pilot Arc ช่วยให้เริ่มตัดได้ง่ายโดยไม่ต้องสัมผัสชิ้นงาน","en":"The Lincoln Tomahawk 1500 is a professional-grade plasma cutter delivering 100 amps, capable of cutting steel up to 1.5 inches (38 mm) thick at high speed with clean, precise edges. Suitable for cutting mild steel, stainless steel, aluminum, and other conductive metals. The Pilot Arc system allows easy arc starting without touching the workpiece."}',
 '["/images/products/cutting-equipment/lincoln-tomahawk-1500.jpg"]',
 '[{"label":{"th":"แรงดันไฟฟ้าขาเข้า","en":"Input Voltage"},"value":{"th":"400V, 3 เฟส","en":"400V, Three Phase"}},{"label":{"th":"กระแสตัดสูงสุด","en":"Maximum Cutting Current"},"value":{"th":"100 แอมป์","en":"100 Amps"}},{"label":{"th":"ความหนาตัดได้สูงสุด","en":"Maximum Cut Thickness"},"value":{"th":"38 มม.","en":"1.5 in. (38 mm)"}},{"label":{"th":"ความหนาตัดแยกสูงสุด","en":"Maximum Severance Thickness"},"value":{"th":"50 มม.","en":"2.0 in. (50 mm)"}},{"label":{"th":"ดิวตี้ไซเคิล","en":"Duty Cycle"},"value":{"th":"50% ที่ 100A","en":"50% at 100A"}},{"label":{"th":"น้ำหนัก","en":"Weight"},"value":{"th":"46 กก.","en":"46 kg (102 lbs)"}}]',
 '[{"th":"ระบบ Pilot Arc จุดอาร์คง่ายโดยไม่ต้องสัมผัสชิ้นงาน","en":"Pilot Arc system for easy, non-contact arc starting"},{"th":"ตัดโลหะนำไฟฟ้าได้ทุกชนิด ทั้งเหล็ก สแตนเลส อลูมิเนียม","en":"Cuts all conductive metals including steel, stainless, and aluminum"},{"th":"ขอบตัดสะอาด แม่นยำ ลดงานแต่งชิ้นงานหลังตัด","en":"Clean, precise cut edges reduce post-cut finishing work"},{"th":"โครงสร้างทนทานเหมาะกับสภาพแวดล้อมงานอุตสาหกรรม","en":"Rugged construction designed for industrial environments"}]',
 '[]', true, 4),

('lincoln-viking-3350', 'welding-accessories', 'lincoln-electric',
 '{"th":"Lincoln VIKING 3350 หน้ากากเชื่อมออโต้","en":"Lincoln VIKING 3350 Auto-Darkening Helmet"}',
 '{"th":"หน้ากากเชื่อมออโต้เลนส์ขนาดใหญ่ 4C เทคโนโลยีสีจริง","en":"Premium auto-darkening helmet with large 4C lens and true-color technology."}',
 '{"th":"Lincoln VIKING 3350 เป็นหน้ากากเชื่อมออโต้ระดับพรีเมียม พร้อมเลนส์ 4C Technology ขนาดใหญ่ 12.5 ตร.นิ้ว ให้มุมมองที่กว้างและสีที่เป็นธรรมชาติ ทั้งก่อน ระหว่าง และหลังการเชื่อม เฉดความเข้มปรับได้ตั้งแต่ 5-13 พร้อมโหมดตัดและโหมดเจียร ออกแบบมาเพื่อลดความเมื่อยล้าของดวงตาและเพิ่มคุณภาพงานเชื่อม","en":"The Lincoln VIKING 3350 is a premium auto-darkening welding helmet featuring 4C lens technology with a large 12.5 sq. in. viewing area that provides wide visibility and natural color clarity before, during, and after welding. Adjustable shade from 5-13 with cut and grind modes. Designed to reduce eye strain and improve weld quality."}',
 '["/images/products/welding-accessories/lincoln-viking-3350.jpg"]',
 '[{"label":{"th":"พื้นที่มองเห็น","en":"Viewing Area"},"value":{"th":"12.5 ตร.นิ้ว","en":"12.5 sq. in."}},{"label":{"th":"เฉดความเข้ม","en":"Shade Range"},"value":{"th":"5-13","en":"5-13"}},{"label":{"th":"เซนเซอร์","en":"Sensors"},"value":{"th":"4 เซนเซอร์","en":"4 Sensors"}},{"label":{"th":"ความเร็วสวิตช์","en":"Switching Speed"},"value":{"th":"1/20,000 วินาที","en":"1/20,000 sec"}},{"label":{"th":"น้ำหนัก","en":"Weight"},"value":{"th":"510 กรัม","en":"510 g (18 oz)"}}]',
 '[{"th":"เทคโนโลยี 4C Lens ให้ภาพสีจริงชัดเจนทุกสภาวะ","en":"4C Lens Technology provides true-color clarity in all conditions"},{"th":"เลนส์ขนาดใหญ่ให้มุมมองกว้าง ลดการเอียงศีรษะ","en":"Large viewing area reduces head tilting and improves visibility"},{"th":"มีโหมดตัดและโหมดเจียรในตัว","en":"Built-in cut mode and grind mode for versatile use"}]',
 '[]', false, 5),

('harris-model-85', 'welding-accessories', 'harris',
 '{"th":"Harris Model 85 ชุดเชื่อมตัดแก๊ส","en":"Harris Model 85 Oxy-Fuel Apparatus"}',
 '{"th":"ชุดเชื่อมตัดแก๊สครบชุดพร้อมใช้งาน สำหรับงานเชื่อมและตัดแบบแก๊ส","en":"Complete oxy-fuel welding and cutting outfit ready for professional use."}',
 '{"th":"Harris Model 85 เป็นชุดเชื่อมตัดแก๊สครบชุด ประกอบด้วยเกจ์ควบคุมออกซิเจนและอะเซทิลีน ด้ามจับเชื่อม หัวเชื่อม หัวตัด สายแก๊ส และอุปกรณ์เสริมครบครัน เหมาะสำหรับงานเชื่อมแก๊ส งานตัด งานเชื่อมทองเหลือง และงานให้ความร้อน บรรจุในกล่องพลาสติกทนทานพร้อมใช้งาน","en":"The Harris Model 85 is a complete oxy-fuel welding and cutting outfit, including oxygen and acetylene regulators, welding handle, welding tips, cutting attachment, hoses, and all necessary accessories. Suitable for gas welding, cutting, brazing, and heating applications. Packaged in a durable carrying case ready for professional use."}',
 '["/images/products/welding-accessories/harris-model-85.jpg"]',
 '[{"label":{"th":"ประเภทเชื้อเพลิง","en":"Fuel Gas Type"},"value":{"th":"อะเซทิลีน","en":"Acetylene"}},{"label":{"th":"ความหนาเชื่อมได้","en":"Welding Thickness Range"},"value":{"th":"0.4-6.3 มม.","en":"0.4-6.3 mm"}},{"label":{"th":"ความหนาตัดได้","en":"Cutting Thickness Range"},"value":{"th":"สูงสุด 150 มม.","en":"Up to 150 mm (6 in.)"}},{"label":{"th":"ยาวสายแก๊ส","en":"Hose Length"},"value":{"th":"6.1 เมตร","en":"6.1 m (20 ft)"}}]',
 '[{"th":"ชุดอุปกรณ์ครบครันพร้อมใช้งานทันที","en":"Complete outfit ready for immediate use"},{"th":"เกจ์ควบคุมแก๊สคุณภาพสูงให้การควบคุมที่แม่นยำ","en":"High-quality gas regulators for precise flow control"},{"th":"บรรจุในกล่องพลาสติกทนทาน สะดวกในการเคลื่อนย้าย","en":"Durable carrying case for easy transportation"}]',
 '[]', false, 6),

('lincoln-superarc-l56', 'welding-wire-rods', 'lincoln-electric',
 '{"th":"Lincoln SuperArc L-56 ลวดเชื่อม MIG","en":"Lincoln SuperArc L-56 MIG Wire"}',
 '{"th":"ลวดเชื่อม MIG เหล็กกล้าคาร์บอนคุณภาพสูง มาตรฐาน AWS ER70S-6","en":"Premium carbon steel MIG wire, AWS ER70S-6 classification."}',
 '{"th":"Lincoln SuperArc L-56 เป็นลวดเชื่อม MIG สำหรับเหล็กกล้าคาร์บอนคุณภาพสูง มาตรฐาน AWS ER70S-6 มีชั้นเคลือบทองแดงพิเศษช่วยป้อนลวดได้ราบรื่น ลดการอุดตันของหัวทิป ให้แนวเชื่อมที่สวยงามและแข็งแรง เหมาะสำหรับงานเชื่อมเหล็กกล้าทั่วไป งานโครงสร้าง และงานผลิตชิ้นส่วน ใช้ได้กับแก๊ส CO2 100% หรือแก๊สผสม Ar/CO2","en":"Lincoln SuperArc L-56 is a premium carbon steel MIG wire with AWS ER70S-6 classification. Features a special copper coating for smooth wire feeding and reduced tip clogging, producing beautiful and strong welds. Ideal for general steel fabrication, structural work, and parts manufacturing. Compatible with 100% CO2 or Ar/CO2 mixed shielding gas."}',
 '["/images/products/welding-wire-rods/lincoln-superarc-l56.jpg"]',
 '[{"label":{"th":"มาตรฐาน AWS","en":"AWS Classification"},"value":{"th":"ER70S-6","en":"ER70S-6"}},{"label":{"th":"ขนาดลวดที่มี","en":"Available Wire Sizes"},"value":{"th":"0.8, 0.9, 1.0, 1.2 มม.","en":"0.030, 0.035, 0.040, 0.045 in."}},{"label":{"th":"แก๊สปกคลุม","en":"Shielding Gas"},"value":{"th":"CO2 100% หรือ Ar/CO2","en":"100% CO2 or Ar/CO2 mix"}},{"label":{"th":"ค่าความต้านทานแรงดึง","en":"Tensile Strength"},"value":{"th":"560 MPa","en":"560 MPa (81 ksi)"}},{"label":{"th":"บรรจุภัณฑ์","en":"Packaging"},"value":{"th":"ม้วน 15 กก.","en":"15 kg (33 lb) spool"}}]',
 '[{"th":"ชั้นเคลือบทองแดงพิเศษช่วยป้อนลวดราบรื่น","en":"Special copper coating ensures smooth wire feeding"},{"th":"ให้แนวเชื่อมสวยงาม กระเด็นน้อย","en":"Produces beautiful welds with low spatter"},{"th":"เหมาะสำหรับงานเชื่อมทุกตำแหน่ง","en":"Suitable for all-position welding"}]',
 '[]', true, 7),

('lincoln-excalibur-7018', 'welding-wire-rods', 'lincoln-electric',
 '{"th":"Lincoln Excalibur 7018 ลวดเชื่อมไฟฟ้า","en":"Lincoln Excalibur 7018 Stick Electrode"}',
 '{"th":"ลวดเชื่อมไฟฟ้าชนิดด่างต่ำ E7018 สำหรับงานโครงสร้างที่ต้องการคุณภาพสูง","en":"Low-hydrogen E7018 stick electrode for high-quality structural applications."}',
 '{"th":"Lincoln Excalibur 7018 เป็นลวดเชื่อมไฟฟ้าชนิดด่างต่ำ (Low Hydrogen) มาตรฐาน AWS E7018 ออกแบบมาสำหรับงานโครงสร้างที่ต้องการความแข็งแรงและความเหนียวสูง เช่น งานสะพาน อาคาร และถังแรงดัน เปลือกหุ้มเหล็ก-ผงเหล็กให้อัตราการเติมสูง แนวเชื่อมเรียบสวย หลอมเหลวง่าย และขจัดสแลกออกได้สะดวก","en":"Lincoln Excalibur 7018 is a low-hydrogen stick electrode with AWS E7018 classification, designed for structural applications requiring high strength and toughness, such as bridges, buildings, and pressure vessels. The iron powder coating provides high deposition rates, smooth weld beads, easy arc striking, and effortless slag removal."}',
 '["/images/products/welding-wire-rods/lincoln-excalibur-7018.jpg"]',
 '[{"label":{"th":"มาตรฐาน AWS","en":"AWS Classification"},"value":{"th":"E7018","en":"E7018"}},{"label":{"th":"ขนาดลวดที่มี","en":"Available Sizes"},"value":{"th":"2.6, 3.2, 4.0 มม.","en":"3/32, 1/8, 5/32 in."}},{"label":{"th":"กระแสเชื่อม (3.2 มม.)","en":"Welding Current (1/8 in.)"},"value":{"th":"100-150 แอมป์","en":"100-150 Amps"}},{"label":{"th":"ค่าความต้านทานแรงดึง","en":"Tensile Strength"},"value":{"th":"490 MPa ขั้นต่ำ","en":"490 MPa (70 ksi) min."}},{"label":{"th":"บรรจุภัณฑ์","en":"Packaging"},"value":{"th":"กล่อง 5 กก.","en":"5 kg (11 lb) box"}}]',
 '[{"th":"ชนิดด่างต่ำ ลดความเสี่ยงรอยร้าวจากไฮโดรเจน","en":"Low-hydrogen design reduces risk of hydrogen-induced cracking"},{"th":"อัตราการเติมสูง เพิ่มผลผลิตในการเชื่อม","en":"High deposition rate increases welding productivity"},{"th":"ขจัดสแลกง่าย ลดเวลาในการทำความสะอาด","en":"Easy slag removal reduces cleaning time"}]',
 '[]', false, 8),

('harris-hp-742', 'gas-regulators', 'harris',
 '{"th":"Harris HP 742 เกจ์ควบคุมแก๊สพิวริตี้สูง","en":"Harris HP 742 High-Purity Gas Regulator"}',
 '{"th":"เกจ์ควบคุมแก๊สพิวริตี้สูง สำหรับงานเชื่อม TIG และงานพิเศษ","en":"High-purity gas regulator for TIG welding and specialty gas applications."}',
 '{"th":"Harris HP 742 เป็นเกจ์ควบคุมแก๊สคุณภาพสูงรุ่นพิวริตี้ ออกแบบมาสำหรับงานที่ต้องการความบริสุทธิ์ของแก๊สสูง เช่น งานเชื่อม TIG อลูมิเนียมและสแตนเลส งานห้องปฏิบัติการ และงานอิเล็กทรอนิกส์ ตัวเรือนสเตนเลสสตีลทนการกัดกร่อน พร้อมซีลพิเศษป้องกันการรั่วไหลของแก๊สอย่างสมบูรณ์แบบ","en":"The Harris HP 742 is a high-purity gas regulator designed for applications requiring the highest gas purity, such as TIG welding of aluminum and stainless steel, laboratory work, and electronics manufacturing. Stainless steel body resists corrosion, with special seals for complete gas leak prevention."}',
 '["/images/products/gas-regulators/harris-hp-742.jpg"]',
 '[{"label":{"th":"แรงดันขาเข้าสูงสุด","en":"Maximum Inlet Pressure"},"value":{"th":"200 บาร์","en":"3000 psi (200 bar)"}},{"label":{"th":"แรงดันขาออก","en":"Outlet Pressure Range"},"value":{"th":"0-10 บาร์","en":"0-150 psi (0-10 bar)"}},{"label":{"th":"อัตราการไหลสูงสุด","en":"Maximum Flow Rate"},"value":{"th":"200 ลิตร/นาที","en":"200 L/min"}},{"label":{"th":"วัสดุตัวเรือน","en":"Body Material"},"value":{"th":"สเตนเลสสตีล 316L","en":"316L Stainless Steel"}},{"label":{"th":"แก๊สที่รองรับ","en":"Compatible Gases"},"value":{"th":"อาร์กอน, ฮีเลียม, ไนโตรเจน","en":"Argon, Helium, Nitrogen"}}]',
 '[{"th":"ตัวเรือนสเตนเลสสตีล 316L ทนทานต่อการกัดกร่อน","en":"316L stainless steel body for superior corrosion resistance"},{"th":"ซีลพิเศษ PCTFE รักษาความบริสุทธิ์ของแก๊ส","en":"Special PCTFE seals maintain gas purity"},{"th":"หน้าปัดเกจ์ขนาดใหญ่อ่านค่าได้ง่าย","en":"Large gauge faces for easy pressure reading"},{"th":"ปุ่มปรับแรงดันหมุนได้นุ่มนวลและแม่นยำ","en":"Smooth, precise pressure adjustment knob"}]',
 '[]', true, 9),

('harris-301-ar60', 'gas-regulators', 'harris',
 '{"th":"Harris 301-AR60 เกจ์ควบคุมแก๊สอาร์กอน","en":"Harris 301-AR60 Argon Regulator"}',
 '{"th":"เกจ์ควบคุมแก๊สอาร์กอนพร้อมโฟลว์มิเตอร์ สำหรับงานเชื่อม TIG และ MIG","en":"Argon regulator with flowmeter for TIG and MIG welding applications."}',
 '{"th":"Harris 301-AR60 เป็นเกจ์ควบคุมแก๊สอาร์กอนพร้อมโฟลว์มิเตอร์ในตัว ออกแบบมาเฉพาะสำหรับงานเชื่อม TIG และ MIG ที่ใช้แก๊สอาร์กอนหรือแก๊สผสม CO2/Ar ตัวเรือนทองเหลืองชุบโครเมียมทนทาน โฟลว์มิเตอร์แบบลูกลอยอ่านค่าง่าย ปรับอัตราการไหลได้แม่นยำ พร้อมวาล์วนิรภัยป้องกันแรงดันเกิน","en":"The Harris 301-AR60 is an argon gas regulator with built-in flowmeter, designed specifically for TIG and MIG welding using argon or CO2/Ar mixed gases. Chrome-plated brass body for durability, easy-read float-type flowmeter for precise flow adjustment, and safety relief valve for overpressure protection."}',
 '["/images/products/gas-regulators/harris-301-ar60.jpg"]',
 '[{"label":{"th":"แรงดันขาเข้าสูงสุด","en":"Maximum Inlet Pressure"},"value":{"th":"200 บาร์","en":"3000 psi (200 bar)"}},{"label":{"th":"อัตราการไหล","en":"Flow Rate Range"},"value":{"th":"0-60 ลิตร/นาที","en":"0-60 L/min (0-130 CFH)"}},{"label":{"th":"วัสดุตัวเรือน","en":"Body Material"},"value":{"th":"ทองเหลืองชุบโครเมียม","en":"Chrome-Plated Brass"}},{"label":{"th":"ข้อต่อขาเข้า","en":"Inlet Connection"},"value":{"th":"CGA 580","en":"CGA 580"}}]',
 '[{"th":"โฟลว์มิเตอร์แบบลูกลอยในตัว อ่านค่าอัตราการไหลได้ง่าย","en":"Built-in float-type flowmeter for easy flow rate reading"},{"th":"วาล์วนิรภัยป้องกันแรงดันเกินมาตรฐาน","en":"Safety relief valve for overpressure protection"},{"th":"ตัวเรือนทองเหลืองชุบโครเมียมทนทาน สวยงาม","en":"Chrome-plated brass body for durability and appearance"}]',
 '[]', false, 10),

('lincoln-viking-heavy-duty', 'safety-equipment', 'lincoln-electric',
 '{"th":"Lincoln VIKING Heavy Duty หน้ากากเชื่อมออโต้","en":"Lincoln VIKING Heavy Duty Auto-Darkening Helmet"}',
 '{"th":"หน้ากากเชื่อมออโต้สำหรับงานหนัก ทนทานพิเศษ เหมาะกับสภาพแวดล้อมอุตสาหกรรม","en":"Heavy-duty auto-darkening helmet built for demanding industrial environments."}',
 '{"th":"Lincoln VIKING Heavy Duty เป็นหน้ากากเชื่อมออโต้ที่ออกแบบมาสำหรับงานหนักในสภาพแวดล้อมอุตสาหกรรม ตัวเรือนผลิตจากไนลอนทนความร้อนสูง ทนแรงกระแทกตามมาตรฐาน ANSI Z87.1 เลนส์ปรับเฉดความเข้มอัตโนมัติ 9-13 ตอบสนองเร็ว 1/25,000 วินาที พร้อมระบบระบายอากาศที่ลดฝ้าเลนส์ สายรัดศีรษะปรับได้ 5 จุดให้ความสบายในการสวมใส่ตลอดทั้งวัน","en":"The Lincoln VIKING Heavy Duty is an auto-darkening welding helmet designed for demanding industrial environments. The shell is made from heat-resistant nylon, impact-rated to ANSI Z87.1 standards. Auto-darkening lens with shade 9-13 and 1/25,000 sec response time. Ventilation system reduces lens fogging, and a 5-point adjustable headband provides all-day comfort."}',
 '["/images/products/safety-equipment/lincoln-viking-heavy-duty.jpg"]',
 '[{"label":{"th":"พื้นที่มองเห็น","en":"Viewing Area"},"value":{"th":"9.3 ตร.นิ้ว","en":"9.3 sq. in."}},{"label":{"th":"เฉดความเข้ม","en":"Shade Range"},"value":{"th":"9-13 (ปรับอัตโนมัติ)","en":"9-13 (Auto-darkening)"}},{"label":{"th":"ความเร็วสวิตช์","en":"Switching Speed"},"value":{"th":"1/25,000 วินาที","en":"1/25,000 sec"}},{"label":{"th":"มาตรฐาน","en":"Standards"},"value":{"th":"ANSI Z87.1, CSA Z94.3","en":"ANSI Z87.1, CSA Z94.3"}},{"label":{"th":"แหล่งพลังงาน","en":"Power Source"},"value":{"th":"โซลาร์เซลล์ + แบตเตอรี่ลิเธียม","en":"Solar cell + Lithium battery"}},{"label":{"th":"น้ำหนัก","en":"Weight"},"value":{"th":"535 กรัม","en":"535 g (18.8 oz)"}}]',
 '[{"th":"ตัวเรือนไนลอนทนความร้อนสูงและแรงกระแทก","en":"Heat-resistant and impact-resistant nylon shell"},{"th":"สายรัดศีรษะปรับได้ 5 จุดให้ความสบายตลอดวัน","en":"5-point adjustable headband for all-day comfort"},{"th":"ระบบระบายอากาศลดการเกิดฝ้าที่เลนส์","en":"Ventilation system reduces lens fogging"}]',
 '[]', false, 11),

('lincoln-traditional-welding-gloves', 'safety-equipment', 'lincoln-electric',
 '{"th":"Lincoln ถุงมือเชื่อมหนังแท้","en":"Lincoln Traditional MIG/Stick Welding Gloves"}',
 '{"th":"ถุงมือเชื่อมหนังแท้คุณภาพสูง ทนความร้อน สำหรับงานเชื่อม MIG และ Stick","en":"Premium genuine leather welding gloves, heat-resistant for MIG and Stick welding."}',
 '{"th":"ถุงมือเชื่อม Lincoln Traditional ผลิตจากหนังวัวแท้คุณภาพพรีเมียม ให้การป้องกันความร้อนและสะเก็ดไฟได้เป็นอย่างดี ซับในผ้าฝ้ายนุ่มสบาย ตะเข็บเย็บด้วยด้าย Kevlar ทนทานพิเศษ ด้ามจับออกแบบตามหลักสรีรศาสตร์ ให้ความคล่องตัวในการหยิบจับอุปกรณ์ เหมาะสำหรับงานเชื่อม MIG, Stick และงานทั่วไปที่ต้องการป้องกันความร้อน","en":"Lincoln Traditional Welding Gloves are made from premium genuine cowhide leather for excellent heat and spatter protection. Cotton-lined interior for comfort, Kevlar-stitched seams for exceptional durability, and ergonomically designed for dexterity when handling equipment. Ideal for MIG welding, Stick welding, and general high-heat applications."}',
 '["/images/products/safety-equipment/lincoln-traditional-welding-gloves.jpg"]',
 '[{"label":{"th":"วัสดุ","en":"Material"},"value":{"th":"หนังวัวแท้พรีเมียม","en":"Premium Genuine Cowhide"}},{"label":{"th":"ซับใน","en":"Lining"},"value":{"th":"ผ้าฝ้าย","en":"Cotton"}},{"label":{"th":"ด้ายเย็บ","en":"Stitching"},"value":{"th":"ด้าย Kevlar","en":"Kevlar Thread"}},{"label":{"th":"ขนาดที่มี","en":"Available Sizes"},"value":{"th":"M, L, XL","en":"M, L, XL"}},{"label":{"th":"ความยาว","en":"Length"},"value":{"th":"36 ซม.","en":"36 cm (14 in.)"}}]',
 '[{"th":"หนังวัวแท้คุณภาพพรีเมียม ทนความร้อนและสะเก็ดไฟ","en":"Premium cowhide leather for heat and spatter resistance"},{"th":"ตะเข็บเย็บด้วยด้าย Kevlar ทนทานยาวนาน","en":"Kevlar-stitched seams for long-lasting durability"},{"th":"ซับในผ้าฝ้ายนุ่มสบาย สวมใส่ได้ตลอดทั้งวัน","en":"Soft cotton lining for all-day comfort"}]',
 '[]', false, 12);

-- ========================================
-- Services (4)
-- ========================================
insert into services (slug, title, description, icon, features, sort_order) values
('equipment-repair',
 '{"th":"ซ่อมบำรุงอุปกรณ์","en":"Equipment Maintenance & Repair"}',
 '{"th":"บริการซ่อมบำรุงเครื่องเชื่อมและอุปกรณ์ตัดทุกยี่ห้อ โดยทีมช่างผู้เชี่ยวชาญที่ผ่านการอบรมจากโรงงานผู้ผลิตโดยตรง พร้อมอะไหล่แท้และรับประกันคุณภาพงานซ่อม เพื่อให้อุปกรณ์ของคุณกลับมาทำงานได้อย่างเต็มประสิทธิภาพ","en":"Professional maintenance and repair services for welding machines and cutting equipment of all brands. Our expert technicians are factory-trained and use genuine spare parts with quality repair guarantees to restore your equipment to full performance."}',
 'Wrench',
 '[{"th":"ช่างผู้เชี่ยวชาญผ่านการอบรมจากโรงงานผู้ผลิต","en":"Factory-trained expert technicians"},{"th":"ใช้อะไหล่แท้จากผู้ผลิตเท่านั้น","en":"Genuine manufacturer spare parts only"},{"th":"รับประกันคุณภาพงานซ่อมทุกครั้ง","en":"Quality guarantee on all repair work"},{"th":"บริการรับ-ส่งอุปกรณ์ถึงหน้างาน","en":"Equipment pickup and delivery service"}]',
 1),
('technical-consultation',
 '{"th":"ให้คำปรึกษาทางเทคนิค","en":"Technical Consultation"}',
 '{"th":"บริการให้คำปรึกษาทางเทคนิคด้านงานเชื่อมและตัดโดยวิศวกรผู้เชี่ยวชาญ ครอบคลุมการเลือกเครื่องเชื่อมที่เหมาะสม การออกแบบกระบวนการเชื่อม และการแก้ปัญหาทางเทคนิค เพื่อเพิ่มคุณภาพและประสิทธิภาพในการผลิต","en":"Expert technical consultation services for welding and cutting by specialist engineers. Covering proper equipment selection, welding process design, and technical troubleshooting to enhance production quality and efficiency."}',
 'MessageSquare',
 '[{"th":"วิศวกรผู้เชี่ยวชาญด้านงานเชื่อมโดยเฉพาะ","en":"Engineers specializing in welding applications"},{"th":"แนะนำเครื่องเชื่อมและลวดเชื่อมที่เหมาะสมกับงาน","en":"Equipment and consumable recommendations tailored to your needs"},{"th":"วิเคราะห์และแก้ปัญหาคุณภาพแนวเชื่อม","en":"Weld quality analysis and troubleshooting"}]',
 2),
('training',
 '{"th":"อบรมการใช้งาน","en":"Training Services"}',
 '{"th":"บริการอบรมการใช้งานเครื่องเชื่อมและอุปกรณ์ต่างๆ ทั้งภาคทฤษฎีและปฏิบัติ โดยวิทยากรผู้เชี่ยวชาญ เหมาะสำหรับทั้งผู้เริ่มต้นและช่างเชื่อมที่ต้องการยกระดับทักษะ สามารถจัดอบรมได้ทั้งที่ศูนย์ฝึกอบรมและหน้างานของลูกค้า","en":"Training services for welding machines and equipment, covering both theory and hands-on practice, led by expert instructors. Suitable for beginners and experienced welders looking to upgrade their skills. Training can be conducted at our facility or at the customer''s site."}',
 'GraduationCap',
 '[{"th":"หลักสูตรครอบคลุมทั้งภาคทฤษฎีและปฏิบัติ","en":"Comprehensive curriculum covering theory and practice"},{"th":"วิทยากรผู้เชี่ยวชาญจากโรงงานผู้ผลิต","en":"Expert instructors from equipment manufacturers"},{"th":"จัดอบรมได้ทั้งที่ศูนย์ฝึกอบรมและหน้างานลูกค้า","en":"Training available at our center or on-site at customer facilities"},{"th":"ออกใบรับรองการผ่านการอบรมให้ผู้เข้าร่วม","en":"Training completion certificates issued to all participants"}]',
 3),
('after-sales',
 '{"th":"บริการหลังการขาย","en":"After-Sales Support"}',
 '{"th":"บริการหลังการขายที่ครบครัน ทั้งการรับประกันสินค้า การจัดหาอะไหล่ และการสนับสนุนทางเทคนิค เรามุ่งมั่นดูแลลูกค้าอย่างต่อเนื่อง เพื่อให้มั่นใจว่าอุปกรณ์ของคุณทำงานได้อย่างเต็มประสิทธิภาพตลอดอายุการใช้งาน","en":"Comprehensive after-sales support including product warranty, spare parts supply, and technical assistance. We are committed to continuous customer care to ensure your equipment operates at full performance throughout its service life."}',
 'Headphones',
 '[{"th":"รับประกันสินค้าตามเงื่อนไขของผู้ผลิต","en":"Product warranty per manufacturer terms"},{"th":"จัดหาอะไหล่แท้พร้อมส่งทั่วประเทศ","en":"Genuine spare parts with nationwide delivery"},{"th":"สายด่วนสนับสนุนทางเทคนิคในเวลาทำการ","en":"Technical support hotline during business hours"},{"th":"บริการตรวจเช็คสภาพอุปกรณ์ประจำปี","en":"Annual equipment inspection service"}]',
 4);

-- ========================================
-- Company Info (1)
-- ========================================
insert into company_info (name, tagline, description, year_established, address, phone, email, line_id, map_url, coordinates) values (
 '{"th":"บริษัท แหลมทอง ซินดิเคท จำกัด","en":"Laemthong Syndicate Co., Ltd."}',
 '{"th":"ผู้นำด้านอุปกรณ์เชื่อมและตัดครบวงจร ตั้งแต่ปี 2506","en":"Thailand''s Leading Welding & Cutting Equipment Supplier Since 1963"}',
 '{"th":"บริษัท แหลมทอง ซินดิเคท จำกัด เป็นผู้นำเข้าและจัดจำหน่ายอุปกรณ์เชื่อมและตัดชั้นนำของประเทศไทย ก่อตั้งขึ้นในปี พ.ศ. 2506 ด้วยประสบการณ์กว่า 60 ปี เรามุ่งมั่นในการจัดหาสินค้าคุณภาพสูงจากแบรนด์ชั้นนำระดับโลก พร้อมบริการหลังการขายที่ครบครัน เพื่อตอบสนองความต้องการของลูกค้าในภาคอุตสาหกรรมทุกประเภท","en":"Laemthong Syndicate Co., Ltd. is Thailand''s leading importer and distributor of welding and cutting equipment. Established in 1963, with over 60 years of experience, we are committed to providing high-quality products from world-class brands along with comprehensive after-sales service to meet the needs of customers across all industrial sectors."}',
 1963,
 '{"th":"1188 ซอยจันทรสุข ถนนลาดพร้าว แขวงคลองจั่น เขตบางกะปิ กรุงเทพฯ 10240","en":"1188 Soi Chantrasuk, Latphrao Road, Khlong Chan, Bang Kapi, Bangkok 10240"}',
 '+66-2-538-4949',
 'sales@laemthong-syndicate.com',
 '@laemthong',
 'https://maps.google.com/maps?q=Laemthong+Syndicate+Co+Ltd+Bangkok&output=embed',
 '{"lat":13.7726,"lng":100.6435}'
);

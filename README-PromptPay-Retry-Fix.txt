CarrotOS PromptPay / EasySlip Retry Fix

ไฟล์ใน ZIP:
- server.js : server entrypoint ที่รวม PromptPay routes และ document click stats

วิธีติดตั้ง:
1. สำรอง server.js เดิมใน GitHub ก่อน
2. แทนที่ไฟล์ server.js เดิมด้วยไฟล์นี้ (ต้องอยู่ root เดียวกับ package.json)
3. package.json ที่มีอยู่เดิมต้องมี pg, promptpay-qr และ qrcode อยู่แล้ว
4. ตรวจ Render Environment ว่ามี DATABASE_URL, PROMPTPAY_ID และ EASYSLIP_API_KEY อยู่ครบ โดยห้ามส่งค่าลับให้ผู้อื่น
5. Deploy ล่าสุดบน Render แล้วตรวจ Logs ว่าเริ่ม server.js สำเร็จ

การแก้หลัก:
- ไม่ใช้ EasySlip checkDuplicate เป็นตัวตัดสินสลิปซ้ำแบบ provider-side; ใช้ trans_ref UNIQUE ใน PostgreSQL ของ CarrotOS เป็นตัวป้องกันแทน
- อนุญาตให้คำสั่งซื้อสถานะเก่าที่ไม่ใช่ paid ส่งตรวจใหม่ได้
- สถานะ paid ยังคงเป็นสถานะสิ้นสุด และใช้ row lock + transaction + unique trans_ref เพื่อกันเครดิตซ้ำ
- เพิ่ม migration column trans_ref / verification_json ใน ensureDb เดิม
- คง endpoints สำหรับ Document Click Stats ไว้

ข้อควรทราบ:
- ทดสอบ node --check ผ่านแล้ว
- ยังไม่ได้ทดสอบกับ DATABASE_URL หรือ EasySlip API key จริง และยังไม่ได้ Deploy
- อย่าทดสอบด้วยสลิปเดิมที่เติมเครดิตสำเร็จแล้ว เพราะระบบต้องปฏิเสธรายการซ้ำ

const express = require('express');
const app = express();

// ⚠️ สำคัญมากสำหรับ Railway: ต้องใช้พอร์ตที่ระบบสุ่มมาให้ผ่าน process.env.PORT
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('<h1>เซิร์ฟเวอร์ของ เกิดไชย์ พรหมบรรดาโชค เปิดใช้งานได้แล้วครับ! ⚡</h1>');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

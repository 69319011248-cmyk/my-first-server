const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;
// 1. ตั้งค่าให้ Server อ่านข้อมูลที่ส่งมาจากฟอร์ม (HTML Form) ได้
app.use(express.urlencoded({ extended: true }));
// 2. ตั้งค่าเชื่อมต่อฐานข้อมูล PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
// ---------------------------------------------------------
// เส้นทางที่ 1: (GET /) เมื่อเปิดหน้าเว็บหลัก ให้แสดงฟอร์มและตารางข้อมูล
// ---------------------------------------------------------
app.get('/', async (req, res) => {
  try {
    const client = await pool.connect();
    // ดึงข้อมูลทั้งหมด เรียงตาม ID
    const result = await client.query('SELECT * FROM students ORDER BY id ASC');
    client.release();
    // สร้างหน้าเว็บ HTML (มีฟอร์มสำหรับกรอกข้อมูล และตารางแสดงผล) - สไตล์นักบอล ⚽
    let html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>⚽ ระบบจัดการนักศึกษา - ทีมนักบอล</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: 'Tahoma', sans-serif;
    margin: 0;
    padding: 20px;
    min-height: 100vh;
    background:
      repeating-linear-gradient(
        90deg,
        #2e7d32 0px,
        #2e7d32 60px,
        #388e3c 60px,
        #388e3c 120px
      );
    background-attachment: fixed;
  }

  .container {
    max-width: 850px;
    margin: 0 auto;
    background: #ffffff;
    padding: 25px 30px 30px;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.35);
    border: 4px solid #1b5e20;
    position: relative;
  }

  .stadium-header {
    text-align: center;
    background: linear-gradient(135deg, #1b5e20, #2e7d32);
    color: #fff;
    padding: 18px 10px;
    border-radius: 12px;
    margin-bottom: 25px;
    box-shadow: inset 0 0 0 3px #ffffff33;
  }
  .stadium-header h1 {
    margin: 0;
    font-size: 26px;
    letter-spacing: 1px;
  }
  .stadium-header p {
    margin: 5px 0 0;
    font-size: 13px;
    opacity: 0.9;
  }

  h2 {
    color: #1b5e20;
    border-left: 6px solid #ffca28;
    padding-left: 10px;
    font-size: 19px;
  }

  form.add-form {
    background: #f1f8e9;
    border: 2px dashed #66bb6a;
    border-radius: 10px;
    padding: 18px 20px;
    margin-bottom: 30px;
  }

  label {
    font-weight: bold;
    color: #1b5e20;
    display: block;
    margin-top: 10px;
  }

  input[type="text"] {
    width: 100%;
    padding: 10px;
    margin: 6px 0;
    border: 2px solid #a5d6a7;
    border-radius: 6px;
    box-sizing: border-box;
    font-size: 14px;
  }
  input[type="text"]:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 0 3px #a5d6a755;
  }

  .btn-add {
    margin-top: 14px;
    background: linear-gradient(135deg, #43a047, #2e7d32);
    color: white;
    padding: 12px 22px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 15px;
    box-shadow: 0 4px 0 #1b5e20;
    transition: transform 0.1s;
  }
  .btn-add:active { transform: translateY(3px); box-shadow: 0 1px 0 #1b5e20; }
  .btn-add::before { content: "⚽ "; }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
    overflow: hidden;
    border-radius: 8px;
  }
  th, td {
    border: 1px solid #c8e6c9;
    padding: 12px;
    text-align: left;
  }
  th {
    background-color: #1b5e20;
    color: #ffca28;
    text-transform: uppercase;
    font-size: 13px;
    letter-spacing: 0.5px;
  }
  tr:nth-child(even) td { background-color: #f1f8e9; }
  tr:hover td { background-color: #dcedc8; }

  .btn-delete {
    background: linear-gradient(135deg, #ef5350, #c62828);
    color: white;
    padding: 7px 14px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 3px 0 #8e0000;
  }
  .btn-delete:active { transform: translateY(2px); box-shadow: 0 1px 0 #8e0000; }

  .footer-credit {
    text-align: center;
    margin-top: 25px;
    padding-top: 15px;
    border-top: 2px dotted #a5d6a7;
    color: #1b5e20;
    font-size: 13px;
  }
  .footer-credit b { color: #2e7d32; }
</style>
</head>
<body>
<div class="container">

  <div class="stadium-header">
    <h1>⚽ ระบบจัดการนักศึกษา - ทีมนักบอล</h1>
    <p>Student Management System | Football Squad Edition</p>
  </div>

  <h2>➕ เพิ่มข้อมูลนักศึกษาใหม่</h2>
  <!-- ฟอร์มนี้จะส่งข้อมูลไปที่ /add ด้วยวิธี POST -->
  <form class="add-form" action="/add" method="POST">
    <label>รหัสนักศึกษา:</label>
    <input type="text" name="student_id" placeholder="กรอกรหัสนักศึกษา" required>

    <label>ชื่อ-นามสกุล:</label>
    <input type="text" name="student_name" placeholder="กรอกชื่อ-นามสกุล" required>

    <button type="submit" class="btn-add">บันทึกข้อมูล</button>
  </form>

  <h2>📋 รายชื่อนักศึกษาในระบบ</h2>
  <table>
    <tr><th>ID ระบบ</th><th>รหัสนักศึกษา</th><th>ชื่อ-นามสกุล</th><th>จัดการ</th></tr>
`;
    // นำข้อมูลจากฐานข้อมูลมาวนลูปแสดงในตาราง
    result.rows.forEach(row => {
      html += `
    <tr>
      <td>${row.id}</td>
      <td>${row.student_id}</td>
      <td>${row.student_name}</td>
      <td style="text-align: center;">
        <!-- ปุ่มลบ จะส่ง id ไปที่ /delete -->
        <form action="/delete" method="POST" style="margin:0;">
          <input type="hidden" name="id" value="${row.id}">
          <button type="submit" class="btn-delete" onclick="return confirm('ยืนยันการลบข้อมูลนี้?')">🗑️ ลบ</button>
        </form>
      </td>
    </tr>
`;
    });
    html += `
  </table>

  <div class="footer-credit">
    จัดทำโดย <b>นายเกิดไชย์ พรหมบรรดาโชค</b> | รหัสนักศึกษา: <b>69319011248</b>
  </div>

</div>
</body>
</html>
`;
    res.send(html);
  } catch (err) {
    res.send(`เกิดข้อผิดพลาด: ${err.message}`);
  }
});

// ---------------------------------------------------------
// เส้นทางที่ 2: (POST /add) รับข้อมูลจากฟอร์มมาบันทึกลงฐานข้อมูล
// ---------------------------------------------------------
app.post('/add', async (req, res) => {
  // รับค่ามาจากช่อง input ที่ตั้งชื่อ name="student_id" และ name="student_name"
  const { student_id, student_name } = req.body;
  try {
    const client = await pool.connect();
    // คำสั่ง SQL สำหรับ Insert (ใช้ $1, $2 เพื่อป้องกันการโดนแฮกแบบ SQL Injection)
    await client.query('INSERT INTO students (student_id, student_name) VALUES ($1, $2)', [student_id, student_name]);
    client.release();
    res.redirect('/'); // บันทึกเสร็จ ให้เด้งกลับไปหน้าแรก
  } catch (err) {
    res.send(`เกิดข้อผิดพลาดในการเพิ่มข้อมูล: ${err.message}`);
  }
});
// ---------------------------------------------------------
// เส้นทางที่ 3: (POST /delete) รับ ID มาเพื่อลบข้อมูล
// ---------------------------------------------------------
app.post('/delete', async (req, res) => {
  const { id } = req.body; // รับ ID ที่ซ่อนไว้ในฟอร์ม
  try {
    const client = await pool.connect();
    // คำสั่ง SQL สำหรับลบข้อมูลตาม ID
    await client.query('DELETE FROM students WHERE id = $1', [id]);
    client.release();
    res.redirect('/'); // ลบเสร็จ ให้เด้งกลับไปหน้าแรก
  } catch (err) {
    res.send(`เกิดข้อผิดพลาดในการลบข้อมูล: ${err.message}`);
  }
});

// สั่งให้ Server เริ่มทำงาน
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

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

    // สร้างหนาเว็บ HTML (มีฟอร์มสำหรับกรอกข้อมูล และตารางแสดงผล)
    let html = `
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ระบบจัดการนักศึกษา</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --primary: #6366f1;
    --primary-dark: #4f46e5;
    --primary-light: #818cf8;
    --success: #10b981;
    --danger: #ef4444;
    --danger-dark: #dc2626;
    --bg: #f1f5f9;
    --card: #ffffff;
    --text: #1e293b;
    --text-muted: #64748b;
    --border: #e2e8f0;
  }

  * { box-sizing: border-box; }

  body {
    font-family: 'Kanit', sans-serif;
    margin: 0;
    padding: 40px 20px;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
    min-height: 100vh;
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
  }

  .header {
    text-align: center;
    margin-bottom: 30px;
    color: #ffffff;
  }

  .header h1 {
    font-size: 2.2rem;
    font-weight: 700;
    margin: 0 0 8px 0;
    text-shadow: 0 2px 10px rgba(0,0,0,0.2);
  }

  .header p {
    font-weight: 300;
    opacity: 0.9;
    margin: 0;
  }

  .card {
    background: var(--card);
    padding: 28px 30px;
    border-radius: 18px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    margin-bottom: 24px;
  }

  .card h2 {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--text);
    margin-top: 0;
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 2px solid var(--border);
  }

  form.entry-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 20px;
    align-items: end;
  }

  .field { display: flex; flex-direction: column; }

  label {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-muted);
    margin-bottom: 6px;
  }

  input[type="text"] {
    width: 100%;
    padding: 12px 14px;
    font-family: 'Kanit', sans-serif;
    font-size: 0.95rem;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    background: #f8fafc;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  input[type="text"]:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
    background: #fff;
  }

  .btn-add {
    grid-column: 1 / -1;
    background: linear-gradient(135deg, var(--success), #059669);
    color: white;
    padding: 13px 20px;
    border: none;
    border-radius: 10px;
    font-family: 'Kanit', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 12px rgba(16,185,129,0.35);
  }

  .btn-add:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16,185,129,0.45);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    overflow: hidden;
    border-radius: 12px;
  }

  th {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: white;
    padding: 14px 16px;
    text-align: left;
    font-weight: 500;
    font-size: 0.9rem;
  }

  th:first-child { border-top-left-radius: 10px; }
  th:last-child { border-top-right-radius: 10px; text-align: center; }

  td {
    padding: 13px 16px;
    border-bottom: 1px solid var(--border);
    font-size: 0.95rem;
    color: var(--text);
  }

  tr:last-child td { border-bottom: none; }
  tr:nth-child(even) td { background: #f8fafc; }
  tr:hover td { background: #eef2ff; }

  .btn-delete {
    background: linear-gradient(135deg, var(--danger), var(--danger-dark));
    color: white;
    padding: 7px 16px;
    border: none;
    border-radius: 8px;
    font-family: 'Kanit', sans-serif;
    font-size: 0.85rem;
    cursor: pointer;
    transition: transform 0.15s;
  }

  .btn-delete:hover { transform: scale(1.05); }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-muted);
  }

  .footer {
    text-align: center;
    color: rgba(255,255,255,0.85);
    font-size: 0.85rem;
    margin-top: 10px;
    font-weight: 300;
  }

  .footer strong { font-weight: 500; }

  @media (max-width: 600px) {
    form.entry-form { grid-template-columns: 1fr; }
    table, thead, tbody, th, td, tr { display: block; }
    thead { display: none; }
    tr { margin-bottom: 12px; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    td { display: flex; justify-content: space-between; align-items: center; }
    td::before { content: attr(data-label); font-weight: 500; color: var(--text-muted); }
  }
</style>
</head>
<body>
<div class="container">

  <div class="header">
    <h1>🎓 ระบบจัดการนักศึกษา</h1>
    <p>Student Management System</p>
  </div>

  <div class="card">
    <h2>➕ เพิ่มข้อมูลนักศึกษาใหม่</h2>
    <!-- ฟอร์มนี้จะส่งข้อมูลไปที่ /add ด้วยวิธี POST -->
    <form action="/add" method="POST" class="entry-form">
      <div class="field">
        <label>รหัสนักศึกษา</label>
        <input type="text" name="student_id" placeholder="กรอกรหัสนักศึกษา" required>
      </div>
      <div class="field">
        <label>ชื่อ-นามสกุล</label>
        <input type="text" name="student_name" placeholder="กรอกชื่อ-นามสกุล" required>
      </div>
      <button type="submit" class="btn-add">บันทึกข้อมูล</button>
    </form>
  </div>

  <div class="card">
    <h2>📋 รายชื่อนักศึกษาในระบบ</h2>
`;

    if (result.rows.length === 0) {
      html += `<div class="empty-state">ยังไม่มีข้อมูลนักศึกษาในระบบ</div>`;
    } else {
      html += `
    <table>
      <thead>
        <tr><th>ID ระบบ</th><th>รหัสนักศึกษา</th><th>ชื่อ-นามสกุล</th><th style="text-align:center;">จัดการ</th></tr>
      </thead>
      <tbody>
`;
      // นำข้อมูลจากฐานข้อมูลมาวนลูปแสดงในตาราง
      result.rows.forEach(row => {
        html += `
        <tr>
          <td data-label="ID ระบบ">${row.id}</td>
          <td data-label="รหัสนักศึกษา">${row.student_id}</td>
          <td data-label="ชื่อ-นามสกุล">${row.student_name}</td>
          <td data-label="จัดการ" style="text-align: center;">
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
      </tbody>
    </table>
`;
    }

    html += `
  </div>

  <div class="footer">
    จัดทำโดย <strong>นายเกิดไชย์ พรหมบรรดาโชค</strong> &nbsp;|&nbsp; รหัสนักศึกษา 69319011248
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

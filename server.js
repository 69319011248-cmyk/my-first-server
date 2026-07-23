const http = require('http');
const { Pool } = require('pg');

// ตั้งค่าการเชื่อมต่อ PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const server = http.createServer(async (req, res) => {
    try {
        // ดึงข้อมูลจากฐานข้อมูล
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM students LIMIT 10');
            const studentsData = result.rows || [];

            // สร้าง HTML rows สำหรับตาราง (ปลอดภัยจากค่า null/undefined)
            const rowsHtml = studentsData.map(row => `
                <tr>
                    <td>${row.student_id ?? ''}</td>
                    <td>${row.student_name ?? ''}</td>
                </tr>
            `).join('');

            // ส่งผลลัพท์สำเร็จ (200)
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GATE OF ABYSS // KERDCHAI</title>

<style>
/* (CSS omitted for brevity in this commit - unchanged) */
</style>
</head>
<body>

<canvas id="emberCanvas"></canvas>
<div class="vignette"></div>

<!-- PROFILE -->
<div class="screen" id="profileScreen">... (omitted) ...</div>

<!-- GAME -->
<div class="screen hidden" id="gameScreen">... (omitted) ...</div>

<!-- DATABASE -->
<div class="screen hidden" id="databaseScreen">
    <div class="database-wrap">
        <h2>📊 STUDENT DATABASE (นักศึกษา)</h2>
        <table class="database-table">
            <thead>
                <tr>
                    <th>รหัสนักศึกษา</th>
                    <th>ชื่อ-นามสกุล</th>
                </tr>
            </thead>
            <tbody>
                ${rowsHtml}
            </tbody>
        </table>

        <div class="nav-buttons">
            <button onclick="goToProfile()">RETURN TO GATE</button>
            <button onclick="goToGame()">ENTER THE ABYSS</button>
        </div>
    </div>
</div>

<script>
// (Client-side JS omitted for brevity in this commit - unchanged)
</script>

</body>
</html>
            `);
        } finally {
            // แน่ใจว่า release client เสมอ
            client.release();
        }
    } catch (err) {
        // กรณีเชื่อมต่อไม่ได้หรือเขียนชื่อตารางผิด
        console.error(err);
        // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>Error</title>
<style>
body {
    background: #000;
    color: #ff6b6b;
    font-family: monospace;
    padding: 40px;
    text-align: center;
}
</style>
</head>
<body>
<h1>⚠️ เกิดข้อผิดพลาด!</h1>
<p><strong>ข้อความข้อผิดพลาด:</strong></p>
<p>${err.message}</p>
<p style="margin-top: 20px; color: #64dcff;">ตรวจสอบ:</p>
<ul style="text-align: left; display: inline-block;">
    <li>ว่าตัวแปร DATABASE_URL ถูกตั้งค่าแล้ว</li>
    <li>ว่าตาราง "students" มีอยู่ในฐานข้อมูล</li>
    <li>ว่าเชื่อมต่อฐานข้อมูล PostgreSQL ได้</li>
</ul>
</body>
</html>
        `);
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🔥 Gate of Abyss server is running on port ${PORT}`);
});

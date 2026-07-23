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
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #000;
    color: #fff;
    font-family: 'Arial', sans-serif;
}

body {
    display: flex;
    justify-content: center;
    align-items: center;
}

canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.vignette {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.7) 100%);
    z-index: 2;
    pointer-events: none;
}

.screen {
    position: relative;
    z-index: 3;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 1;
    transition: opacity 0.5s ease-in-out;
}

.screen.hidden {
    display: none;
    opacity: 0;
}

.profile-wrap, .database-wrap {
    background: rgba(0, 0, 0, 0.9);
    border: 3px solid #ff6b6b;
    border-radius: 10px;
    padding: 40px;
    text-align: center;
    max-width: 600px;
    width: 90%;
    box-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
}

.profile-wrap h1 {
    font-size: 2.5em;
    margin-bottom: 20px;
    color: #ff6b6b;
    text-shadow: 0 0 10px rgba(255, 107, 107, 0.8);
}

.profile-wrap p {
    font-size: 1.2em;
    margin-bottom: 30px;
    color: #64dcff;
}

.database-wrap h2 {
    font-size: 2em;
    margin-bottom: 30px;
    color: #ff6b6b;
    text-shadow: 0 0 10px rgba(255, 107, 107, 0.8);
}

.database-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 30px;
    background: rgba(0, 0, 0, 0.8);
}

.database-table thead tr {
    background: #ff6b6b;
    color: #000;
}

.database-table th {
    padding: 12px;
    text-align: left;
    font-weight: bold;
}

.database-table td {
    padding: 10px 12px;
    border-bottom: 1px solid #ff6b6b;
    color: #64dcff;
}

.database-table tbody tr:hover {
    background: rgba(255, 107, 107, 0.1);
}

.nav-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
}

button {
    padding: 12px 30px;
    font-size: 1em;
    background: #ff6b6b;
    color: #000;
    border: 2px solid #ff6b6b;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
    text-transform: uppercase;
}

button:hover {
    background: #ff5252;
    box-shadow: 0 0 15px rgba(255, 107, 107, 0.8);
    transform: scale(1.05);
}

button:active {
    transform: scale(0.95);
}

.game-wrap {
    text-align: center;
}

.game-wrap h2 {
    font-size: 2em;
    margin-bottom: 30px;
    color: #ff6b6b;
}

.game-content {
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid #64dcff;
    padding: 30px;
    border-radius: 10px;
    margin-bottom: 30px;
    min-height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.game-content p {
    font-size: 1.3em;
    color: #64dcff;
}
</style>

</head>
<body>

<canvas id="emberCanvas"></canvas>
<div class="vignette"></div>

<!-- PROFILE -->
<div class="screen" id="profileScreen">
    <div class="profile-wrap">
        <h1>⚔️ GATE OF ABYSS ⚔️</h1>
        <p>ยินดีต้อนรับสู่อาณาจักรแห่งความมืด</p>
        <div class="nav-buttons">
            <button onclick="goToGame()">ENTER THE ABYSS</button>
            <button onclick="goToDatabase()">VIEW DATABASE</button>
        </div>
    </div>
</div>

<!-- GAME -->
<div class="screen hidden" id="gameScreen">
    <div class="game-wrap">
        <h2>⚡ THE ABYSS ⚡</h2>
        <div class="game-content">
            <p>🌑 คุณได้เข้าสู่โลกแห่งความมืด 🌑</p>
        </div>
        <div class="nav-buttons">
            <button onclick="goToProfile()">RETURN TO GATE</button>
            <button onclick="goToDatabase()">VIEW DATABASE</button>
        </div>
    </div>
</div>

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
// Particle effect on canvas
const canvas = document.getElementById('emberCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4 - 1;
        this.life = 1;
        this.decay = Math.random() * 0.01 + 0.005;
        this.size = Math.random() * 3 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
    }

    draw() {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(animateParticles);
}

animateParticles();

document.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 2; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
    }
});

// Screen navigation
function hideAllScreens() {
    document.getElementById('profileScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('databaseScreen').classList.add('hidden');
}

function goToProfile() {
    hideAllScreens();
    document.getElementById('profileScreen').classList.remove('hidden');
}

function goToGame() {
    hideAllScreens();
    document.getElementById('gameScreen').classList.remove('hidden');
}

function goToDatabase() {
    hideAllScreens();
    document.getElementById('databaseScreen').classList.remove('hidden');
}

// Show profile screen on load
window.addEventListener('load', goToProfile);

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
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
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

body {
    background: #000;
    color: #ff6b6b;
    font-family: monospace;
    padding: 40px;
    text-align: center;
}

.error-box {
    border: 3px solid #ff6b6b;
    padding: 30px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.9);
    max-width: 600px;
    box-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
}

h1 {
    margin-bottom: 20px;
    text-shadow: 0 0 10px rgba(255, 107, 107, 0.8);
}

p {
    margin: 15px 0;
    line-height: 1.6;
}

.error-message {
    background: rgba(255, 107, 107, 0.1);
    padding: 15px;
    border-radius: 5px;
    margin: 20px 0;
    border-left: 3px solid #ff6b6b;
}

ul {
    text-align: left;
    display: inline-block;
    margin-top: 20px;
    color: #64dcff;
}

li {
    margin: 8px 0;
}
</style>
</head>
<body>
<div class="error-box">
    <h1>⚠️ เกิดข้อผิดพลาด!</h1>
    <p><strong>ข้อความข้อผิดพลาด:</strong></p>
    <div class="error-message">${err.message}</div>
    <p style="color: #64dcff;">ตรวจสอบข้อมูลต่อไปนี้:</p>
    <ul>
        <li>✓ ตัวแปร DATABASE_URL ถูกตั้งค่าแล้ว</li>
        <li>✓ ตาราง "students" มีอยู่ในฐานข้อมูล</li>
        <li>✓ เชื่อมต่อฐานข้อมูล PostgreSQL ได้</li>
        <li>✓ ตัวแปร PORT ถูกตั้งค่า (ค่าเริ่มต้น 3000)</li>
    </ul>
</div>
</body>
</html>
        `);
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🔥 Gate of Abyss server is running on port ${PORT}`);
    console.log(`📍 Open your browser: http://localhost:${PORT}`);
});

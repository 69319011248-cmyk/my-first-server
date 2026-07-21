const http = require('http');
const { Pool } = require('pg');

// ตั้งค่าการเชื่อมต่อ PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const server = http.createServer(async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    try {
        // ดึงข้อมูลจากฐานข้อมูล
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM students LIMIT 10');
        client.release();
        
        const studentsData = result.rows;

        res.end(`
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GATE OF ABYSS // KERDCHAI</title>

<style>
* {
    box-sizing: border-box;
}

html, body {
    margin: 0;
    height: 100%;
    background: #000;
    font-family: "Segoe UI", -apple-system, sans-serif;
    overflow: hidden;
}

body {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* ================= พื้นหลัง: ถ่านไฟลอยขึ้นเต็มจอ (Cool Tone) ================= */
#emberCanvas {
    position: absolute;
    inset: 0;
    z-index: 0;
}

.vignette {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: radial-gradient(ellipse at center, transparent 35%, #000 95%);
}

/* ================= SCREENS ================= */
.screen {
    position: absolute;
    inset: 0;
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 1;
    transform: scale(1);
    transition: opacity 0.5s ease, transform 0.5s ease;
    pointer-events: auto;
}

.screen.hidden {
    opacity: 0;
    transform: scale(0.92);
    pointer-events: none;
}

/* ================= PROFILE PANEL (ทรงหกเหลี่ยม) ================= */
.sigil-wrap {
    position: relative;
    width: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.pentagram {
    position: absolute;
    top: -60px;
    width: 260px;
    height: 260px;
    opacity: 0.18;
    animation: spinSlow 40s linear infinite;
    z-index: 0;
}

@keyframes spinSlow {
    100% { transform: rotate(360deg); }
}

.panel {
    position: relative;
    z-index: 2;
    width: 100%;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    background: linear-gradient(180deg, #0a1f3a 0%, #051428 100%);
    padding: 70px 45px;
    text-align: center;
    animation: pulseGlow 3s ease-in-out infinite;
}

@keyframes pulseGlow {
    0%, 100% { filter: drop-shadow(0 0 18px rgba(59, 180, 255, 0.45)); }
    50% { filter: drop-shadow(0 0 34px rgba(100, 220, 255, 0.65)); }
}

.rank-tag {
    font-family: monospace;
    font-size: 11px;
    letter-spacing: 5px;
    color: #3bb4ff;
    margin-bottom: 6px;
}

.brand {
    font-family: 'Impact', sans-serif;
    font-size: 15px;
    letter-spacing: 6px;
    color: #1b5f99;
    margin-bottom: 18px;
}

.crest {
    width: 90px;
    height: 90px;
    margin: 0 auto 18px;
    position: relative;
}

.crest svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 10px rgba(59, 180, 255, 0.8));
}

h1.namefire {
    font-family: 'Impact', sans-serif;
    font-size: 30px;
    letter-spacing: 3px;
    margin: 0 0 4px 0;
    color: #e0f2ff;
    text-shadow:
        0 0 6px #64dcff,
        0 0 16px #3bb4ff,
        0 0 30px #0088ff;
    animation: flicker 2.6s infinite;
}

@keyframes flicker {
    0%, 100% { opacity: 1; }
    45% { opacity: 1; }
    47% { opacity: 0.75; }
    49% { opacity: 1; }
    72% { opacity: 0.9; }
    74% { opacity: 1; }
}

.thainame {
    font-size: 17px;
    color: #b0e0ff;
    margin-bottom: 22px;
    letter-spacing: 1px;
}

.stat-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 6px;
    border-bottom: 1px dashed rgba(59, 180, 255, 0.35);
    font-family: monospace;
    font-size: 12px;
    color: #5a9fb8;
}

.stat-row b {
    color: #c0e8ff;
    font-size: 14px;
    letter-spacing: 1px;
}

.enter-btn {
    margin-top: 28px;
    background: linear-gradient(180deg, #0d4a8b, #062d5a);
    border: 1px solid #3bb4ff;
    padding: 12px 30px;
    color: #64dcff;
    font-family: 'Impact', sans-serif;
    font-size: 16px;
    letter-spacing: 3px;
    cursor: pointer;
    clip-path: polygon(8% 0, 100% 0, 92% 100%, 0 100%);
    transition: 0.25s;
}

.enter-btn:hover {
    background: #0088dd;
    color: #000a15;
    box-shadow: 0 0 30px #0088dd;
}

/* ================= GAME SCREEN ================= */
.abyss-wrap {
    width: 460px;
    text-align: center;
}

.abyss-header {
    display: flex;
    justify-content: space-between;
    font-family: monospace;
    color: #3bb4ff;
    font-size: 13px;
    margin-bottom: 10px;
    padding: 0 6px;
}

.abyss-header b {
    color: #c0e8ff;
}

#grid3x3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    width: 340px;
    margin: 0 auto;
    padding: 18px;
    background: #0a1a2e;
    border: 1px solid rgba(59, 180, 255, 0.4);
    box-shadow: inset 0 0 25px rgba(13, 74, 139, 0.7);
    border-radius: 10px;
}

.hole {
    aspect-ratio: 1;
    background: radial-gradient(circle at 50% 60%, #0a2d52, #000);
    border-radius: 50%;
    border: 2px solid rgba(59, 180, 255, 0.35);
    position: relative;
    cursor: pointer;
    overflow: hidden;
}

.hole .flame {
    position: absolute;
    left: 50%;
    bottom: -60%;
    width: 60%;
    height: 60%;
    transform: translateX(-50%);
    border-radius: 50% 50% 45% 45%;
    background: radial-gradient(circle, #64dcff 0%, #3bb4ff 55%, #0088ff 100%);
    box-shadow: 0 0 18px rgba(59, 180, 255, 0.9);
    transition: bottom 0.15s ease-out;
}

.hole.up .flame {
    bottom: 8%;
}

.hole.bad .flame {
    background: radial-gradient(circle, #a8c5d1 0%, #6b8a99 55%, #3d5562 100%);
    box-shadow: 0 0 14px rgba(107, 138, 153, 0.7);
}

.abyss-msg {
    margin-top: 14px;
    font-family: monospace;
    font-size: 12px;
    color: #5a9fb8;
    min-height: 16px;
}

.back-btn {
    margin-top: 18px;
    background: transparent;
    border: 1px solid #64dcff;
    padding: 8px 26px;
    color: #64dcff;
    font-family: 'Impact', sans-serif;
    font-size: 14px;
    letter-spacing: 2px;
    cursor: pointer;
    border-radius: 4px;
}

.back-btn:hover {
    background: #64dcff;
    color: #000a15;
}

/* ================= DATABASE SCREEN ================= */
.database-wrap {
    width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    text-align: center;
}

.database-wrap h2 {
    color: #3bb4ff;
    font-family: 'Impact', sans-serif;
    margin-top: 0;
}

.database-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    background: #0a1a2e;
    border: 1px solid rgba(59, 180, 255, 0.4);
}

.database-table th {
    background: linear-gradient(180deg, #0d4a8b, #062d5a);
    color: #64dcff;
    padding: 12px;
    text-align: left;
    border-bottom: 2px solid #3bb4ff;
    font-family: monospace;
}

.database-table td {
    padding: 10px 12px;
    border-bottom: 1px dashed rgba(59, 180, 255, 0.35);
    color: #b0e0ff;
    font-family: monospace;
    font-size: 13px;
}

.database-table tr:hover {
    background: rgba(59, 180, 255, 0.1);
}

.nav-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
}

.nav-buttons button {
    background: linear-gradient(180deg, #0d4a8b, #062d5a);
    border: 1px solid #3bb4ff;
    padding: 8px 20px;
    color: #64dcff;
    font-family: 'Impact', sans-serif;
    font-size: 14px;
    letter-spacing: 2px;
    cursor: pointer;
    border-radius: 4px;
    transition: 0.25s;
}

.nav-buttons button:hover {
    background: #0088dd;
    color: #000a15;
    box-shadow: 0 0 30px #0088dd;
}
</style>
</head>
<body>

<canvas id="emberCanvas"></canvas>
<div class="vignette"></div>

<!-- ================= SCREEN 1: PROFILE ================= -->
<div class="screen" id="profileScreen">
    <div class="sigil-wrap">
        <svg class="pentagram" viewBox="0 0 100 100">
            <polygon points="50,3 61,38 98,38 68,60 79,95 50,73 21,95 32,60 2,38 39,38"
                fill="none" stroke="#3bb4ff" stroke-width="1"/>
            <circle cx="50" cy="50" r="47" fill="none" stroke="#3bb4ff" stroke-width="0.6"/>
        </svg>

        <div class="panel">
            <div class="rank-tag">SOUL RANK // DAMNED-I</div>
            <div class="brand">ABYSS REGISTRY</div>

            <div class="crest">
                <svg viewBox="0 0 100 100">
                    <path d="M50 8 C30 25 20 45 20 62 C20 82 34 94 50 94 C66 94 80 82 80 62 C80 45 70 25 50 8 Z"
                        fill="none" stroke="#3bb4ff" stroke-width="2.5"/>
                    <path d="M50 30 C40 42 35 54 35 64 C35 76 42 84 50 84 C58 84 65 76 65 64 C65 54 60 42 50 30 Z"
                        fill="#0055dd" opacity="0.85"/>
                </svg>
            </div>

            <h1 class="namefire">KERDCHAI</h1>
            <div class="thainame">เกิดไชย์ พรหมบรรดาโชค</div>

            <div class="stat-row"><span>SOUL_ID</span><b>69319011248</b></div>
            <div class="stat-row"><span>DOMAIN</span><b>NARAKA / นรกภูมิ</b></div>

            <button class="enter-btn" onclick="goToGame()">ENTER THE ABYSS</button>
            <button class="enter-btn" style="margin-top: 10px;" onclick="goToDatabase()">VIEW STUDENTS</button>
        </div>
    </div>
</div>

<!-- ================= SCREEN 2: GAME (WHAC-A-FLAME) ================= -->
<div class="screen hidden" id="gameScreen">
    <div class="abyss-wrap">
        <div class="abyss-header">
            <div>SOULS COLLECTED: <b id="score">0</b></div>
            <div>LIVES: <b id="lives">3</b></div>
        </div>

        <div id="grid3x3"></div>

        <div class="abyss-msg" id="msg">คลิกกองไฟก่อนมันดับ อย่าคลิกโดนเถ้าถ่านสีเทา!</div>

        <button class="back-btn" onclick="goToProfile()">RETURN TO GATE</button>
    </div>
</div>

<!-- ================= SCREEN 3: DATABASE ================= -->
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
                ${studentsData.map(row => \`
                <tr>
                    <td>\${row.student_id}</td>
                    <td>\${row.student_name}</td>
                </tr>
                \`).join('')}
            </tbody>
        </table>
        
        <div class="nav-buttons">
            <button onclick="goToProfile()">RETURN TO GATE</button>
            <button onclick="goToGame()">ENTER THE ABYSS</button>
        </div>
    </div>
</div>

<script>
// ================= EMBER BACKGROUND (ถ่านไฟลอยขึ้น - Cool Tone) =================
const canvas = document.getElementById('emberCanvas');
const ctx = canvas.getContext('2d');
let W, H;
function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

let embers = [];
function spawnEmber() {
    embers.push({
        x: Math.random() * W,
        y: H + 10,
        r: Math.random() * 2.2 + 0.8,
        speed: Math.random() * 1.2 + 0.4,
        drift: (Math.random() - 0.5) * 0.6,
        life: 1,
        hue: Math.random() > 0.5 ? '100,220,255' : '59,180,255'
    });
}

function drawEmbers() {
    ctx.clearRect(0, 0, W, H);
    if (embers.length < 140) spawnEmber();

    for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.y -= e.speed;
        e.x += e.drift;
        e.life -= 0.0025;

        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = \`rgba(\${e.hue}, \${Math.max(e.life, 0)})\`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(59,180,255,0.6)';
        ctx.fill();

        if (e.life <= 0 || e.y < -10) embers.splice(i, 1);
    }
    requestAnimationFrame(drawEmbers);
}
drawEmbers();

// ================= SCREEN SWITCH =================
function goToGame() {
    document.getElementById('profileScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    document.getElementById('databaseScreen').classList.add('hidden');
    startGame();
}

function goToProfile() {
    document.getElementById('profileScreen').classList.remove('hidden');
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('databaseScreen').classList.add('hidden');
    stopGame();
}

function goToDatabase() {
    document.getElementById('profileScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('databaseScreen').classList.remove('hidden');
    stopGame();
}

// ================= WHAC-A-FLAME GAME =================
const gridEl = document.getElementById('grid3x3');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const msgEl = document.getElementById('msg');

let holes = [];
let score = 0;
let lives = 3;
let spawnTimer = null;
let gameRunning = false;

// สร้างช่อง 3x3
for (let i = 0; i < 9; i++) {
    const hole = document.createElement('div');
    hole.className = 'hole';
    const flame = document.createElement('div');
    flame.className = 'flame';
    hole.appendChild(flame);
    hole.addEventListener('click', () => hitHole(i));
    gridEl.appendChild(hole);
    holes.push({ el: hole, up: false, bad: false, timeout: null });
}

function startGame() {
    score = 0;
    lives = 3;
    gameRunning = true;
    scoreEl.innerText = score;
    livesEl.innerText = lives;
    msgEl.innerText = "คลิกกองไฟก่อนมันดับ อย่าคลิกโดนเถ้าถ่านสีเทา!";
    holes.forEach(h => {
        h.el.classList.remove('up', 'bad');
        h.up = false;
        clearTimeout(h.timeout);
    });
    tick();
}

function stopGame() {
    gameRunning = false;
    holes.forEach(h => clearTimeout(h.timeout));
}

function tick() {
    if (!gameRunning) return;

    const idx = Math.floor(Math.random() * holes.length);
    const h = holes[idx];

    if (!h.up) {
        h.up = true;
        h.bad = Math.random() < 0.28; // 28% เป็นเถ้าถ่าน (ห้ามคลิก)
        h.el.classList.toggle('bad', h.bad);
        h.el.classList.add('up');

        h.timeout = setTimeout(() => {
            if (h.up && !h.bad) {
                loseLife();
            }
            h.up = false;
            h.el.classList.remove('up', 'bad');
        }, 900);
    }

    const nextDelay = 380 + Math.random() * 380;
    setTimeout(tick, nextDelay);
}

function hitHole(idx) {
    if (!gameRunning) return;
    const h = holes[idx];
    if (!h.up) return;

    if (h.bad) {
        loseLife();
    } else {
        score++;
        scoreEl.innerText = score;
    }

    h.up = false;
    h.el.classList.remove('up', 'bad');
    clearTimeout(h.timeout);
}

function loseLife() {
    lives--;
    livesEl.innerText = lives;
    if (lives <= 0) {
        gameRunning = false;
        msgEl.innerText = "วิญญาณดับสูญ... กด RETURN TO GATE แล้วกลับมาลองใหม่";
        holes.forEach(h => clearTimeout(h.timeout));
    }
}
</script>

</body>
</html>
        `);
    } catch (err) {
        // กรณีเชื่อมต่อไม่ได้หรือเขียนชื่อตารางผิด
        console.error(err);
        res.end(\`
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
h1 { color: #ff6b6b; }
p { font-size: 16px; }
</style>
</head>
<body>
<h1>⚠️ เกิดข้อผิดพลาด!</h1>
<p><strong>ข้อความข้อผิดพลาด:</strong></p>
<p>\${err.message}</p>
<p style="margin-top: 20px; color: #64dcff;">ตรวจสอบ:</p>
<ul style="text-align: left; display: inline-block;">
    <li>ว่าตัวแปร DATABASE_URL ถูกตั้งค่าแล้ว</li>
    <li>ว่าตาราง "students" มีอยู่ในฐานข้อมูล</li>
    <li>ว่าเชื่อมต่อฐานข้อมูล PostgreSQL ได้</li>
</ul>
</body>
</html>
        \`);
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(\`🔥 Gate of Abyss server is running on port \${PORT}\`);
    console.log(\`📊 Connected to PostgreSQL Database\`);
});

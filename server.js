const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    
    res.end(`
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>INFERNO 3D Parallax Card</title>

<style>
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    height: 100vh;
    background: #050000;
    font-family: "Segoe UI", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
    perspective: 1500px; 
}

/* 🔥 พื้นหลังตารางลาวา 3D (ขยับตามเมาส์) */
.bg-grid {
    position: absolute;
    width: 140%;
    height: 140%;
    top: -20%;
    left: -20%;
    background-image: 
        linear-gradient(rgba(255, 80, 0, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 80, 0, 0.06) 1px, transparent 1px);
    background-size: 50px 50px;
    transform: perspective(500px) rotateX(60deg) translateY(0);
    z-index: 1;
    transition: transform 0.2s ease-out;
}

/* เรืองแสงแดงส้มด้านหลังคล้ายเปลวไฟลอยขึ้น */
.bg-glow {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 100%, rgba(255, 60, 0, 0.35) 0%, transparent 55%);
    z-index: 0;
    pointer-events: none;
}

/* ⚡ ตัวครอบการ์ดแบบ 3D Tilt */
.card-wrapper {
    position: relative;
    z-index: 10;
    transform-style: preserve-3d;
    transition: transform 0.1s ease-out;
}

.card-inner {
    width: 440px;
    height: 620px;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card-inner.flipped {
    transform: rotateY(180deg);
}

.card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 20px;
    overflow: hidden;
    background: #0a0000;
    box-shadow: 0 15px 45px rgba(255, 40, 0, 0.35);
    transform-style: preserve-3d;
}

/* ขอบเปลวไฟวิ่งรอบตัวการ์ด */
.card-face::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(#ff2200, #ffaa00, #ff2200, #7a0000, #ff2200);
    animation: laserRotate 4s linear infinite;
    z-index: 1;
}

@keyframes laserRotate {
    100% { transform: rotate(360deg); }
}

.card-content {
    position: absolute;
    inset: 4px;
    background: rgba(15, 4, 2, 0.96);
    border-radius: 16px;
    z-index: 2;
    padding: 35px 25px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    backdrop-filter: blur(10px);
    transform: translateZ(50px);
}

/* ================= FRONT: PROFILE PAGE ================= */
.front-card {
    transform: rotateY(0deg);
}

.hologram-avatar {
    width: 130px;
    height: 130px;
    margin: 0 auto;
    border: 2px solid #ff2200;
    border-radius: 50%;
    position: relative;
    background: radial-gradient(circle, rgba(255, 90, 0, 0.15) 0%, transparent 70%);
    box-shadow: 0 0 25px rgba(255, 60, 0, 0.55);
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateZ(30px);
}

.hologram-avatar::after {
    content: "";
    position: absolute;
    width: 90%;
    height: 3px;
    background: #ffaa00;
    box-shadow: 0 0 12px #ffaa00;
    animation: laserScan 2.5s ease-in-out infinite;
}

/* หน้ากากปีศาจแทนหน้ากากไซบอร์ก */
.mask-core {
    width: 60px;
    height: 70px;
    border: 3px solid #ff2200;
    border-top: none;
    border-radius: 0 0 30px 30px;
    position: relative;
    box-shadow: 0 5px 18px rgba(255, 40, 0, 0.45);
}

.mask-core::before, .mask-core::after {
    /* เขาปีศาจ */
    content: "";
    position: absolute;
    width: 14px;
    height: 30px;
    background: linear-gradient(#ffaa00, #ff2200);
    top: -26px;
    border-radius: 50% 50% 0 0;
    box-shadow: 0 0 8px rgba(255, 100, 0, 0.6);
}
.mask-core::before { left: 4px; transform: rotate(-18deg); }
.mask-core::after { right: 4px; transform: rotate(18deg); }

@keyframes laserScan {
    0%, 100% { top: 10%; }
    50% { top: 90%; }
}

h1 {
    font-family: 'Impact', sans-serif;
    font-size: 30px;
    margin: 15px 0 0 0;
    letter-spacing: 2px;
    background: linear-gradient(90deg, #ffaa00, #ff2200);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transform: translateZ(25px);
}

.system-status {
    font-family: monospace;
    font-size: 11px;
    color: #ff5500;
    letter-spacing: 3px;
    margin-bottom: 20px;
}

.data-slot {
    background: rgba(255, 60, 0, 0.03);
    border: 1px solid rgba(255, 60, 0, 0.25);
    padding: 12px 18px;
    border-radius: 8px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    transition: 0.3s;
    transform: translateZ(20px);
}

.data-slot::before {
    content: "🔥";
    font-size: 10px;
    position: absolute;
    left: 8px;
}

.data-slot:hover {
    background: rgba(255, 60, 0, 0.1);
    border-color: #ff5500;
    transform: translateZ(35px) scale(1.02);
}

.data-slot span {
    font-family: monospace;
    color: #a88;
    font-size: 11px;
    padding-left: 14px;
}

.data-slot b {
    color: #fff;
    font-size: 17px;
}

/* ================= BACK: GAME PAGE ================= */
.back-card {
    transform: rotateY(180deg);
}

.game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ff5500;
    font-family: monospace;
    font-size: 14px;
    border-bottom: 1px solid rgba(255, 60, 0, 0.25);
    padding-bottom: 10px;
    margin-bottom: 10px;
}

#gameCanvas {
    background: #0a0202;
    border: 2px solid rgba(255, 60, 0, 0.45);
    border-radius: 10px;
    cursor: crosshair;
    display: block;
    margin: 0 auto;
    box-shadow: inset 0 0 20px rgba(120, 0, 0, 0.8);
    transform: translateZ(10px);
}

.game-instruction {
    font-size: 12px;
    color: #a88;
    margin-top: 5px;
    font-style: italic;
}

/* ================= CONTROLS ================= */
.action-button {
    margin-top: 15px;
    background: transparent;
    border: 1px solid #ff2200;
    padding: 10px 35px;
    border-radius: 5px;
    color: #ff5500;
    font-family: "Impact", sans-serif;
    font-size: 18px;
    letter-spacing: 2px;
    cursor: pointer;
    transition: 0.3s;
    outline: none;
    transform: translateZ(15px);
}

.action-button:hover {
    background: #ff2200;
    color: #000;
    box-shadow: 0 0 28px #ff2200;
    transform: translateZ(30px) scale(1.05);
}

.gold-btn {
    border-color: #ffaa00;
    color: #ffaa00;
}
.gold-btn:hover {
    background: #ffaa00;
    color: #200;
    box-shadow: 0 0 28px #ffaa00;
}
</style>

</head>
<body>

<div class="bg-glow"></div>
<div class="bg-grid" id="bgGrid"></div>

<div class="card-wrapper" id="cardWrapper">
    <div class="card-inner" id="cardInner">
        
        <!-- ================= FRONT: PROFILE ================= -->
        <div class="card-face front-card">
            <div class="card-content">
                <div class="hologram-avatar">
                    <div class="mask-core"></div>
                </div>

                <div>
                    <h1>KIRDCHAI</h1>
                    <div class="system-status">INFERNO.SOUL_SYS // ACTIVE</div>
                </div>

                <div class="info-group">
                    <div class="data-slot">
                        <span>USER_NAME</span>
                        <b>เกิดไชย์ พรหมบรรดาโชค</b>
                    </div>
                    <div class="data-slot">
                        <span>STUDENT_ID</span>
                        <b>69319011248</b>
                    </div>
                </div>

                <div class="footer-section">
                    <div style="font-size: 13px; color: #a88; margin-bottom: 5px;">「地獄へようこそ。」</div>
                    <button class="action-button" onclick="toggleCard()">PLAY GAME 🔥</button>
                </div>
            </div>
        </div>

        <!-- ================= BACK: MINI GAME ================= -->
        <div class="card-face back-card">
            <div class="card-content">
                <div class="game-header">
                    <div>SCORE: <span id="currentScore" style="color:#ffaa00; font-weight:bold;">0</span></div>
                    <div>HIGH SCORE: <span id="highScore" style="color:#ff2200; font-weight:bold;">0</span></div>
                </div>

                <canvas id="gameCanvas" width="370" height="320"></canvas>
                <div class="game-instruction">คลิก/แตะที่ลูกไฟเพื่อเดาะไม่ให้ตกลงนรก!</div>

                <div class="footer-section">
                    <button class="action-button gold-btn" onclick="toggleCard()">BACK TO PROFILE</button>
                </div>
            </div>
        </div>

    </div>
</div>

<script>
// ================= ระบบ 3D PARALLAX =================
const body = document.body;
const cardWrapper = document.getElementById('cardWrapper');
const bgGrid = document.getElementById('bgGrid');

body.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const deltaX = (e.clientX - centerX) / centerX;
    const deltaY = (e.clientY - centerY) / centerY;
    
    const rotateY = deltaX * 25;
    const rotateX = -deltaY * 25;
    
    cardWrapper.style.transform = \`rotateX(\${rotateX}deg) rotateY(\${rotateY}deg)\`;
    
    const bgX = -deltaX * 30;
    const bgY = -deltaY * 30;
    bgGrid.style.transform = \`perspective(500px) rotateX(60deg) translate(\${bgX}px, \${bgY}px)\`;
});

body.addEventListener('mouseleave', () => {
    cardWrapper.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    cardWrapper.style.transform = 'rotateX(0deg) rotateY(0deg)';
    
    bgGrid.style.transition = 'transform 0.5s ease-out';
    bgGrid.style.transform = 'perspective(500px) rotateX(60deg) translate(0px, 0px)';
    
    setTimeout(() => {
        cardWrapper.style.transition = 'transform 0.1s ease-out';
        bgGrid.style.transition = 'transform 0.2s ease-out';
    }, 500);
});


// ================= ระบบสลับหน้าการ์ด =================
function toggleCard() {
    const card = document.getElementById('cardInner');
    card.classList.toggle('flipped');
    
    if(card.classList.contains('flipped')) {
        resetGame();
    }
}


// ================= ระบบเกมเดาะลูกไฟ =================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let ball = {
    x: canvas.width / 2,
    y: 100,
    radius: 20,
    vx: 2,
    vy: 0,
    gravity: 0.35,
    bounce: -9
};

let score = 0;
let highScore = 0;
let isGameOver = false;
let gameStarted = false;
let hitTextTimer = 0;

canvas.addEventListener('mousedown', function(e) {
    handleInGameClick(e);
});
canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    handleInGameClick(mouseEvent);
}, { passive: false });

function handleInGameClick(e) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (isGameOver) {
        resetGame();
        return;
    }

    if (!gameStarted) {
        gameStarted = true;
        return;
    }

    const dist = Math.hypot(clickX - ball.x, clickY - ball.y);

    if (dist < ball.radius + 25) {
        ball.vy = ball.bounce;
        ball.vx = (ball.x - clickX) * 0.4;
        
        score++;
        document.getElementById('currentScore').innerText = score;
        if (score > highScore) {
            highScore = score;
            document.getElementById('highScore').innerText = highScore;
        }

        hitTextTimer = 30;
    }
}

function resetGame() {
    ball.x = canvas.width / 2;
    ball.y = 80;
    ball.vx = (Math.random() - 0.5) * 4;
    ball.vy = 0;
    score = 0;
    document.getElementById('currentScore').innerText = score;
    isGameOver = false;
    gameStarted = false;
    hitTextTimer = 0;
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // พื้นลาวาด้านล่างเกม
    const lavaGradient = ctx.createLinearGradient(0, canvas.height - 30, 0, canvas.height);
    lavaGradient.addColorStop(0, "rgba(255,60,0,0)");
    lavaGradient.addColorStop(1, "rgba(255,60,0,0.35)");
    ctx.fillStyle = lavaGradient;
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);

    if (!gameStarted && !isGameOver) {
        ctx.fillStyle = "#ffaa00";
        ctx.font = "bold 20px monospace";
        ctx.textAlign = "center";
        ctx.fillText("CLICK TO START GAME", canvas.width / 2, canvas.height / 2);
        drawBall();
    } else if (isGameOver) {
        ctx.fillStyle = "#ff2200";
        ctx.font = "bold 26px 'Impact', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("FALLEN TO HELL", canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.fillStyle = "#fff";
        ctx.font = "14px monospace";
        ctx.fillText("CLICK TO RESTART", canvas.width / 2, canvas.height / 2 + 20);
    } else {
        ball.vy += ball.gravity;
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.vx = -ball.vx * 0.8;
        }
        if (ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width - ball.radius;
            ball.vx = -ball.vx * 0.8;
        }

        if (ball.y + ball.radius > canvas.height) {
            isGameOver = true;
        }

        drawBall();

        if (hitTextTimer > 0) {
            ctx.fillStyle = "#ffaa00";
            ctx.font = "bold 26px 'Impact', sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("BURN!!!", ball.x, ball.y - 45);
            hitTextTimer--;
        }
    }

    requestAnimationFrame(update);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius + 12, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 120, 0, 0.3)";
    ctx.fill();

    const fireGradient = ctx.createRadialGradient(ball.x, ball.y, 2, ball.x, ball.y, ball.radius);
    fireGradient.addColorStop(0, "#ffdd55");
    fireGradient.addColorStop(0.5, "#ff6600");
    fireGradient.addColorStop(1, "#ff2200");

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = fireGradient;
    ctx.strokeStyle = "#fff5cc";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius - 8, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,220,150,0.5)";
    ctx.stroke();
}

update();
</script>

</body>
</html>
    `);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Inferno 3D Parallax Server is running on port ${PORT}`);
});

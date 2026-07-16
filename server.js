const http = require('http');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  res.end(`
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TAN'S RETRO WEB STATION // 1980s</title>

      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Mitr:wght@400;700&display=swap" rel="stylesheet">

      <style>
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          /* พื้นหลังสีดำเข้มตัดกับลายเส้นตาราง Grid สีม่วงนีออนแบบ Synthwave */
          background-color: #0b071e;
          background-image: 
            linear-gradient(rgba(119, 84, 199, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(119, 84, 199, 0.1) 1px, transparent 1px);
          background-size: 30px 30px;
          font-family: "Mitr", sans-serif;
          color: #ffffff;
          padding: 20px;
        }

        /* กล่องข้อความสไตล์ Arcade Cyberpunk */
        .arcade-box {
          width: 100%;
          max-width: 650px;
          background-color: #160f30;
          padding: 40px;
          border-radius: 4px;
          /* เส้นขอบนีออนแบบเรืองแสง (Neon Glow) */
          border: 4px solid #ff007f;
          box-shadow: 0 0 20px #ff007f, inset 0 0 15px rgba(255, 0, 127, 0.5), 0 15px 35px rgba(0, 0, 0, 0.6);
          position: relative;
          overflow: hidden;
        }

        /* แถบด้านบนของกล่อง เลียนแบบหน้าจอคอมพิวเตอร์ยุคเก่า */
        .arcade-header {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          background: linear-gradient(90deg, #ff007f, #00f0ff);
          height: 8px;
        }

        .retro-title {
          font-family: "Press Start 2P", cursive;
          color: #00f0ff;
          font-size: 14px;
          text-shadow: 0 0 8px #00f0ff;
          margin-bottom: 25px;
          line-height: 1.5;
        }

        h1 {
          color: #ffff00;
          font-size: 36px;
          margin: 10px 0;
          text-shadow: 3px 3px 0px #ff007f;
          letter-spacing: 2px;
        }

        h2 {
          color: #00f0ff;
          font-size: 26px;
          margin-top: 5px;
          text-shadow: 2px 2px 0px #7754c7;
        }

        p {
          color: #e0e0e0;
          font-size: 18px;
          line-height: 1.8;
          background: rgba(0, 0, 0, 0.4);
          padding: 15px;
          border-left: 4px solid #ffff00;
          margin: 20px 0;
        }

        /* การ์ดโชว์รหัสนักศึกษาแบบตั๋วเกม Arcade */
        .player-info {
          background-color: #000000;
          border: 2px dashed #00f0ff;
          padding: 20px;
          border-radius: 4px;
          color: #00f0ff;
          font-family: "Press Start 2P", cursive;
          font-size: 11px;
          line-height: 2;
          text-align: left;
          margin: 25px 0;
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
        }

        .player-info span {
          color: #ff007f;
        }

        .thanks-msg {
          color: #ffff00;
          font-weight: bold;
          font-size: 16px;
          letter-spacing: 1px;
        }

        /* เลเซอร์กราฟิกด้านล่าง */
        .laser-line {
          height: 4px;
          background: linear-gradient(90deg, transparent, #ff007f, #ffff00, #00f0ff, transparent);
          margin-top: 25px;
        }
      </style>
    </head>
    <body>

      <div class="arcade-box">
        <div class="arcade-header"></div>

        <div class="retro-title">> INSERT COIN_</div>

        <h1>WELCOME TO NODE.JS</h1>
        <h2>สวัสดีครับ ผมชื่อ "แทน" 😎</h2>

        <p>
          [SYSTEM LOG]: เว็บไซต์นี้ขับเคลื่อนด้วยพลังงานจาก Node.js <br>
          และทำการวาร์ปมายังโลกอินเทอร์เน็ตผ่านระบบ Railway 🚀
        </p>

        <div class="player-info">
          <span>> DEVELOPER:</span>

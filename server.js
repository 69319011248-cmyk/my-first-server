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

      <title>เว็บไซต์ของแทน</title>

      <style>
        body {
          margin: 0;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: Arial, sans-serif;
          text-align: center;
          background: linear-gradient(135deg, #bde7ff, #d8c4ff, #ffd6eb);
        }

        .box {
          width: 70%;
          max-width: 600px;
          background-color: white;
          padding: 35px;
          border-radius: 30px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
          border: 5px solid #e4d5ff;
        }

        h1 {
          color: #7754c7;
          font-size: 32px;
        }

        h2 {
          color: #ff69a6;
        }

        p {
          color: #555555;
          font-size: 18px;
          line-height: 1.8;
        }

        .name {
          background-color: #f1e9ff;
          padding: 15px;
          border-radius: 20px;
          color: #6948b5;
          font-weight: bold;
        }

        .cartoon {
          font-size: 50px;
        }

        .decoration {
          margin-top: 20px;
          font-size: 28px;
        }
      </style>
    </head>

    <body>
      <div class="box">

        <div class="cartoon">✨</div>

        <h1>ยินดีต้อนรับเข้าสู่ Web Server</h1>

        <h2>สวัสดีครับ ชื่อเล่นแทน 💕</h2>

        <p>
          เว็บไซต์ของฉันทำงานด้วยระบบ Node.js<br>
          และเผยแพร่ผ่าน Railway
        </p>

        <div class="name">
          👩‍💻 จัดทำโดย นายเกิดไชย์ พรหมบรรดาโชค<br>
          รหัสนักศึกษา 69319011248
        </div>

        <p>ขอบคุณที่เข้ามาเยี่ยมชมเว็บไซต์ของแทนนะครัช 😀</p>

        <div class="decoration">
          ☁️ 😊🤢😁😀✨💕 ☁️
        </div>

      </div>
    </body>
    </html>
  `);
});

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

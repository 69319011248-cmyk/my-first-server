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
          font-family: 'Mitr', sans-serif;
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
          box-shadow: 0 0 20px #ff007f, inset 0 0 15px rgba(255, 0, 127, 0.5), 0

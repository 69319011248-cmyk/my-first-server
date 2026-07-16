const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    
    res.end(`
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HELLFIRE 3D Demonic Card</title>

<style>
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    height: 100vh;
    background: #050101;
    font-family: "Segoe UI", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
    perspective: 1500px; 
}

/* 🌋 พื้นหลังตารางลาวาและเถ้าถ่านขยับตามเมาส์ */
.bg-grid {
    position: absolute;
    width: 140%;
    height: 140%;
    top: -20%;
    left: -20%;
    background-image: 
        radial-gradient(circle at 50% 50%, rgba(255, 30, 0, 0.08) 0%, transparent 60%),
        linear-gradient(rgba(255, 68, 0, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 68, 0, 0.03) 1px, transparent 1px);
    background-size: 100% 100%, 40px 40px, 40px 40px;
    transform: perspective(500px) rotateX(60deg) translateY(0);
    z-index: 1;
    transition: transform 0.

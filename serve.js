#!/usr/bin/env node
// NAI Prompt Builder - Local Server
// Usage: node serve.js
// Then open http://localhost:3000

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const DIR = __dirname;

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".wasm": "application/wasm",
  ".onnx": "application/octet-stream",
};

const server = http.createServer((req, res) => {
  let filePath = path.join(DIR, req.url === "/" ? "nai-prompt-builder.html" : req.url);
  const ext = path.extname(filePath);
  const mime = MIME[ext] || "application/octet-stream";

  // Required headers for SharedArrayBuffer (needed for @imgly/background-removal)
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Access-Control-Allow-Origin", "*");

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found: " + req.url);
      return;
    }
    res.writeHead(200, { "Content-Type": mime });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║   NAI Prompt Builder - Local Server      ║
║                                          ║
║   http://localhost:${PORT}                  ║
║                                          ║
║   SharedArrayBuffer: ✅ enabled          ║
║   COOP/COEP headers: ✅ set             ║
║                                          ║
║   Ctrl+C to stop                         ║
╚══════════════════════════════════════════╝
  `);
});

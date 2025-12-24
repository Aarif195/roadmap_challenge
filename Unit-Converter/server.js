#!/usr/bin/env node

const http = require("http");
const fs = require("fs");
const path = require("path");
const { convertUnits } = require("./utils/converter");

const PORT = 3000;

// Helper function
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".js":
      return "application/javascript";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    default:
      return "text/plain";
  }
}

// Helper to serve static files
function serveFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 - File not found");
    } else {
      res.writeHead(200, { "Content-Type": getContentType(filePath) });
      res.end(data);
    }
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    if (req.url === "/" || req.url === "/index.html") {
      serveFile(path.join(__dirname, "views", "index.html"), res);
    } else if (req.url === "/length") {
      serveFile(path.join(__dirname, "views", "length.html"), res);
    } else if (req.url === "/weight") {
      serveFile(path.join(__dirname, "views", "weight.html"), res);
    } else if (req.url === "/temperature") {
      serveFile(path.join(__dirname, "views", "temperature.html"), res);
    }
    //  Serve static files (CSS, JS, images)
    else if (req.url.startsWith("/public/")) {
      serveFile(path.join(__dirname, req.url), res);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
    }
  }

  // Handle POST request
  else if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      const params = new URLSearchParams(body);
      const value = parseFloat(params.get("value"));
      const fromUnit = params.get("fromUnit");
      const toUnit = params.get("toUnit");
      const type = params.get("type");

      const result = convertUnits(value, fromUnit, toUnit, type);

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <h2>Converted Result</h2>
        <p>${value} ${fromUnit} = <strong>${result}</strong> ${toUnit}</p>
      `);
    });
  }
});

server.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});

#!/usr/bin/env node

const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = 4000;

//  read file (utf8)
function read(filePath) {
  return fs.promises.readFile(filePath, "utf8");
}

// Helper: Serve static or HTML files
async function serveFile(filePath, res, contentType = "text/html") {
  try {
    const data = await read(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch (err) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 - File not found");
  }
}

// Helper: Content type
function getContentType(filePath) {
  const ext = path.extname(filePath);
  const types = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
  };
  return types[ext] || "text/plain";
}

// Utility: render template tokens {{KEY}} -> value
function renderTemplate(templateString, replacements) {
  let out = templateString;
  for (const key of Object.keys(replacements)) {
    const token = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    out = out.replace(token, replacements[key]);
  }
  return out;
}

// Read all articles (returns array of objects)
async function readAllArticles() {
  const articlesDir = path.join(__dirname, "data", "articles-json");
  try {
    const files = await fs.promises.readdir(articlesDir);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));
    const articles = [];
    for (const fname of jsonFiles) {
      const filePath = path.join(articlesDir, fname);
      const raw = await read(filePath);
      try {
        const obj = JSON.parse(raw);
        articles.push(obj);
      } catch (e) {
        console.error("Skipping invalid JSON:", fname);
      }
    }
    articles.sort((a, b) => (a.id || 0) - (b.id || 0));
    return articles;
  } catch (err) {
    // If directory doesn't exist or error, return empty list
    return [];
  }
}

// Read single article by id
async function readArticleById(id) {
  const articlesDir = path.join(__dirname, "data", "articles-json");
  const filePath = path.join(articlesDir, `${id}.json`);
  try {
    const raw = await read(filePath);
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const parsed = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsed.pathname;
  const searchParams = parsed.searchParams;

  // Serve static public files
  if (pathname.startsWith("/public/")) {
    const filePath = path.join(__dirname, pathname);
    return serveFile(filePath, res, getContentType(filePath));
  }

  // ROUTES
  try {
    if (pathname === "/" || pathname === "/home") {
      // Dynamic home: read all articles and inject into template
      const templatePath = path.join(__dirname, "views", "home.html");
      let tpl = await read(templatePath).catch(() => null);
      if (!tpl) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Home template not found");
      }

      const articles = await readAllArticles();
      const items = articles
        .map((a) => {
          const title = String(a.title || "Untitled");
          const date = String(a.date || "");
          const id = a.id;
          return `<div class="homeSec">
                      <p class="bold"><a href="/article?id=${encodeURIComponent                   (id)}">${escapeHtml(
                                title
                      )}</a></p>
                      <p class="gray">${escapeHtml(date)}</p>
                </div>`;
        })
        .join("\n");

      const html = renderTemplate(tpl, { ARTICLES: items });
      res.writeHead(200, { "Content-Type": "text/html" });
      return res.end(html);
    } 
    // ARTICE
    else if (pathname === "/article") {
      const id = searchParams.get("id");
      if (!id) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return res.end("400 - article id required");
      }
      const article = await readArticleById(id);
      if (!article) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("404 - Article not found");
      }
      const tplPath = path.join(__dirname, "views", "article.html");
      let tpl = await read(tplPath).catch(() => null);
      if (!tpl) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Article template not found");
      }
    
      const html = renderTemplate(tpl, {
        TITLE: escapeHtml(String(article.title || "")),
        DATE: escapeHtml(String(article.date || "")),
        CONTENT: escapeHtml(String(article.content || "")),
      });
      res.writeHead(200, { "Content-Type": "text/html" });
      return res.end(html);
    }
    


    else if (pathname === "/admin") {
      const tplPath = path.join(__dirname, "views", "admin.html");
      let tpl = await read(tplPath).catch(() => null);
      if (!tpl) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Admin template not found");
      }

      const articles = await readAllArticles();
      const items = articles
        .map((a) => {
          const title = String(a.title || "Untitled");
          const id = a.id;
          return `
      <div class="admindetails">
            <p class="bold">${escapeHtml(title)}</p>
        <div class="delEdit">
            <a class="gray cursor" href="/delete?id=${id} ">Delete</a>
            <a class="gray cursor" href="/edit?id=${id}">Edit</ a>
         </div>
      </div>`;
        })
        .join("\n");

      const html = renderTemplate(tpl, { ADMIN_ARTICLES: items });
      res.writeHead(200, { "Content-Type": "text/html" });
      return res.end(html);
    }
    // DELETE an article
    else if (pathname === "/delete") {
      const id = searchParams.get("id");
      if (!id) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return res.end("Missing article id");
      }

      const filePath = path.join(
        __dirname,
        "data",
        "articles-json",
        `${id}.json`
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          return res.end("Article not found");
        }
        // After deleting, redirect back to admin page
        res.writeHead(302, { Location: "/admin" });
        res.end();
      });
    }

    // EDIT
    else if (pathname === "/edit") {
      const id = searchParams.get("id");
      if (!id) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return res.end("Missing article id");
      }

      const filePath = path.join(
        __dirname,
        "data",
        "articles-json",
        `${id}.json`
      );
      fs.readFile(filePath, "utf8", async (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          return res.end("Article not found");
        }

        const article = JSON.parse(data);
        const tplPath = path.join(__dirname, "views", "edit.html");
        const tpl = await read(tplPath).catch(() => null);

        if (!tpl) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          return res.end("Edit template not found");
        }

        // Fill form placeholders

        const html = tpl
          .replace("{{ID}}", article.id)
          .replace("{{TITLE}}", article.title)
          .replace("{{DATE}}", article.date)
          .replace("{{CONTENT}}", article.content);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
      });
    } 
    
    // UPDATE
    else if (pathname === "/update" && req.method === "POST") {
      const id = searchParams.get("id");
      if (!id) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return res.end("Missing article id");
      }

      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", async () => {
        const params = new URLSearchParams(body);
        const title = params.get("title");
        const date = params.get("date");
        const content = params.get("content");

        const filePath = path.join(
          __dirname,
          "data",
          "articles-json",
          `${id}.json`
        );
        const newArticle = { id, title, date, content };

        fs.writeFile(filePath, JSON.stringify(newArticle, null, 2), (err) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            return res.end("Error updating article");
          }
          res.writeHead(302, { Location: "/admin" });
          res.end();
        });
      });
    } 
    
    else if (pathname === "/new") {
      if (req.method === "GET") {
        // Show the form
        return serveFile(path.join(__dirname, "views", "new.html"), res);
      } else if (req.method === "POST") {
        // Collect form data
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", async () => {
          const params = new URLSearchParams(body);
          const title = params.get("title");
          const date = params.get("date");
          const content = params.get("content");

          if (!title || !date || !content) {
            res.writeHead(400, { "Content-Type": "text/plain" });
            return res.end("All fields are required!");
          }

          // Generate new article ID
          const articlesDir = path.join(__dirname, "data", "articles-json");
          const files = await fs.promises.readdir(articlesDir);
          const nextId = files.length + 1;

          const newArticle = {
            id: nextId,
            title,
            date,
            content,
          };

          // Write JSON file
          const filePath = path.join(articlesDir, `${nextId}.json`);
          await fs.promises.writeFile(
            filePath,
            JSON.stringify(newArticle, null, 2),
            "utf8"
          );

          // Redirect to admin page
          res.writeHead(302, { Location: "/admin" });
          res.end();
        });
      }
    }

    // LOGIN
    else if (pathname === "/login" && req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        const params = new URLSearchParams(body);
        const username = params.get("username");
        const password = params.get("password");

        // Simple hardcoded check
        if (username === "admin" && password === "1234") {
          res.writeHead(302, { Location: "/admin" });
          res.end();
        } else {
          res.writeHead(401, { "Content-Type": "text/plain" });
          res.end("Invalid credentials");
        }
      });
    } else if (pathname === "/login") {
      const loginPath = path.join(__dirname, "views", "login.html");
      if (fs.existsSync(loginPath)) {
        return serveFile(loginPath, res);
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        return res.end("<p>Login page not created yet</p>");
      }
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("404 - Page Not Found");
    }
  } catch (err) {
    console.error("Server error:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("500 - Internal Server Error");
  }
});

// small helper to escape HTML
function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

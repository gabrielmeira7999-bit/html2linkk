const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.PUBLIC_BASE_URL || "";
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "pages.json");

fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, "{}");

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

function readDB() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, "utf8")); }
  catch { return {}; }
}
function writeDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}
function makeCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let code = "";
  do {
    code = "";
    const bytes = crypto.randomBytes(7);
    for (let i = 0; i < 7; i++) code += chars[bytes[i] % chars.length];
  } while (readDB()[code]);
  return code;
}
function publicBase(req) {
  return HOST.replace(/\/$/, "") || `${req.protocol}://${req.get("host")}`;
}

app.post("/api/pages", (req, res) => {
  const html = typeof req.body.html === "string" ? req.body.html : "";
  if (!html.trim()) return res.status(400).json({ error: "HTML vazio." });
  if (html.length > 800000) return res.status(413).json({ error: "HTML grande demais. Limite: 800 KB." });

  const code = makeCode();
  const db = readDB();
  db[code] = {
    html,
    createdAt: new Date().toISOString()
  };
  writeDB(db);

  res.json({
    code,
    url: `${publicBase(req)}/p/${code}`
  });
});

app.get("/api/pages/:code", (req, res) => {
  const page = readDB()[req.params.code];
  if (!page) return res.status(404).json({ error: "Página não encontrada." });
  res.json({ code: req.params.code, createdAt: page.createdAt, html: page.html });
});

// Serve o HTML salvo como uma página pública.
app.get("/p/:code", (req, res) => {
  const page = readDB()[req.params.code];
  if (!page) return res.status(404).send("<h1>Página não encontrada</h1>");
  res.type("html").send(page.html);
});

app.listen(PORT, () => {
  console.log(`HTML2Link rodando na porta ${PORT}`);
});
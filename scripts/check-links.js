// 扫描所有 HTML 的内部链接，报告目标文件不存在的 404 风险
const fs = require("fs");
const path = require("path");

const Root = path.join(__dirname, "..");
const SKIP = new Set(["/feed/", "/about/", "/privacy/", "/contact/", "/terms/", "/disclaimer/", "/cookies/"]);

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === ".git" || e.name === "node_modules" || e.name === "scripts") continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".html")) files.push(p);
  }
})(Root);

const RE = /href="(\/[^"#?]*)"/g;
const bad = [];
for (const f of files) {
  const s = fs.readFileSync(f, "utf8");
  for (const m of s.matchAll(RE)) {
    const h = m[1];
    if (SKIP.has(h)) continue;
    const rel = h.replace(/^\//, "").replace(/\/$/, "");
    if (/\.[a-z0-9]{2,5}$/i.test(rel)) {
      if (!fs.existsSync(path.join(Root, rel))) bad.push(path.relative(Root, f) + " -> " + h);
      continue;
    }
    const cands = [rel ? rel + ".html" : "index.html", path.join(rel, "index.html")];
    if (!cands.some((c) => fs.existsSync(path.join(Root, c)))) {
      bad.push(path.relative(Root, f) + " -> " + h);
    }
  }
}

console.log("页面数 " + files.length + "，失效内链 " + bad.length);
bad.slice(0, 20).forEach((b) => console.log("  " + b));
if (bad.length) process.exitCode = 1;
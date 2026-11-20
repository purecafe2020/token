// 品牌更名：AI Token 羊毛日报 → Token 日报（幂等）
const fs = require("fs");

const files = ["index.html", "build-seo.js", "make-og-image.ps1", "README.md", "DEPLOY.md", "ACCESS.md", "MIRROR.md", "scripts/make-og-image.ps1", "scripts/build-seo.js"];
let changed = 0;

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let text = fs.readFileSync(f, "utf8");
  const before = text;
  text = text.replace(/AI Token 羊毛日报/g, "Token 日报");
  if (text !== before) { fs.writeFileSync(f, text, "utf8"); changed++; }
}

// 首页：标题、顶部标识、副标题更明确
const file = "index.html";
let html = fs.readFileSync(file, "utf8");
const before = html;

html = html.replace(
  "<title>Token 日报 · 免费大模型 API 额度与优惠每日更新</title>",
  "<title>Token 日报 · 免费 AI 额度与优惠每日更新</title>"
);
html = html.replace(
  'content="Token 日报 · 每日更新的免费大模型 API 额度与优惠"',
  'content="Token 日报 · 每日更新的免费 AI 额度与优惠"'
);
html = html.replace(
  '<span class="badge-ver">什么值得买 · 每日核实版</span>',
  '<span class="badge-ver">免费额度 · 限时优惠 · 每日核实</span>'
);
html = html.replace(
  /<div class="subtitle">[\s\S]*?<\/div>/,
  '<div class="subtitle">\n      国内外大模型 API 的免费 Token、限时优惠与新用户试用金 —— 只收录能对上官方文档的，附带截止时间与坑点。\n    </div>'
);

if (html !== before) { fs.writeFileSync(file, html, "utf8"); changed++; }
console.log("品牌替换完成，涉及文件: " + changed);
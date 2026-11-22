// 生成 /feed/ 编辑精选页，并把条目数写回首页入口
const fs = require("fs");
const path = require("path");

const ORIGIN = "https://token.879879.xyz";
const Root = path.join(__dirname, "..");
const feed = JSON.parse(fs.readFileSync(path.join(Root, "data", "feed.json"), "utf8"));

const css = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#f4f5f7;color:#1f2329;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;line-height:1.8;font-size:15px}
  header{background:linear-gradient(120deg,#ff5a00,#ffb300);color:#fff;padding:16px 0}
  .wrap{max-width:780px;margin:0 auto;padding:0 20px}
  header .wrap{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
  header a{color:#fff;text-decoration:none;font-weight:800}
  header nav a{font-weight:400;font-size:13px;margin-right:12px;opacity:.95}
  main{background:#fff;margin:20px auto;max-width:780px;padding:28px 26px;border-radius:10px;border:1px solid #ebedf0}
  h1{font-size:22px;margin-bottom:6px}
  .meta{color:#8a8f99;font-size:12px;margin-bottom:18px}
  article{padding:16px 0;border-bottom:1px solid #f0f1f3}
  article:last-child{border-bottom:0}
  h2{font-size:16px;margin-bottom:6px;line-height:1.55}
  .src{font-size:12px;color:#8a8f99;margin-bottom:6px}
  .note{color:#3c4149;margin-bottom:8px}
  .link{font-size:13px}
  a{color:#2b6de5}
  footer{text-align:center;color:#8a8f99;font-size:12px;padding:18px 0 40px}
  footer a{color:#8a8f99;margin:0 6px}
`;

const items = feed.items.map((it) => `  <article>
    <h2>${it.title}</h2>
    <div class="src">${it.source} · ${it.date}</div>
    <div class="note">${it.note}</div>
    <div class="link"><a href="${it.url}" target="_blank" rel="noopener">查看来源 ↗</a></div>
  </article>`).join("\n");

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>今日情报 - Token 日报</title>
<meta name="description" content="每天 3 条 AI 开发者情报：GitHub 热榜、Hugging Face 热门模型、linux.do 讨论，附一句编辑点评与来源。">
<link rel="canonical" href="${ORIGIN}/feed/">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<style>${css}</style>
</head>
<body>
<header><div class="wrap"><a href="/">Token 日报</a><nav><a href="/feed/">情报</a><a href="/guides/">指南</a><a href="/about/">关于</a><a href="/contact/">联系</a></nav></div></header>
<main>
<h1>今日情报</h1>
<div class="meta">最后更新：${feed.updated} · 每天 3 条 · 编辑精选，不是自动抓取</div>
${items}
</main>
<footer><div><a href="/">返回首页</a><a href="/guides/">指南</a><a href="/en/">English</a></div></footer>
</body>
</html>`;

fs.mkdirSync(path.join(Root, "feed"), { recursive: true });
fs.writeFileSync(path.join(Root, "feed", "index.html"), html, "utf8");
console.log("生成 feed/index.html（" + feed.items.length + " 条）");

// 首页入口
const indexPath = path.join(Root, "index.html");
let idx = fs.readFileSync(indexPath, "utf8");
const bar = `<!--FEED:START--><div class="feed-bar"><a href="/feed/">今日情报 ${feed.items.length} 条 →</a><span>GitHub 热榜 / HF 模型 / linux.do 讨论，附编辑点评</span></div><!--FEED:END-->`;
if (/<!--FEED:START-->[\s\S]*?<!--FEED:END-->/.test(idx)) {
  idx = idx.replace(/<!--FEED:START-->[\s\S]*?<!--FEED:END-->/, () => bar);
} else {
  idx = idx.replace('<div class="toolbar">', bar + '\n\n  <div class="toolbar">');
}
fs.writeFileSync(indexPath, idx, "utf8");
console.log("首页入口已更新");
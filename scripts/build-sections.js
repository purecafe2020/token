// 生成四个栏目页：/credits/ /compute/ /data/ /use-cases/（先 noindex）
const fs = require("fs");
const path = require("path");

const ORIGIN = "https://token.879879.xyz";
const Root = path.join(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(Root, "data", "sections.json"), "utf8"));

const html = fs.readFileSync(path.join(Root, "index.html"), "utf8");
const dm = html.match(/const DEALS = (\[[\s\S]*?\n\]);/);
const DEALS = dm ? eval(dm[1]) : [];
const strip = (s) => String(s).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

const css = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#f4f5f7;color:#1f2329;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;line-height:1.7;font-size:15px}
  header{background:linear-gradient(120deg,#ff5a00,#ffb300);color:#fff;padding:16px 0}
  .wrap{max-width:820px;margin:0 auto;padding:0 20px}
  header .wrap{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
  header a{color:#fff;text-decoration:none;font-weight:800}
  header nav a{font-weight:400;font-size:13px;margin-right:12px;opacity:.95}
  main{background:#fff;margin:20px auto;max-width:820px;padding:28px 26px;border-radius:10px;border:1px solid #ebedf0}
  h1{font-size:23px;margin-bottom:6px}
  .desc{color:#5f6672;font-size:13.5px;margin-bottom:16px}
  .note-top{font-size:12px;color:#9a6b00;background:#fff8e6;border-left:3px solid #ffc53d;padding:6px 10px;border-radius:0 4px 4px 0;margin-bottom:18px}
  .item{padding:14px 0;border-bottom:1px solid #f0f1f3}
  .item:last-child{border-bottom:0}
  .item h2{font-size:15.5px;margin-bottom:4px;line-height:1.5}
  .value{font-size:13px;color:#e4393c;font-weight:700;margin-bottom:4px}
  .note{color:#3c4149;font-size:13.5px;margin-bottom:6px}
  .src{font-size:12px;color:#8a8f99}
  .src a{color:#2b6de5}
  footer{text-align:center;color:#8a8f99;font-size:12px;padding:18px 0 40px}
  footer a{color:#8a8f99;margin:0 6px}
`;

function page(name, desc, items) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${name} - Token 日报</title>
<meta name="description" content="${desc}">
<meta name="robots" content="noindex,follow">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<style>${css}</style>
</head>
<body>
<header><div class="wrap"><a href="/">Token 日报</a><nav><a href="/credits/">额度</a><a href="/compute/">算力</a><a href="/data/">数据</a><a href="/use-cases/">场景</a><a href="/guides/">指南</a></nav></div></header>
<main>
<h1>${name}</h1>
<div class="desc">${desc}</div>
<div class="note-top">本栏目正在建设，内容持续补充中；页面暂不参与搜索收录。</div>
${items}
</main>
<footer><div><a href="/">返回首页</a><a href="/feed/">情报</a><a href="/en/">English</a></div></footer>
</body>
</html>`;
}

function itemHtml(it) {
  return `  <div class="item">
    <h2>${it.title}</h2>
    <div class="value">${it.value}</div>
    <div class="note">${it.note}</div>
    <div class="src">来源：<a href="${it.url}" target="_blank" rel="noopener">${it.source} ↗</a></div>
  </div>`;
}

// compute / data / use-cases
for (const [slug, sec] of Object.entries(data.sections)) {
  const items = sec.items.map(itemHtml).join("\n");
  const dir = path.join(Root, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), page(sec.name, sec.desc, items), "utf8");
  console.log("生成 " + slug + "/index.html（" + sec.items.length + " 条）");
}

// credits：从 DEALS 生成
const creditItems = DEALS.map((d) => `  <div class="item">
    <h2>${d.platform}｜${strip(d.title)}</h2>
    <div class="value">${d.value}</div>
    <div class="note">${strip(d.desc)}</div>
    <div class="src">${d.deadline ? "截止 " + d.deadline : d.deadlineNote} · <a href="${d.link}" target="_blank" rel="noopener">官方来源 ↗</a></div>
  </div>`).join("\n");

fs.mkdirSync(path.join(Root, "credits"), { recursive: true });
fs.writeFileSync(
  path.join(Root, "credits", "index.html"),
  page("额度", "免费 Token、试用金与限时优惠的完整清单，每天核实更新。额度以官方页面为准。", creditItems),
  "utf8"
);
console.log("生成 credits/index.html（" + DEALS.length + " 条）");
// 生成静态 SEO 内容：JSON-LD + noscript 清单 + sitemap lastmod
// 由 publish.ps1 在发布前调用；幂等，内容无变化时不写文件
const fs = require("fs");

const FILE = "index.html";
const ORIGIN = "https://token.879879.xyz";
let html = fs.readFileSync(FILE, "utf8");

const dm = html.match(/const DEALS = (\[[\s\S]*?\n\]);/);
if (!dm) {
  console.error("FAIL: 找不到 DEALS 数据块");
  process.exit(1);
}
const DEALS = eval(dm[1]);

const um = html.match(/const UPDATED = "(\d{4}-\d{2}-\d{2})/);
const updated = um ? um[1] : new Date().toISOString().slice(0, 10);

const strip = (s) => String(s).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const ld = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Token 日报",
  description: "已核实的免费大模型 API 额度与限时优惠清单",
  url: ORIGIN + "/",
  numberOfItems: DEALS.length,
  itemListElement: DEALS.map((d, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: strip(d.title),
    url: ORIGIN + "/#" + d.id,
    description: strip(d.desc),
  })),
};

const items = DEALS.map((d) => {
  const meta = `${d.platform}｜${d.value}｜${d.deadline ? "截止 " + d.deadline : d.deadlineNote}`;
  return `    <li><a href="${esc(d.link)}">${esc(strip(d.title))}</a><br><span>${esc(meta)}</span></li>`;
}).join("\n");

const block = `
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<noscript>
<section>
<h2>今日收录的 ${DEALS.length} 条免费额度与优惠</h2>
<ul>
${items}
</ul>
<p>本页主体使用 JavaScript 渲染，以上为无脚本环境的文字版清单。</p>
</section>
</noscript>
`;

const marker = /<!--SEO:START-->[\s\S]*?<!--SEO:END-->/;
if (!marker.test(html)) {
  console.error("FAIL: 找不到 SEO 标记");
  process.exit(1);
}
const next = html.replace(marker, `<!--SEO:START-->${block}<!--SEO:END-->`);

if (next === html) {
  console.log("SEO 无变化（" + DEALS.length + " 条）");
} else {
  fs.writeFileSync(FILE, next, "utf8");
  console.log("SEO 已更新（" + DEALS.length + " 条）");
}

// 栏目详情页（有 detail 的条目）自动进 sitemap
const slugit = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
let detailUrls = "";
try {
  const secs = JSON.parse(fs.readFileSync("data/sections.json", "utf8")).sections;
  for (const [k, sec] of Object.entries(secs)) {
    for (const it of sec.items || []) {
      if (!it.detail) continue;
      detailUrls += `  <url>
    <loc>${ORIGIN}/${k}/${it.slug || slugit(it.title)}/</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
    }
  }
} catch (e) {
  console.log("跳过详情页 sitemap：" + e.message);
}

// sitemap 的 lastmod 跟随页面最后核实日期
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${ORIGIN}/</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${ORIGIN}/credits/</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${ORIGIN}/compute/</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
${detailUrls}
  <url>
    <loc>${ORIGIN}/data/</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${ORIGIN}/use-cases/</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${ORIGIN}/feed/</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${ORIGIN}/guides/</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${ORIGIN}/guides/free-gpu-quota-comparison/</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${ORIGIN}/guides/qiniu-conatus-free-tokens/</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${ORIGIN}/guides/aliyun-bailian-free-tokens/</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${ORIGIN}/guides/openrouter-free-models/</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${ORIGIN}/guides/black-friday-ai-credits-calendar/</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${ORIGIN}/about/</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${ORIGIN}/privacy/</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${ORIGIN}/contact/</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${ORIGIN}/en/about/</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${ORIGIN}/en/privacy/</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${ORIGIN}/en/contact/</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
`;
if (!fs.existsSync("sitemap.xml") || fs.readFileSync("sitemap.xml", "utf8") !== sitemap) {
  fs.writeFileSync("sitemap.xml", sitemap, "utf8");
  console.log("sitemap.xml 已更新（lastmod " + updated + "）");
} else {
  console.log("sitemap.xml 无变化");
}
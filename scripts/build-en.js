// 生成英文站 en/index.html：复用同一套模板与数据，替换静态文案
const fs = require("fs");
let h = fs.readFileSync("index.html", "utf8");

const P = [
  ['<a class="top-nav" href="/guides/">指南</a>', '<a class="top-nav" href="/guides/">Guides</a>'],
  ['content="https://token.879879.xyz/og-image.png"', 'content="https://token.879879.xyz/og-image-en.png"'],
  ['<html lang="zh-CN">', '<html lang="en">'],
  ['<title>Token 日报 · 免费 AI 额度与优惠每日更新</title>',
   '<title>Token Daily - Free AI Credits and API Deals, Updated Daily</title>'],
  ['content="每天核实并整理国内外大模型 API 的免费 Token 额度、限时优惠与新用户试用金，标注截止时间、限速与坑点，附可追溯的官方来源。"',
   'content="A daily verified list of free tokens, limited-time offers and trial credits for LLM APIs, with deadlines, rate limits and caveats, each linked to an official source."'],
  ['content="免费API,免费Token,大模型API,AI额度,API优惠,OpenRouter,GLM,千问,Gemini,Groq"',
   'content="free AI API,free LLM API,free tokens,API credits,OpenRouter,GLM,Qwen,Gemini,Groq"'],
  ['content="Token 日报"', 'content="Token Daily"'],
  ['content="Token 日报 · 每日更新的免费 AI 额度与优惠"',
   'content="Token Daily - Free AI credits and API deals, updated daily"'],
  ['content="已核实的最新免费额度与限时优惠，标注截止时间、限速与坑点。"',
   'content="Verified free credits and limited-time deals, with deadlines, rate limits and caveats."'],
  ['content="每日更新的免费大模型 API 额度与优惠"',
   'content="Free LLM API credits and deals, updated daily"'],
  ['content="Token 日报：已核实的免费额度与优惠"',
   'content="Token Daily: verified free credits and deals"'],
  ['<h1>Token 日报</h1>', '<h1>Token Daily</h1>'],
  ['<a class="lang-switch" href="/en/">EN</a>', '<a class="lang-switch" href="/">中文</a>'],
  ['<span class="badge-ver">免费额度 · 限时优惠 · 每日核实</span>',
   '<span class="badge-ver">Free credits · Limited deals · Verified daily</span>'],
  ['国内外大模型 API 的免费 Token、限时优惠与新用户试用金 —— 只收录能对上官方文档的，附带截止时间与坑点。',
   'Free tokens, limited-time offers and trial credits from LLM API providers - every entry verified against an official source, with deadlines and caveats.'],
  ['今日精选 <small>力度最大、最值得现在动手的 3 条</small>',
   'Top picks <small>Biggest value, worth acting on now</small>'],
  ['>全部<', '>All<'],
  ['>限时活动<', '>Limited<'],
  ['>永久免费<', '>Free<'],
  ['>试用金<', '>Trial<'],
  ['>避坑 / 已失效<', '>Avoid<'],
  ['>国内外<', '>Global<'],
  ['>国内<', '>China<'],
  ['>海外<', '>Overseas<'],
  ['>全部用途<', '>All uses<'],
  ['>编码/Agent<', '>Coding/Agent<'],
  ['>通用文本<', '>General text<'],
  ['>多模态<', '>Multimodal<'],
  ['>充值优惠<', '>Top-up deals<'],
  ['placeholder="搜平台 / 模型 / 关键词"', 'placeholder="Search platform / model / keyword"'],
  ['>按截止时间<', '>By deadline<'],
  ['>按力度<', '>By value<'],
  ['>按平台名<', '>By platform<'],
  ['<h4>怎么读这个看板</h4>', '<h4>How to read this board</h4>'],
  ['<li><b>已核实</b>＝关键数字能在官方文档/官方活动页找到；<b>部分核实</b>＝官方入口确实存在，但额度数字来自第三方实测；<b>待核实</b>＝入口真实，数字请自行在控制台确认。</li>',
   '<li><b>Verified</b> = key numbers found in official docs or campaign pages; <b>Partly verified</b> = entry exists but numbers come from third-party checks; <b>Unverified</b> = entry is real, confirm the numbers in the console.</li>'],
  ['<li>侧栏「剩余」按本机时间实时计算，绿色为充裕、红色为 7 天内到期；无固定日期的活动标注「相对期限」。</li>',
   '<li>Days left are calculated live; red means expiring within 7 days. Campaigns without a fixed date show a relative window.</li>'],
  ['<li>免费额度通常限速（RPM/RPD）、限并发，且免费层数据可能被用于模型改进 —— 别拿它跑生产或传客户数据。</li>',
   '<li>Free tiers are rate-limited (RPM/RPD) and may use your data for model improvement - do not run production traffic or send customer data through them.</li>'],
  ['<li>同一条目一旦官方下线，会移入「避坑 / 已失效」，保留旧记录用于分辨过期教程。</li>',
   '<li>Entries removed by the provider move to Avoid, kept so you can recognise outdated tutorials.</li>'],
  ['<div style="margin-top:6px">主站：<a href="https://token.879879.xyz" target="_blank" rel="noopener" style="color:#2b6de5">token.879879.xyz</a> · 国内备用：<a href="https://dizzy-roadrunner-d4ecxir07e8ea5d-1251001596.tcloudbaseapp.com/" target="_blank" rel="noopener" style="color:#2b6de5">CloudBase 镜像</a> · <a href="/en/" style="color:#2b6de5">English</a></div>',
   '<div style="margin-top:6px">Primary: <a href="https://token.879879.xyz" target="_blank" rel="noopener" style="color:#2b6de5">token.879879.xyz</a> · CN mirror: <a href="https://dizzy-roadrunner-d4ecxir07e8ea5d-1251001596.tcloudbaseapp.com/" target="_blank" rel="noopener" style="color:#2b6de5">CloudBase</a> · <a href="/" style="color:#2b6de5">中文</a></div>'],
  ['<div>本页数据由每日检索生成 · 收录标准：可复现的领取入口 + 可追溯的官方来源</div>',
   '<div>Rebuilt from a daily research pass: every entry needs a reproducible claim link and a traceable official source.</div>'],
  ['<div style="margin-top:4px"><a href="/guides/" style="color:#2b6de5">指南</a> · <a href="/about/" style="color:#2b6de5">关于</a> · <a href="/privacy/" style="color:#2b6de5">隐私政策</a> · <a href="/contact/" style="color:#2b6de5">联系</a></div>',
   '<div style="margin-top:4px"><a href="/guides/" style="color:#2b6de5">Guides</a> · <a href="/en/about/" style="color:#2b6de5">About</a> · <a href="/en/privacy/" style="color:#2b6de5">Privacy</a> · <a href="/en/contact/" style="color:#2b6de5">Contact</a></div>'],
  ['<div>额度、价格与活动规则可能随时调整，领取前请以官方控制台为准</div>',
   '<div>Quotas, prices and rules change; always confirm in the provider console before claiming.</div>'],
];

let miss = [];
for (const [a, b] of P) {
  if (!h.includes(a)) { miss.push(a.slice(0, 46)); continue; }
  h = h.split(a).join(b);
}

h = h.split('<link rel="canonical" href="https://token.879879.xyz/">')
     .join('<link rel="canonical" href="https://token.879879.xyz/en/">');
h = h.split('content="https://token.879879.xyz/"')
     .join('content="https://token.879879.xyz/en/"');
h = h.replace(/<!--FEED:START-->[\s\S]*?<!--FEED:END-->/, () => `<!--FEED:START--><div class="feed-bar"><a href="/feed/">Today's feed →</a><span>GitHub trending / Hugging Face models / linux.do picks, with editor notes</span></div><!--FEED:END-->`);
h = h.replace(/<!--GUIDES:START-->[\s\S]*?<!--GUIDES:END-->/, () => `<!--GUIDES:START-->`);
h = h.split('<div style="margin-top:4px"><a href="/guides/" style="color:#2b6de5">指南</a>').join('<div style="margin-top:4px"><a href="/guides/" style="color:#2b6de5">Guides</a>');

// 用英文数据重建 JSON-LD 与 noscript 文本版，避免英文页混入中文
const dm = h.match(/const DEALS = (\[[\s\S]*?\n\]);/);
const D = eval(dm[1]);
const strip = (s) => String(s).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const EN = "https://token.879879.xyz/en";
const ld = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Token Daily",
  description: "Verified free LLM API credits and limited-time deals",
  url: EN + "/",
  numberOfItems: D.length,
  itemListElement: D.map((d, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: strip(d.en.t),
    url: EN + "/#" + d.id,
    description: strip(d.en.d),
  })),
};
const li = D.map((d) => `    <li><a href="${esc(d.link)}">${esc(strip(d.en.t))}</a><br><span>${esc((d.en.p || d.platform) + " | " + d.en.v + " | " + d.en.n)}</span></li>`).join("\n");
const block = `
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<noscript>
<section>
<h2>${D.length} free credits and deals, verified daily</h2>
<ul>
${li}
</ul>
<p>This page renders with JavaScript; the list above is the text version.</p>
</section>
</noscript>
`;
h = h.replace(/<!--SEO:START-->[\s\S]*?<!--SEO:END-->/, () => `<!--SEO:START-->${block}<!--SEO:END-->`);

fs.mkdirSync("en", { recursive: true });
fs.writeFileSync("en/index.html", h, "utf8");

if (miss.length) console.warn("未匹配的替换项:\n" + miss.join("\n"));

const shell = h.replace(/const DEALS = \[[\s\S]*?\n\];/, "");
const cn = (shell.match(/[\u4e00-\u9fa5]{2,}/g) || []);
const uniq = [...new Set(cn)];
console.log("en/index.html 生成完成，静态区残留中文: " + (uniq.length ? uniq.slice(0, 12).join(" / ") : "无"));
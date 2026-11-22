// 生成 AdSense 审核必需的静态页：关于 / 隐私 / 联系（中英双语）
const fs = require("fs");
const path = require("path");

const ORIGIN = "https://token.879879.xyz";
const EMAIL = "contact@879879.xyz"; // TODO: 换成你真实可收信的邮箱
const UPDATED = "2026-11-22";

const css = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#f4f5f7;color:#1f2329;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;line-height:1.75;font-size:15px}
  header{background:linear-gradient(120deg,#ff5a00,#ffb300);color:#fff;padding:18px 0}
  .wrap{max-width:760px;margin:0 auto;padding:0 20px}
  header .wrap{display:flex;align-items:center;gap:10px}
  header a{color:#fff;text-decoration:none;font-weight:800}
  main{background:#fff;margin:22px auto;max-width:760px;padding:28px 24px;border-radius:10px;border:1px solid #ebedf0}
  h1{font-size:22px;margin-bottom:14px}
  h2{font-size:16px;margin:20px 0 8px}
  p{margin-bottom:10px;color:#3c4149}
  ul{padding-left:20px;margin-bottom:10px}
  li{margin-bottom:4px;color:#3c4149}
  a{color:#2b6de5}
  footer{text-align:center;color:#8a8f99;font-size:12px;padding:20px 0 40px}
  footer a{color:#8a8f99;margin:0 6px}
`;

function page(lang, slug, title, body) {
  const isEn = lang === "en";
  const home = isEn ? "/en/" : "/";
  const nav = isEn
    ? `<a href="/en/about/">About</a><a href="/en/privacy/">Privacy</a><a href="/en/contact/">Contact</a>`
    : `<a href="/about/">关于</a><a href="/privacy/">隐私</a><a href="/contact/">联系</a>`;
  const html = `<!DOCTYPE html>
<html lang="${isEn ? "en" : "zh-CN"}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} - ${isEn ? "Token Daily" : "Token 日报"}</title>
<meta name="description" content="${isEn ? "About, privacy policy and contact for Token Daily." : "Token 日报的关于、隐私政策与联系方式。"}">
<link rel="canonical" href="${ORIGIN}/${lang === "en" ? "en/" : ""}${slug}/">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<style>${css}</style>
</head>
<body>
<header><div class="wrap"><a href="${home}">${isEn ? "Token Daily" : "Token 日报"}</a><span style="margin-left:auto;font-size:12px;opacity:.9">${nav}</span></div></header>
<main>${body}</main>
<footer>
  <div>${isEn ? "Last updated" : "最后更新"}：${UPDATED}</div>
  <div><a href="${home}">${isEn ? "Home" : "首页"}</a><a href="/en/">English</a><a href="/">中文</a></div>
</footer>
</body>
</html>`;
  const dir = path.join(__dirname, "..", lang === "en" ? "en" : "", slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html, "utf8");
  console.log("生成 " + path.join(dir, "index.html"));
}

const zhAbout = `<h1>关于 Token 日报</h1>
<p>Token 日报每天整理国内外大模型 API 的免费额度、限时优惠与新用户试用金，目标是让开发者用最少的时间找到真正能领的额度。</p>
<h2>我们怎么做</h2>
<ul>
<li>每天对照官方文档与活动页，确认额度、价格和截止时间是否变化；</li>
<li>每条标注核实等级：已核实官方文档 / 部分核实 / 待核实；</li>
<li>记录限速、有效期、是否绑卡等容易被忽略的坑点。</li>
</ul>
<h2>我们不做什么</h2>
<p>不提供账号代注册，不销售额度，也不承诺任何活动长期有效。额度与规则以各平台官方控制台为准。</p>
<h2>信息来源</h2>
<p>以官方文档与官方活动页为准；商业线索站只用于发现活动，结论必须回到官方页面核实后才会上榜。</p>
<p>这是一个由个人维护的独立站点，与文中提到的任何厂商均无隶属关系。</p>`;

const enAbout = `<h1>About Token Daily</h1>
<p>Token Daily collects free quotas, limited-time offers and trial credits for LLM APIs, so developers can find usable credits in minutes instead of hours.</p>
<h2>How we work</h2>
<ul>
<li>Check official docs and campaign pages daily for changes in quota, price and deadlines;</li>
<li>Label every entry: verified, partly verified, or unverified;</li>
<li>Record rate limits, validity windows and card requirements that are easy to miss.</li>
</ul>
<h2>What we do not do</h2>
<p>We do not register accounts for you, sell quotas, or promise that any offer will stay live. Always confirm in the provider console.</p>
<h2>Sources</h2>
<p>Official documentation first. Commercial aggregators are used only as leads; nothing is listed until it is confirmed on an official page.</p>
<p>This is an independent site and is not affiliated with any provider mentioned.</p>`;

const zhPrivacy = `<h1>隐私政策</h1>
<p>本站不要求注册，也不收集你的姓名、手机号等个人信息。</p>
<h2>服务器日志</h2>
<p>托管服务商（Cloudflare、腾讯云）会记录访问 IP、浏览器标识与访问时间，用于安全防护和基础统计。</p>
<h2>Cookie 与广告</h2>
<p>本站可能使用 Google AdSense 展示广告。Google 及其合作伙伴作为第三方供应商，会使用 Cookie（包括 DoubleClick Cookie）根据你此前对本站或其他网站的访问投放广告。</p>
<p>你可以访问 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google 广告设置</a> 关闭个性化广告，或安装 <a href="https://www.google.com/settings/ads/onweb" target="_blank" rel="noopener">广告 Cookie 停用插件</a>。</p>
<h2>第三方链接</h2>
<p>页面包含指向各 AI 平台的链接，这些网站的数据处理方式由其自身隐私政策约束，本站不承担责任。</p>
<h2>联系与删除</h2>
<p>如需查询或删除与你相关的信息，请联系 ${EMAIL}。</p>`;

const enPrivacy = `<h1>Privacy Policy</h1>
<p>This site requires no account and does not collect your name, phone number or other personal details.</p>
<h2>Server logs</h2>
<p>Our hosting providers (Cloudflare and Tencent Cloud) record IP address, user agent and access time for security and basic analytics.</p>
<h2>Cookies and advertising</h2>
<p>This site may display ads through Google AdSense. Google and its partners may use cookies, including the DoubleClick cookie, to serve ads based on your prior visits to this or other websites.</p>
<p>You can opt out of personalised advertising in <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google Ads Settings</a>, or install the <a href="https://www.google.com/settings/ads/onweb" target="_blank" rel="noopener">Ads Opt-out extension</a>.</p>
<h2>Third-party links</h2>
<p>Pages link to third-party AI platforms; their data practices are governed by their own policies and are not our responsibility.</p>
<h2>Contact and removal</h2>
<p>To request access to or deletion of your information, contact ${EMAIL}.</p>`;

const zhContact = `<h1>联系我们</h1>
<p>发现失效活动、想补充新的免费额度，或者有合作意向，欢迎邮件联系。</p>
<p>邮箱：<a href="mailto:${EMAIL}">${EMAIL}</a></p>
<p>通常在 2 个工作日内回复。请在邮件里附上具体页面链接和你的判断依据，方便我们核实。</p>`;

const enContact = `<h1>Contact</h1>
<p>Found a dead offer, want to add a new free quota, or discuss a partnership? Email us.</p>
<p>Email: <a href="mailto:${EMAIL}">${EMAIL}</a></p>
<p>We usually reply within two business days. Please include the page link and your evidence so we can verify quickly.</p>`;

page("zh", "about", "关于", zhAbout);
page("zh", "privacy", "隐私政策", zhPrivacy);
page("zh", "contact", "联系我们", zhContact);
page("en", "about", "About", enAbout);
page("en", "privacy", "Privacy Policy", enPrivacy);
page("en", "contact", "Contact", enContact);

// ads.txt 模板（审核通过后填入真实 pub-id）
const adsPath = path.join(__dirname, "..", "ads.txt");
if (!fs.existsSync(adsPath)) {
  fs.writeFileSync(adsPath, "# 审核通过后替换为你的 AdSense publisher ID\ngoogle.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0\n", "utf8");
  console.log("生成 ads.txt（占位，需替换 pub-id）");
}
// 生成 /guides/ 原创指南（第一批三篇）
const fs = require("fs");
const path = require("path");

const ORIGIN = "https://token.879879.xyz";
const UPDATED = "2026-11-22";

const css = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#f4f5f7;color:#1f2329;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;line-height:1.8;font-size:15px}
  header{background:linear-gradient(120deg,#ff5a00,#ffb300);color:#fff;padding:16px 0}
  .wrap{max-width:780px;margin:0 auto;padding:0 20px}
  header .wrap{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
  header a{color:#fff;text-decoration:none;font-weight:800;font-size:15px}
  header nav a{font-weight:400;font-size:13px;margin-right:12px;opacity:.95}
  main{background:#fff;margin:20px auto;max-width:780px;padding:30px 26px;border-radius:10px;border:1px solid #ebedf0}
  h1{font-size:24px;line-height:1.45;margin-bottom:10px}
  .meta{color:#8a8f99;font-size:12px;margin-bottom:18px}
  h2{font-size:17px;margin:24px 0 8px;padding-left:10px;border-left:4px solid #ff5a00}
  h3{font-size:15px;margin:16px 0 6px}
  p{margin-bottom:12px;color:#3c4149}
  ul,ol{padding-left:22px;margin-bottom:12px}
  li{margin-bottom:6px;color:#3c4149}
  .lead{background:#fff7f0;border-left:4px solid #ffb300;padding:12px 14px;border-radius:0 6px 6px 0;margin-bottom:16px}
  table{width:100%;border-collapse:collapse;margin:12px 0;font-size:13.5px}
  th,td{border:1px solid #e6e8eb;padding:7px 9px;text-align:left}
  th{background:#fafbfc}
  code{background:#f2f3f5;padding:1px 5px;border-radius:3px;font-size:13px}
  a{color:#2b6de5}
  .related{margin-top:24px;padding-top:16px;border-top:1px solid #ebedf0;font-size:13.5px}
  footer{text-align:center;color:#8a8f99;font-size:12px;padding:18px 0 40px}
  footer a{color:#8a8f99;margin:0 6px}
`;

function shell(title, desc, body, slug) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} - Token 日报</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${ORIGIN}/guides/${slug ? slug + "/" : ""}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<style>${css}</style>
</head>
<body>
<header><div class="wrap"><a href="/">Token 日报</a><nav><a href="/guides/">指南</a><a href="/about/">关于</a><a href="/privacy/">隐私</a><a href="/contact/">联系</a></nav></div></header>
<main>${body}</main>
<footer><div>最后更新：${UPDATED} · <a href="/">返回首页</a> · <a href="/en/">English</a></div></footer>
</body>
</html>`;
}

function write(slug, html) {
  const dir = path.join(__dirname, "..", "guides", slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html, "utf8");
  console.log("生成 guides/" + slug + "/index.html");
}

// ---------- 1. 七牛 Conatus ----------
const qiniu = shell(
  "七牛云 Conatus 每天 1 亿 Token 怎么领（2026 黑五）",
  "七牛云 Conatus 黑五活动：qiniu/conatus-free 每天 1 亿 Token，单次充值满 100 元后每天 10 亿，含领取步骤、额度规则与三个坑。",
`<h1>七牛云 Conatus 每天 1 亿 Token 怎么领（2026 黑五）</h1>
<div class="meta">2026-11-22 · 已核实：部分 · 活动截止 11-30</div>
<div class="lead">结论先说：活动期内 <code>qiniu/conatus-free</code> 模型每天免费 1 亿 Token，实名后即可用；<strong>单次</strong>充值满 100 元提升到每天 10 亿。额度每天 0 点清零，不结转。</div>

<h2>这条额度到底是什么</h2>
<table>
<tr><th>项目</th><th>说明</th></tr>
<tr><td>免费模型</td><td><code>qiniu/conatus-free</code></td></tr>
<tr><td>每日额度</td><td>1 亿 Token（未充值）；单次充值满 100 元后 10 亿</td></tr>
<tr><td>重置时间</td><td>每天 00:00（北京时间）</td></tr>
<tr><td>是否结转</td><td>不结转，当天没用完就作废</td></tr>
<tr><td>前置条件</td><td>七牛云账号 + 实名认证</td></tr>
<tr><td>截止时间</td><td>2026-11-30 23:59（北京时间）</td></tr>
</table>

<h2>怎么领（5 步）</h2>
<ol>
<li>注册七牛云账号，完成<strong>实名认证</strong>（个人证件即可）；</li>
<li>进入控制台的 AI 推理 / 大模型服务，开通对应服务；</li>
<li>创建 API Key，记下 Key 与调用地址；</li>
<li>把模型名填为 <code>qiniu/conatus-free</code>，用 OpenAI 兼容格式发起请求；</li>
<li>在控制台的用量页面确认额度是否到账，再开始跑任务。</li>
</ol>

<h2>三个容易踩的坑</h2>
<h3>1. 额度不结转，别攒着</h3>
<p>每日 0 点清零，1 亿 Token 当天不用就没了。适合白天有批处理任务的人，不适合「先攒着以后用」。</p>
<h3>2. 「充值 10 亿」要求单次满 100 元</h3>
<p>拆成 5 次 20 元不累计。要提额就一次性充够，充完当天生效，但同样每天清零。</p>
<h3>3. 活动截止后会转按量计费</h3>
<p>11-30 之后免费模型可能下架或转付费，记得在控制台设置额度告警，避免自动扣费。</p>

<h2>适合谁</h2>
<ul>
<li>需要大批量文本处理（摘要、抽取、分类）的个人开发者；</li>
<li>想跑长文档任务的人——Conatus 支持长上下文，一天额度足够处理几十份文档。</li>
</ul>
<p>不适合：需要稳定 SLA 的生产业务，以及需要多模态（图像/语音）的场景。</p>

<h2>FAQ</h2>
<h3>要绑卡吗？</h3>
<p>领免费额度通常只需实名，不强制绑卡；但「充值提额」这一步需要支付方式。</p>
<h3>额度用完会自动扣费吗？</h3>
<p>取决于是否开通了按量计费。没开通时额度用完直接报错；开通后会转按量。建议先不开通。</p>
<h3>支持 OpenAI SDK 吗？</h3>
<p>七牛提供 OpenAI 兼容接口，把 <code>base_url</code> 指向它、模型名改成上面的 ID 即可。</p>

<div class="related">相关：<a href="/#qiniu-conatus">清单里的七牛条目</a> · <a href="/guides/aliyun-bailian-free-tokens/">阿里云百炼 100 万 Token 怎么领</a> · <a href="/guides/openrouter-free-models/">OpenRouter 免费模型怎么用</a></div>`,
  "qiniu-conatus-free-tokens"
);

// ---------- 2. 阿里云百炼 ----------
const bailian = shell(
  "阿里云百炼 100 万 Token 领取全流程（2026）",
  "阿里云百炼新用户每个模型 100 万 Token，90 天有效。含开通步骤、按模型计算的规则、北京地域限制与四个常见坑。",
`<h1>阿里云百炼 100 万 Token 领取全流程（2026）</h1>
<div class="meta">2026-11-22 · 已核实：官方文档 · 有效期 90 天</div>
<div class="lead">结论先说：首次开通百炼，<strong>每个在售文本模型</strong>各送 100 万 Token，从开通（或模型发布/申请通过，取较晚者）起算 <strong>90 天</strong>。不是共享池，是逐模型发放。</div>

<h2>额度规则</h2>
<table>
<tr><th>项目</th><th>说明</th></tr>
<tr><td>额度</td><td>每个模型 100 万 Token（Qwen3.8-Flash、Qwen3.7-Flash、MiniMax-M2.5 等）</td></tr>
<tr><td>有效期</td><td>90 天，到期不补发、不延期</td></tr>
<tr><td>地域</td><td>仅华北 2（北京）实时推理</td></tr>
<tr><td>不适用</td><td>Batch 调用、模型微调、部署</td></tr>
<tr><td>其他</td><td>图像类另有人物实例分割 500 张体验额度</td></tr>
</table>

<h2>怎么领（4 步）</h2>
<ol>
<li>注册阿里云并完成实名认证；</li>
<li>开通「百炼」服务，额度会自动发放，无需申请；</li>
<li>在控制台创建 API Key，记下 Key；</li>
<li>在「模型广场」选模型，按 OpenAI 兼容格式调用，<code>base_url</code> 使用百炼的地址。</li>
</ol>

<h2>四个坑</h2>
<h3>1. 不是「总共 100 万」，是「每个模型 100 万」</h3>
<p>换模型会换一套额度，所以多模型横评很划算；但也意味着别把一个模型的额度当成全平台通用。</p>
<h3>2. 90 天从「较晚者」起算</h3>
<p>开通早、模型上线晚的，从模型发布日算。看不到额度时先查有效期，很可能已过期。</p>
<h3>3. 只在华北 2 生效</h3>
<p>其他地域调用会走按量计费，账单出来才发现没抵扣，是常见事故。</p>
<h3>4. Batch、微调、部署不吃免费额度</h3>
<p>想用免费额度跑批量任务，只能走实时推理接口。</p>

<h2>适合谁</h2>
<ul>
<li>想横向比较 Qwen 系列不同档位效果的开发者；</li>
<li>短周期原型验证（90 天足够）。</li>
</ul>

<h2>FAQ</h2>
<h3>多个模型共享 100 万吗？</h3>
<p>不共享。每个模型独立 100 万，按模型 ID 分别计算。</p>
<h3>到期会直接扣费吗？</h3>
<p>额度耗尽或到期后继续调用会产生计费。建议在费用中心设置预算告警。</p>
<h3>怎么查剩余额度？</h3>
<p>控制台的「资源包 / 额度管理」里能看到每个模型的剩余量与到期日。</p>

<div class="related">相关：<a href="/#aliyun-bailian">清单里的百炼条目</a> · <a href="/guides/qiniu-conatus-free-tokens/">七牛每天 1 亿 Token</a> · <a href="/guides/openrouter-free-models/">OpenRouter 免费模型</a></div>`,
  "aliyun-bailian-free-tokens"
);

// ---------- 3. OpenRouter ----------
const openrouter = shell(
  "OpenRouter 免费模型怎么用：限速、充值与避坑（2026）",
  "OpenRouter 的 :free 模型有 20+ 个，20 RPM、每天 50 次；累计充值 10 美元后提升到 1000 次。含调用方法、选型建议与四个坑。",
`<h1>OpenRouter 免费模型怎么用：限速、充值与避坑（2026）</h1>
<div class="meta">2026-11-22 · 已核实：官方文档 · 名单会变动</div>
<div class="lead">结论先说：一个 Key 就能调 20+ 个 <code>:free</code> 模型，限制是 <strong>20 RPM</strong>、每天 <strong>50 次</strong>；累计充值满 <strong>10 美元</strong>后，每日上限永久提升到 <strong>1000 次</strong>。</div>

<h2>免费额度规则</h2>
<table>
<tr><th>项目</th><th>说明</th></tr>
<tr><td>可用模型</td><td>模型 ID 以 <code>:free</code> 结尾，当前约 20+ 个</td></tr>
<tr><td>速率</td><td>20 请求/分钟</td></tr>
<tr><td>每日上限</td><td>50 次；累计充值满 $10 后 1000 次（永久）</td></tr>
<tr><td>失败请求</td><td>计入每日上限</td></tr>
<tr><td>名单变动</td><td>上游停止补贴时会下架</td></tr>
</table>

<h2>怎么用（4 步）</h2>
<ol>
<li>注册 OpenRouter，创建 API Key；</li>
<li>在模型列表按「免费」筛选，或直接用 <code>openrouter/free</code> 让平台自动选可用模型；</li>
<li>用 OpenAI SDK，把 <code>base_url</code> 设为 <code>https://openrouter.ai/api/v1</code>；</li>
<li>给请求加 fallback 链（两三个 <code>:free</code> 模型），避免单个模型 429 就整条任务失败。</li>
</ol>

<h2>四个坑</h2>
<h3>1. 失败的请求也扣次数</h3>
<p>超时、上游 429 都算一次。别写紧密重试循环，用指数退避。</p>
<h3>2. 免费名单随时会变</h3>
<p>DeepSeek R1、Qwen3 Coder 480B、Llama 3.3 70B 都已从免费名单下架。把模型 ID 写死在代码里，迟早 404。</p>
<h3>3. $10 是一次性门槛，不是每月充值</h3>
<p>累计充值满 $10 后即使余额花光，1000 次/天的上限也永久保留，不需要续费。</p>
<h3>4. 免费模型的数据可能被上游使用</h3>
<p>不同提供方策略不同，敏感数据别走免费档。</p>

<h2>适合谁</h2>
<ul>
<li>想低成本试多个模型效果的开发者；</li>
<li>做原型、跑低频 Agent 任务的个人项目。</li>
</ul>

<h2>FAQ</h2>
<h3>50 次/天够干什么？</h3>
<p>够日常调试和轻量问答。要做批量任务，建议先充 $10 拿到 1000 次/天，成本约 70 元人民币。</p>
<h3>免费模型能商用吗？</h3>
<p>多数可以，但要逐一确认上游模型的许可证；部分模型禁止商业用途。</p>
<h3>怎么处理 429？</h3>
<p>先切 fallback 模型，再退避重试；不要在 1 分钟内反复打同一个模型。</p>

<div class="related">相关：<a href="/#openrouter-free">清单里的 OpenRouter 条目</a> · <a href="/guides/qiniu-conatus-free-tokens/">七牛每天 1 亿 Token</a> · <a href="/guides/aliyun-bailian-free-tokens/">阿里云百炼 100 万 Token</a></div>`,
  "openrouter-free-models"
);

write("qiniu-conatus-free-tokens", qiniu);
write("aliyun-bailian-free-tokens", bailian);
write("openrouter-free-models", openrouter);

// ---------- 指南索引 ----------
const index = shell(
  "免费 AI 额度指南",
  "免费大模型 API 额度的领取步骤、限速规则与避坑指南。",
`<h1>免费 AI 额度指南</h1>
<div class="meta">2026-11-22 · 每周更新</div>
<p>这里是把清单里的条目拆开写清楚的深度指南：怎么领、额度怎么算、哪些地方会踩坑。</p>
<ul>
<li><a href="/guides/qiniu-conatus-free-tokens/">七牛云 Conatus 每天 1 亿 Token 怎么领（2026 黑五）</a></li>
<li><a href="/guides/aliyun-bailian-free-tokens/">阿里云百炼 100 万 Token 领取全流程（2026）</a></li>
<li><a href="/guides/openrouter-free-models/">OpenRouter 免费模型怎么用：限速、充值与避坑（2026）</a></li>
</ul>
<p>更多指南每周补充。遇到活动失效或额度变化，欢迎通过 <a href="/contact/">联系页</a> 告诉我们。</p>`,
  ""
);
const idxDir = path.join(__dirname, "..", "guides");
fs.mkdirSync(idxDir, { recursive: true });
fs.writeFileSync(path.join(idxDir, "index.html"), index, "utf8");
console.log("生成 guides/index.html");
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

// ---------- 4. 黑五截止日历 ----------
const blackFriday = shell(
  "2026 黑五 AI 额度截止日历：9 个活动的最后期限（北京时间对照）",
  "把黑五期间到期或开始的免费额度与充值返赠统一换算成北京时间，按截止先后排好，含力度、门槛与三个最常见的时间坑。",
  `<h1>2026 黑五 AI 额度截止日历</h1>
<div class="meta">2026-11-28 · 每天更新</div>
<div class="lead">黑五（11-27）到网一（11-30）是集中截止期。下面的截止时间<b>一律换算成北京时间</b>，因为同写「11-30 截止」，实际可能差 16 小时。</div>

<h2>按北京时间排的截止表</h2>
<table>
<tr><th>截止（北京时间）</th><th>平台</th><th>力度</th><th>门槛</th></tr>
<tr><td>11-30 24:00</td><td>七牛云 Conatus</td><td>每天 1 亿 Token，充值后 10 亿</td><td>实名，单次充 100 元</td></tr>
<tr><td>12-01 07:59</td><td>OpenModel（UTC 11-30 23:59）</td><td>充值返赠 10%~20%</td><td>单笔订单，无需优惠码</td></tr>
<tr><td>12-01 15:59</td><td>HiAPI（PT 11-30 23:59）</td><td>充 $500 得 $650，另送 DeepSeek 免费额度</td><td>外币卡，至少充值一次</td></tr>
<tr><td>12-01（时区待确认）</td><td>ZenMux</td><td>充值加赠 20%，单账户上限 $1,000</td><td>需充值，订阅不参与</td></tr>
<tr><td>12-03 15:59</td><td>LinkModel（PST 12-02 23:59）</td><td>新户 $1 免费 + 8 个模型最高 55% 折扣</td><td>注册即可</td></tr>
<tr><td>12-03 15:59</td><td>Swarms Cloud（PT 12-02）</td><td>新户 $15 起始额度 + 充值加赠 20%</td><td>注册；$0 token 仅两天</td></tr>
<tr><td>12-16</td><td>packet.ai Token Factory</td><td>DeepSeek / MiniMax Flash 免费</td><td>手机号验证</td></tr>
<tr><td>12-31</td><td>百度千帆普惠专场</td><td>每月 1500 次免费调用</td><td>实名</td></tr>
<tr><td>12-31</td><td>Gemini 3.8 Flash 锁价</td><td>现价执行到年底，明年翻倍</td><td>付费档</td></tr>
</table>

<h2>三个时间坑</h2>
<h3>1. 同一天截止，实际差 16 小时</h3>
<p>七牛按北京时间 11-30 24:00 收；OpenModel 按 UTC，折北京时间 12-01 07:59；HiAPI 按美西 PT，折 12-01 15:59。UTC 与 PT 相差 8 小时，PT 与北京相差 16 小时——只按「11-30」记，会漏掉后两家。</p>
<h3>2. 实名与绑卡不能当天完成</h3>
<p>七牛要实名，HiAPI 要外币卡，OpenModel 要外币支付。这些环节卡住就是几小时到一天，别在截止当天才做。</p>
<h3>3. 返现到账晚于活动结束</h3>
<p>HiAPI 的消费返还 12-03 才到账。不影响资格，但会影响你对「到手多少」的判断——先按返还前的余额规划用量。</p>

<h2>建议的动手顺序（11-28 起）</h2>
<ol>
<li>今天先把实名与外币卡弄好，门槛类事项最耗时；</li>
<li>这周末（11-28～11-30）跑批量任务，别留到最后一个下午；</li>
<li>充值类只看「本来就会用多少」，为赠额充值大概率是亏的；</li>
<li>12-01 早上再核对一次，按 PT 的两家还有半天缓冲。</li>
</ol>

<h2>FAQ</h2>
<h3>黑五之后还有活动吗？</h3>
<p>有。百度普惠与 Gemini 锁价都到 12-31，packet.ai 到 12-16，LinkModel 与 Swarms 到 12-02。节日活动结束后，长期额度仍是主线。</p>
<h3>充值返赠值得冲吗？</h3>
<p>取决于你本来就打算花多少。返赠额度只能用于 API 调用、不可提现，为返赠而充值大概率是亏的。</p>
<h3>Google 的 $300 还能跑 Gemini 吗？</h3>
<p>11-16 之后注册的账号不行了。官方文档写明 $300 不能用于 Gemini 平台（原 Vertex AI）；此日期前注册的老账号仍可抵扣。</p>

<div class="related">相关：<a href="/#qiniu-conatus">七牛条目</a> · <a href="/#hiapi-bf">HiAPI 条目</a> · <a href="/#openmodel-bf">OpenModel 条目</a> · <a href="/#zenmux-bf">ZenMux 条目</a> · <a href="/feed/">今日情报</a></div>`,
  "black-friday-ai-credits-calendar"
);
write("black-friday-ai-credits-calendar", blackFriday);

// ---------- 免费 GPU 额度对比 ----------
const gpuCompare = shell(
  "免费 GPU 额度怎么选：Colab、Kaggle、AI Studio 对比（2026）",
  "四家免费 GPU 的额度、单次时长与适用场景横向对比，附组合用法与断点续训的坑。",
  `<h1>免费 GPU 额度怎么选：Colab、Kaggle、AI Studio 对比</h1>
<div class="meta">2026-11-23 · 每周更新</div>
<div class="lead">结论先说：当天就要跑通 Notebook，用 Google Colab；要长期免费跑训练，用 Kaggle；国内网络优先，用百度 AI Studio；正式项目要合规与发票，走华为云 ModelArts 申请。四家都不是「无限免费」，真正的约束是单次时长和配额重置。</div>

<h2>一张表看清差异</h2>
<table>
<tr><th>平台</th><th>免费额度</th><th>单次时长</th><th>最适合</th><th>主要限制</th></tr>
<tr><td>Google Colab</td><td>T4 免费档，按需分配</td><td>约 12 小时，闲置会断开</td><td>调通代码、小模型微调</td><td>高峰期排队，资源不保证</td></tr>
<tr><td>Kaggle Notebooks</td><td>约 30 小时 GPU/周</td><td>约 9 小时</td><td>比赛复现、全量训练</td><td>需要手机验证，数据集要上传</td></tr>
<tr><td>百度 AI Studio</td><td>每日发放卡时</td><td>视任务而定</td><td>国内访问、中文模型</td><td>需实名，高峰排队</td></tr>
<tr><td>华为云 ModelArts</td><td>申请制试用</td><td>按审批额度</td><td>企业/毕设等正式项目</td><td>审批周期不定，不是当天可用</td></tr>
</table>

<h2>为什么免费额度都卡「单次时长」</h2>
<p>免费 GPU 的成本是按卡时算的，平台愿意送时长，但不愿意让一个会话长期占卡。所以几乎所有免费额度都做了两件事：限制单次运行时长、闲置一段时间自动断开。理解了这一点，用法就清楚了——<b>把长任务拆成能续跑的短任务</b>，而不是赌会话不断。</p>

<h2>Google Colab：最快的上手路径</h2>
<p>打开就能用，T4 对 7B 以下的模型微调够用。真正的坑在存储：<code>/content</code> 是临时的，会话一断全部丢失。训练前把数据集放到 Drive 或 Hugging Face，脚本里每次先检查缓存是否存在。<a href="/compute/google-colab/">Colab 的详细说明</a></p>

<h2>Kaggle：免费额度里最接近「能跑完」的</h2>
<p>每周约 30 小时 GPU，单次约 9 小时，P100 16GB。适合把 Colab 上调通的脚本搬过来跑全量。注意它默认没有外网持久存储，输出要保存为 Notebook 产物或数据集，否则会话结束就没了。<a href="/compute/kaggle-notebooks/">Kaggle 的详细说明</a></p>

<h2>百度 AI Studio：国内网络的最优解</h2>
<p>国内直连速度快，实名后按天发放卡时。适合中文模型微调与教学演示。高峰期需要排队，长任务建议放到夜间；平台对脚本有审计，别跑与学习无关的负载。<a href="/compute/baidu-aistudio/">AI Studio 的详细说明</a></p>

<h2>华为云 ModelArts：申请制，别当救急</h2>
<p>它不是自动发放，需要在表单里写清用途与项目背景。适合毕设、企业 PoC 这类能等审批的场景。如果你今天就要跑，别指望它。<a href="/compute/huawei-modelarts/">ModelArts 的详细说明</a></p>

<h2>推荐的组合用法</h2>
<ol>
<li><b>本地写代码</b>：用 VS Code 或 Cursor 写训练脚本，靠配置文件控制路径，不依赖某个平台的目录结构。</li>
<li><b>Colab 调通</b>：先用几百条样本跑通全流程，确认显存和依赖没问题。</li>
<li><b>Kaggle 跑全量</b>：把脚本搬过去，开 9 小时档，输出存成产物。</li>
<li><b>不够再上按需</b>：真要连跑几天，用按秒计费的服务（如 <a href="/compute/runpod/">RunPod</a>）比堆免费额度更省心。</li>
</ol>

<h2>三个高频坑</h2>
<ul>
<li><b>显存对不上</b>：免费档多是 16GB，7B 模型全量微调基本放不下，先算清 batch size 与 LoRA 的显存占用。</li>
<li><b>没有断点续训</b>：会话一断全部重来。训练循环里每 N 步存一次 checkpoint 到持久存储，是免费额度的必修课。</li>
<li><b>把免费当生产</b>：免费额度没有 SLA，排队和抢占随时发生。对外提供的服务不要建在免费档上。</li>
</ul>

<h2>FAQ</h2>
<h3>免费额度需要绑卡吗？</h3>
<p>Colab 与 Kaggle 免费档不需要绑卡；Google Cloud 的 $300 赠金需要绑卡，用完会自动扣费，务必设预算告警。</p>
<h3>一周 30 小时够训练吗？</h3>
<p>够跑中小模型的全量微调与比赛复现，不够长时间预训练。真需要更大算力，按需租比攒额度更现实。</p>
<h3>国内还有别的免费 GPU 吗？</h3>
<p>阿里云 PAI、腾讯云 Cloud Studio、华为昇腾社区都有试用或活动额度，但多为限时或申请制，见<a href="/compute/">算力栏目</a>的完整清单。</p>

<div class="related">相关：<a href="/compute/">算力栏目全部条目</a> · <a href="/guides/qiniu-conatus-free-tokens/">七牛每天 1 亿 Token</a> · <a href="/guides/aliyun-bailian-free-tokens/">阿里云百炼 100 万 Token</a></div>`,
  "free-gpu-quota-comparison"
);
write("free-gpu-quota-comparison", gpuCompare);

// ---------- 指南索引 ----------
const index = shell(
  "免费 AI 额度指南",
  "免费大模型 API 额度的领取步骤、限速规则与避坑指南。",
`<h1>免费 AI 额度指南</h1>
<div class="meta">2026-11-22 · 每周更新</div>
<p>这里是把清单里的条目拆开写清楚的深度指南：怎么领、额度怎么算、哪些地方会踩坑。</p>
<ul>
<li><a href="/guides/free-gpu-quota-comparison/">免费 GPU 额度怎么选：Colab、Kaggle、AI Studio 对比（2026）</a></li>
<li><a href="/guides/qiniu-conatus-free-tokens/">七牛云 Conatus 每天 1 亿 Token 怎么领（2026 黑五）</a></li>
<li><a href="/guides/aliyun-bailian-free-tokens/">阿里云百炼 100 万 Token 领取全流程（2026）</a></li>
<li><a href="/guides/openrouter-free-models/">OpenRouter 免费模型怎么用：限速、充值与避坑（2026）</a></li>
<li><a href="/guides/black-friday-ai-credits-calendar/">2026 黑五 AI 额度截止日历：9 个活动按北京时间排的最后期限</a></li>
</ul>
<p>更多指南每周补充。遇到活动失效或额度变化，欢迎通过 <a href="/contact/">联系页</a> 告诉我们。</p>`,
  ""
);
const idxDir = path.join(__dirname, "..", "guides");
fs.mkdirSync(idxDir, { recursive: true });
fs.writeFileSync(path.join(idxDir, "index.html"), index, "utf8");
console.log("生成 guides/index.html");
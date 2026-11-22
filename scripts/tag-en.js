// 给每条 DEALS 注入英文文案 en:{t,d,v,n}，幂等
const fs = require("fs");
const FILE = "index.html";

const MAP = {
  "zhipu-glm47-flash": {
    t: "GLM-4.7-Flash is <span class='hl'>free with no quota cap</span> (1 concurrent request)",
    d: "30B MoE (3B active), 200K context, 128K max output, thinking mode and tool calling; officially positioned as permanently free, replacing the retired GLM-4.5-Flash.",
    v: "Free · unlimited", n: "1 concurrent request"
  },
  "openmodel-bf": {
    t: "Black Friday top-up bonus: <span class='hl'>10% at $50, 20% at $1,000</span>",
    d: "Nov 15-30, 2026. Single-order top-ups earn 10% extra at $50-199, 15% at $200-499, 18% at $500-999, 20% at $1,000+; credited automatically.",
    v: "Up to +20% credits", n: "API calls only, non-withdrawable"
  },
  "gemini-lock": {
    t: "Gemini 3.8 Flash price <span class='hl'>locked to Dec 31</span>, doubles on Jan 1",
    d: "Paid tier $0.75 input / $3.75 output per 1M tokens through 2026-12-31, then $1.50 / $7.50 from 2027-01-01. The free tier still covers 3.8 Flash, 3.6 Flash, 3.5 Flash-Lite and Gemma 4.",
    v: "50% price window", n: "vs. 2027 pricing"
  },
  "aliyun-bailian": {
    t: "<span class='hl'>1M free tokens per model</span> for new users, valid 90 days",
    d: "Issued automatically when you activate Model Studio. Covers Qwen3.8-Flash, Qwen3.7-Flash, MiniMax-M2.5 and most text models; image segmentation adds 500 free calls.",
    v: "1M tokens x N models", n: "90 days after activation"
  },
  "volc-ark": {
    t: "<span class='hl'>500K free tokens per model</span> on first activation",
    d: "Volcengine Ark issues quota per model, so multiple Doubao versions can each be claimed; pay-as-you-go is available alongside the free quota.",
    v: "500K tokens / model", n: "Per model, until exhausted"
  },
  "tencent-hunyuan": {
    t: "<span class='hl'>1M free tokens</span> on first activation, valid 1 year",
    d: "Hunyuan text models share a 1M-token package and embeddings get another 1M; the 1-year validity is the most generous among CN platforms.",
    v: "1M tokens / 1 year", n: "Shared consumption"
  },
  "tencent-tokenhub": {
    t: "TokenHub starter pack: <span class='hl'>separate quotas for text, vision and multimodal</span>",
    d: "Tencent Cloud's newer LLM platform issues separate starter quotas by model family, claimable from the model marketplace or the activation page.",
    v: "Multi-category pack", n: "Check console for amounts"
  },
  "baidu-qianfan": {
    t: "<span class='hl'>1M free tokens per model</span>, issued automatically",
    d: "Granted after accepting the terms, per model rather than one shared pool; ERNIE and third-party models are counted separately.",
    v: "1M tokens / model", n: "Auto-issued"
  },
  "baidu-benefit": {
    t: "AI benefit campaign: <span class='hl'>1,500 free calls per month</span>",
    d: "Oct 30 - Dec 31, 2026, standard and turbo versions, roughly 50 calls per day; pay-as-you-go beyond the quota.",
    v: "1,500 calls / month", n: "Campaign ends Dec 31"
  },
  "modelscope": {
    t: "<span class='hl'>2,000 free API calls per day</span> across 60K+ open models",
    d: "ModelScope's free inference service covers text, image and speech models without self-hosting; a good fit for prototyping.",
    v: "2,000 calls / day", n: "Resets daily"
  },
  "siliconflow": {
    t: "Invite sign-up gives <span class='hl'>20M tokens</span>, plus permanently free small models",
    d: "New users arriving through an invite link receive a 20M-token grant; several small models remain free to call.",
    v: "20M tokens", n: "Invite-only"
  },
  "openrouter-free": {
    t: "<span class='hl'>20+ :free models</span> behind a single key",
    d: "The current free list centers on NVIDIA Nemotron 3 (Ultra 550B / Lightning / Super VL, 1M context), Google Gemma 4, Cohere North Mini Code and Ling 3.2 Flash, plus the openrouter/free router.",
    v: "20 RPM / 50 RPD", n: "1,000 RPD after a $10 lifetime top-up"
  },
  "groq": {
    t: "Free tier up to <span class='hl'>14,400 requests/day</span>, very low latency",
    d: "llama-3.1-8b-instant runs about 30 RPM / 14,400 RPD; larger models (gpt-oss-120b, Kimi K2, Qwen3) sit at 1,000 RPD; Whisper adds 2,000 audio requests/day.",
    v: "1,000-14,400 RPD", n: "Varies by model"
  },
  "cloudflare": {
    t: "<span class='hl'>10,000 free Neurons per day</span>, models at the edge",
    d: "Included in the Workers free plan and resets at 00:00 UTC; Llama, Qwen, Whisper and Stable Diffusion are billed by Neuron, with overage at $0.011 per 1,000.",
    v: "10K Neurons / day", n: "Resets daily (UTC)"
  },
  "nvidia-nim": {
    t: "build.nvidia.com: <span class='hl'>120+ open models free</span>",
    d: "Nemotron, DeepSeek and Qwen open-weight models are callable online at roughly 40 RPM without a card; positioned for evaluation and prototyping.",
    v: "40 RPM and up", n: "Limits not published"
  },
  "mistral": {
    t: "Free experimentation tier <span class='hl'>enabled by default</span>, no card required",
    d: "New accounts start on the free mode and can call Mistral Medium and Codestral; rate limits are strict and meant for evaluation.",
    v: "Free tier", n: "Limits unpublished"
  },
  "gcp-300": {
    t: "<span class='hl'>$300 credit / 91 days</span> for new Google Cloud users",
    d: "Call Gemini 3 Pro and 3.8 Flash through Vertex AI; the largest compliant free-credit route available.",
    v: "$300 credit", n: "Valid 91 days"
  },
  "azure-200": {
    t: "<span class='hl'>$200 credit / 30 days</span> plus 55 always-free services",
    d: "Azure's free account includes $200 for the first month, usable on Azure OpenAI and AI Foundry; 55+ services stay free.",
    v: "$200 credit", n: "Valid 30 days"
  },
  "deepseek-promo": {
    t: "Official pricing shows <span class='hl'>limited-time 50% off</span> (speech); text billed at off-peak rates",
    d: "TTS drops from CNY 3 to 1.5 per 10K chars, ASR from 0.78 to 0.39 per hour; text models moved to off-peak and cache-hit pricing.",
    v: "From 50% off", n: "See official price page"
  },
  "cerebras-trap": {
    t: "Claimed '1M free tokens per day' - <span class='hl'>officially denied</span>",
    d: "Cerebras states it does not offer an auto-renewing free tier or a per-model permanent allowance; new accounts get about $5 in trial credit that expires in 30 days.",
    v: "Only $5 trial credit", n: "Expires in 30 days"
  },
  "github-models-trap": {
    t: "GitHub Models free API is <span class='hl'>retired</span>",
    d: "The old route of using a GitHub account to call GPT-4o or Llama for free is gone and related tutorials no longer work; use OpenRouter or NVIDIA NIM instead.",
    v: "Discontinued", n: "No longer available"
  },
  "openrouter-gone-trap": {
    t: "These models <span class='hl'>left the free list</span>: DeepSeek R1, Qwen3 Coder 480B, Llama 3.3 70B",
    d: "OpenRouter's :free list follows upstream subsidies, and the models above moved to paid. The current free leaders are Nemotron 3, Gemma 4 and Cohere North Mini Code.",
    v: "List rotated", n: "Old IDs return 404/402"
  },
  "hf-trap": {
    t: "Free accounts get <span class='hl'>no monthly inference credit</span>; PRO only $2/month",
    d: "After the Inference Providers revamp, free accounts are pay-as-you-go; PRO at $9/month includes $2 of monthly credit.",
    v: "$0 credit", n: "PRO gets $2/month"
  },
  "gemini-rpd-trap": {
    t: "'1,500 free requests/day' <span class='hl'>no longer applies to new models</span>",
    d: "Gemini free-tier limits were tightened repeatedly in late 2026, with the flagship Flash briefly at 20 RPD. The docs only promise to check AI Studio.",
    v: "Limits fluctuate", n: "Check the console"
  },
  "aibotone-hub": {
    t: "Beginner compute hub claiming <span class='hl'>130M free tokens</span>",
    d: "Aggregates free-quota campaigns, tool installers and tutorials in a claim-install-build flow; the 130M figure stacks multiple platforms and is unverified.",
    v: "Claimed 130M tokens", n: "Aggregated, not one key"
  },
  "iflytek-spark": {
    t: "Spark-X2.6 gives new users <span class='hl'>1B tokens</span> of trial quota",
    d: "iFlytek's MaaS platform offers 1B free tokens for Spark-X2.6 (293B-A30B MoE, 1M context) after real-name verification; paid usage is 60% off for a limited time.",
    v: "1B tokens", n: "Valid 31 days after claim"
  },
  "edgeone-makers": {
    t: "<span class='hl'>500K free tokens per month</span> with built-in models",
    d: "EdgeOne Makers' free plan issues 500K tokens monthly for DeepSeek V4, Kimi K2.6, MiniMax M3 and Hunyuan; BYOK calls do not consume the quota.",
    v: "500K tokens / month", n: "Resets monthly"
  },
  "minimax-platform": {
    t: "Free users get <span class='hl'>20 RPM / 1M TPM</span>, no top-up needed",
    d: "MiniMax language models allow 20 RPM and 1M TPM on the free tier; speech synthesis runs at 10 RPM, music at 3 RPM, images counted by IPM.",
    v: "20 RPM / 1M TPM", n: "Free tier"
  },
  "huawei-agentarts": {
    t: "AgentArts gives <span class='hl'>2M free tokens</span> on activation",
    d: "AgentArts connects to ModelArts Studio (MaaS) and issues 2M tokens by default for model testing and agent dry runs.",
    v: "2M tokens", n: "See console billing"
  }
};

let html = fs.readFileSync(FILE, "utf8");
let injected = 0;
let missing = [];

for (const [id, en] of Object.entries(MAP)) {
  if (html.includes('id:"' + id + '", use:')) {
    const marker = 'id:"' + id + '", use:';
    if (html.includes(marker + ' ' + 'en:')) continue;
  }
  const needle = 'id:"' + id + '",';
  if (!html.includes(needle)) { missing.push(id); continue; }
  if (html.includes(needle + ' en:') || html.includes(needle + 'en:')) continue;
  const payload = ' en:{t:"' + en.t + '",d:"' + en.d + '",v:"' + en.v + '",n:"' + en.n + '"},';
  html = html.replace(needle, needle + payload);
  injected++;
}

fs.writeFileSync(FILE, html, "utf8");
console.log("注入英文: " + injected + " 条");
if (missing.length) console.warn("未找到: " + missing.join(", "));
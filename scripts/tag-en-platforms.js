// 给每条 en 对象补英文平台名 p，幂等
const fs = require("fs");
const FILE = "index.html";

const MAP = {
  "zhipu-glm47-flash": "Zhipu BigModel",
  "openmodel-bf": "OpenModel",
  "gemini-lock": "Google Gemini",
  "aliyun-bailian": "Alibaba Cloud Model Studio",
  "volc-ark": "Volcengine Ark",
  "tencent-hunyuan": "Tencent Hunyuan",
  "tencent-tokenhub": "Tencent TokenHub",
  "baidu-qianfan": "Baidu Qianfan",
  "baidu-benefit": "Baidu Qianfan",
  "modelscope": "ModelScope",
  "siliconflow": "SiliconFlow",
  "openrouter-free": "OpenRouter",
  "groq": "Groq",
  "cloudflare": "Cloudflare Workers AI",
  "nvidia-nim": "NVIDIA NIM",
  "mistral": "Mistral",
  "gcp-300": "Google Cloud",
  "azure-200": "Microsoft Azure",
  "deepseek-promo": "DeepSeek",
  "cerebras-trap": "Cerebras",
  "github-models-trap": "GitHub Models",
  "openrouter-gone-trap": "OpenRouter",
  "hf-trap": "Hugging Face",
  "gemini-rpd-trap": "Google Gemini",
  "aibotone-hub": "Ai1hao",
  "iflytek-spark": "iFlytek Spark",
  "edgeone-makers": "Tencent EdgeOne Makers",
  "minimax-platform": "MiniMax",
  "huawei-agentarts": "Huawei Cloud AgentArts",
  "qiniu-conatus": "Qiniu Cloud Conatus",
  "hiapi-bf": "HiAPI"
};

let h = fs.readFileSync(FILE, "utf8");
let n = 0;
const miss = [];
for (const [id, p] of Object.entries(MAP)) {
  const needle = 'id:"' + id + '", en:{';
  if (!h.includes(needle)) { miss.push(id); continue; }
  if (h.includes(needle + "p:")) continue;
  h = h.replace(needle, 'id:"' + id + '", en:{p:"' + p + '",');
  n++;
}
fs.writeFileSync(FILE, h, "utf8");
console.log("注入平台英文名: " + n + " 条" + (miss.length ? " | 未找到: " + miss.join(",") : ""));
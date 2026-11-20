// 给 DEALS 数据批量注入 use（用途分类）字段，幂等
const fs = require("fs");
const FILE = "index.html";

const MAP = {
  "zhipu-glm47-flash": "coding",
  "openmodel-bf": "deal",
  "gemini-lock": "deal",
  "aliyun-bailian": "general",
  "volc-ark": "general",
  "tencent-hunyuan": "general",
  "tencent-tokenhub": "multimodal",
  "baidu-qianfan": "general",
  "baidu-benefit": "general",
  "modelscope": "multimodal",
  "siliconflow": "deal",
  "openrouter-free": "coding",
  "groq": "general",
  "cloudflare": "multimodal",
  "nvidia-nim": "coding",
  "mistral": "coding",
  "gcp-300": "general",
  "azure-200": "general",
  "deepseek-promo": "deal",
  "cerebras-trap": "general",
  "github-models-trap": "general",
  "openrouter-gone-trap": "general",
  "hf-trap": "general",
  "gemini-rpd-trap": "general",
};

let html = fs.readFileSync(FILE, "utf8");
let injected = 0;

for (const [id, use] of Object.entries(MAP)) {
  if (html.includes('id:"' + id + '", use:')) continue;
  const needle = 'id:"' + id + '",';
  if (html.includes(needle)) {
    html = html.replace(needle, 'id:"' + id + '", use:"' + use + '",');
    injected++;
  } else {
    console.warn("未找到条目: " + id);
  }
}

fs.writeFileSync(FILE, html, "utf8");
console.log("注入 use 字段: " + injected + " 条");
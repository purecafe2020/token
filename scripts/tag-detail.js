// 给 sections.json 的条目补 detail（详情页专属内容），幂等
const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "..", "data", "sections.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));

const DETAIL = {
  "Google Colab": "免费 T4 适合跑通 Notebook 与小模型微调。真正的限制是会话时长和内存——训练前把数据放到 Drive 或 Hugging Face，避免会话断开后从头再跑。",
  "Kaggle Notebooks": "每周约 30 小时 GPU 配额，P100 16GB 对 7B 以下的模型够用。数据集与 Notebook 同仓，适合比赛复现；注意单次运行有时长上限。",
  "百度 AI Studio": "国内访问速度最快的一档，实名后按天发放免费卡时。适合中文模型微调与教学；高峰期需要排队，长任务建议放到夜间。",
  "华为云 ModelArts": "申请制而不是自动发放，需要在表单里写清用途。适合学生与企业做正式项目；审批周期不定，不要把它当成当天可用的资源。",
  "阿里云 PAI": "试用额度与地域、实例规格绑定。开通前先确认可用区与规格，否则会出现「有额度却开不出实例」的情况。",
  "腾讯云 Cloud Studio": "在线 IDE，部分模板带 GPU。适合教学演示与轻量调试；免费模板会休眠，重训练仍需要本地或云 GPU。",
  "Lightning AI": "Studio 里直接跑 Notebook，免费额度适合验证想法。超出后按小时计费，跑完务必关停，否则会持续扣费。",
  "RunPod": "按秒计费，短任务成本明显低于按小时计费的云厂商。社区云便宜但稳定性一般，安全云贵约一倍；先确认是否需要合规环境。",
  "Google Cloud TPU": "$300 赠金可用于 Vertex AI 与 TPU，91 天有效。务必先设预算告警并关闭自动升级，否则赠金用完会直接扣信用卡。",
  "华为昇腾社区": "国产卡生态，适合跑已适配昇腾的模型。活动按批次开放，需要在社区报名；模型适配成本高于 NVIDIA 生态，先看有没有现成镜像。"
};

const SLUG = {
  "百度 AI Studio": "baidu-aistudio",
  "阿里云 PAI": "aliyun-pai",
  "腾讯云 Cloud Studio": "tencent-cloud-studio",
  "华为云 ModelArts": "huawei-modelarts",
  "华为昇腾社区": "ascend-community"
};

let n = 0;
for (const sec of Object.values(data.sections)) {
  for (const it of sec.items) {
    if (DETAIL[it.title] && !it.detail) {
      it.detail = DETAIL[it.title];
      n++;
    }
    if (SLUG[it.title] && !it.slug) {
      it.slug = SLUG[it.title];
      n++;
    }
  }
}
fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
console.log("补充 detail: " + n + " 条");
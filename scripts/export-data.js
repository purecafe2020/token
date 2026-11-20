// 从 index.html 的 DEALS 导出 data/deals.json，保持单一数据源
const fs = require("fs");

const html = fs.readFileSync("index.html", "utf8");
const m = html.match(/const DEALS = (\[[\s\S]*?\n\]);/);
if (!m) {
  console.error("FAIL: 找不到 DEALS 数据块");
  process.exit(1);
}
const DEALS = eval(m[1]);
const json = JSON.stringify(DEALS, null, 2);
const path = "data/deals.json";

const old = fs.existsSync(path) ? fs.readFileSync(path, "utf8") : "";
if (old !== json) {
  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync(path, json, "utf8");
  console.log("deals.json 已更新（" + DEALS.length + " 条）");
} else {
  console.log("deals.json 无变化（" + DEALS.length + " 条）");
}
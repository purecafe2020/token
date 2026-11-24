// 端到端渲染校验：用 DOM stub 分别跑中文页与英文页
const fs = require("fs");
const vm = require("vm");

function run(file, lang) {
  const html = fs.readFileSync(file, "utf8");
  const start = html.lastIndexOf("<script>");
  const end = html.indexOf("</script>", start);
  const js = html.slice(start + 8, end);

  const mk = () => ({
    innerHTML: "", dataset: {}, value: "",
    addEventListener() {}, querySelectorAll() { return []; },
    classList: { toggle() {}, add() {}, remove() {} },
    insertAdjacentHTML() {}, scrollIntoView() {}
  });
  const els = {};
  const doc = {
    documentElement: { getAttribute: () => lang, lang },
    getElementById: (id) => { if (!els[id]) els[id] = mk(); return els[id]; },
    createElement: () => mk(),
    querySelectorAll: () => [],
    querySelector: () => mk(),
    addEventListener() {},
    body: mk()
  };
  const sb = {
    document: doc, console,
    window: { addEventListener() {}, location: { hash: "", origin: "https://token.879879.xyz" } },
    location: { hash: "", origin: "https://token.879879.xyz" },
    navigator: { userAgent: "node" },
    setTimeout, clearTimeout
  };

  try { vm.runInNewContext(js, sb); }
  catch (e) { return { file, error: e.message }; }

  const list = (els.list && els.list.innerHTML) || "";
  const picks = (els.picks && els.picks.innerHTML) || "";
  return {
    file,
    cards: (list.match(/<article class="deal/g) || []).length,
    expired: (list.match(/class="deal expired"/g) || []).length,
    expMark: (list.match(/class="expmark"/g) || []).length,
    expSep: list.includes('class="expsep"'),
    zhLeak: (list + picks).includes("已失效"),
    picks: (picks.match(/class="pick"/g) || []).length,
    undef: (list + picks).match(/undefined/g) || [],
  };
}

const zh = run("index.html", "zh-CN");
const en = run("en/index.html", "en");
console.log("zh " + JSON.stringify(zh));
console.log("en " + JSON.stringify(en));
const ok = !zh.error && !en.error && zh.cards === en.cards && zh.cards > 0 &&
  zh.expired === en.expired &&
  zh.expMark === zh.expired && en.expMark === en.expired &&
  (zh.expired === 0 || zh.expSep) &&
  zh.undef.length === 0 && en.undef.length === 0 &&
  !en.zhLeak;
console.log(ok ? "PASS" : "FAIL");
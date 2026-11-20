# 访问计数器（Cloudflare Worker + KV）

页脚会显示「今日 N 次访问 · 累计 M 次」。纯静态站自己存不了数，所以用一个很小的独立 Worker 计数，数据放在 KV 里。

代码已经在 `counter/worker.js`，下面是部署方法（二选一）。

## 方式 A：后台粘贴（不用装任何工具，推荐）

**1. 建 KV**

Cloudflare 控制台 → **Storage & Databases** → **KV** → **Create a namespace** → 名字填 `token-counter-kv` → 创建后复制 **Namespace ID**（一串 32 位字符，后面绑定用）。

**2. 建 Worker**

**Workers & Pages** → **Create** → **Worker** → 名字填 `token-counter` → Deploy。

进去点 **Edit code**，把 `counter/worker.js` 的全部内容粘贴进去，覆盖默认代码 → **Deploy**。

**3. 绑 KV**

Worker 页面 → **Settings** → **Bindings** → **Add** → 选 **KV Namespace**：

- Variable name：`COUNTER`（必须一字不差）
- KV namespace：选刚才的 `token-counter-kv`

保存后 **重新 Deploy 一次**（绑定变更需要重新发布才生效）。

**4. 绑域名**

**Settings** → **Domains & Routes** → **Add** → **Custom domain** → 填 `counter.879879.xyz`（你的域名在 Cloudflare 托管，几十秒生效）。

不建议直接用 `token-counter.xxx.workers.dev`：这个后缀在国内会被 DNS 污染，页面能打开但计数会失败（前端已做容错，失败就不显示数字）。

**5. 验证**

```powershell
curl.exe -X POST https://counter.879879.xyz/hit
curl.exe https://counter.879879.xyz/stats
```

第一条应返回 `{"today":1,"total":1}` 之类的 JSON，第二条可随时查看当前数字。

## 方式 B：wrangler 部署（已装 Node）

```powershell
cd counter
npx wrangler login
npx wrangler kv namespace create COUNTER          # 记下输出的 id
# 把 id 填进 wrangler.toml 的 [[kv_namespaces]] id
npx wrangler deploy
npx wrangler deployments list
```

然后在后台给 Worker 加 Custom Domain `counter.879879.xyz`。

## 页面侧配置

`index.html` 里只有一处需要改：

```js
const COUNTER_API = "https://counter.879879.xyz";
```

如果暂时没绑域名，可以先改成 `https://token-counter.<你的子域>.workers.dev`。

## 说明与限制

- **计数口径是 PV**（每次页面加载 +1），同一人多刷几次会多计；刷新页面也会 +1。
- KV 不是强一致存储，**高并发下可能少计几次**；日访问几百到几千的量级完全够用。
- 「今日」按北京时间（UTC+8）切分，日计数保留 7 天后自动过期，累计数永久保留。
- 防刷只做了 CORS 来源限制（主站 / workers.dev / CloudBase 镜像），不做 IP 去重；如果被恶意刷量，可在 Worker 里加 IP 哈希去重或 Turnstile。
- 计数接口挂了不影响页面：前端 `catch` 后会清空那行文字，不会出现错误提示。

## 成本

Workers 免费版每天 10 万次请求、KV 免费版每天 10 万次读 + 1 千次写。按每天几百次访问，远低于额度，**0 成本**。
# 给看板加访问密码（Cloudflare Access）

静态站没有后端，真正的密码保护要靠 Cloudflare Access：朋友第一次打开会跳到登录页，输入邮箱 → 收 6 位验证码 → 进入。之后浏览器会记住会话（默认 24 小时）。

> 说明：一旦开启，**所有人**都要验证，包括你自己；只想给几个人看时，把他们的邮箱加进白名单即可。免费版支持 50 个用户，够用。

## 前提

1. 看板已经部署在 Cloudflare Pages，并且你能登录 <https://dash.cloudflare.com>；
2. 首次使用 Zero Trust 需要建一个 team（填个名字即可，不需要付费、不需要绑卡）。

## 路径 A：直接给 Pages 项目加（最快）

1. Cloudflare 控制台 → **Workers & Pages** → 点你的项目 `token-daily`
2. **Settings** → 找到 **Access policy**（部分账号显示为 *Enable Cloudflare Access*）
3. 点 **Manage** / **Enable**，跳转到 Zero Trust 创建应用：
   - **Application name**：`token-daily`
   - **Application domain**：选择 `token-daily.pages.dev`（绑了自定义域名就选自定义域名）
4. 新建策略 **Policy**：
   - Action：`Allow`
   - Include → **Emails** → 填入允许访问的邮箱（你自己的 + 朋友的，一行一个）
5. 保存。之后打开 `https://token-daily.pages.dev` 就会先要求登录。

## 路径 A-2：Worker 项目（`*.workers.dev`）

如果站点是 Worker（域名形如 `xxx.workers.dev`，而不是 Pages）：

1. Cloudflare 控制台 → **Workers & Pages** → 选中该 Worker；
2. **Settings** → **Domains & Routes**；
3. 在 `workers.dev` 那一行点 **Enable Cloudflare Access**（或 **Manage**）；
4. 同样在 Zero Trust 里配置白名单邮箱。

注意：Worker 绑定的自定义域名同样要求 DNS 走 Cloudflare 代理（橙色云），否则 Access 不生效。

## 路径 B：在 Zero Trust 里手动建（推荐，可控性更好）

1. <https://one.dash.cloudflare.com> → **Access** → **Applications** → **Add an application** → **Self-hosted**
2. 填写：
   - **Application name**：`AI Token 日报`
   - **Session duration**：`24 hours`（可按需改成 1 week）
   - **Application domain**：`token-daily.pages.dev`（或你的自定义域名）
3. **Add policy**：
   - Policy name：`friends`
   - Action：`Allow`
   - Configure rules → **Include** → **Emails** → 填邮箱列表
   - 可加第二条策略：`Include → Emails → 你的邮箱`，Action `Allow`（也可以合并）
4. 保存并 **Save application**。

## 必须确认：One-time PIN 已启用

Zero Trust → **Settings** → **Authentication** → **Login methods**，确认 **One-time PIN** 处于启用状态。没有它，朋友会卡在登录页且收不到验证码。

## 常见问题

| 现象 | 原因 |
|---|---|
| 朋友收不到验证码 | 邮箱不在策略白名单里（Cloudflare 只给白名单邮箱发信）；或 One-time PIN 未启用；或进了垃圾邮件 |
| 自定义域名不受保护 | DNS 记录的橙色云（代理）没开，或应用里填的是 `pages.dev` 而不是自定义域名 |
| 预览链接也被锁了 | Access 会同时保护 `*.pages.dev` 的预览地址；只想保护生产域名时，在应用 domain 里只填生产域名 |
| 想临时对外开放 | 删除该 Access 应用，或在 Pages 项目里关闭 Access policy；改动立即生效 |
| 验证码 10 分钟后失效 | 正常行为，重新点 Send login code 即可 |

## 安全边界

- Access 保护的是**入口**，不是内容加密：拿到已登录浏览器会话的人仍能看到页面。
- 页面本身没有敏感信息（公开的额度情报），Access 的主要作用是"不被陌生人刷到、不被搜索引擎收录"。
- 已同时配置 `X-Robots-Tag: noindex`，即使关闭 Access 也不会被正常收录。

## 成本

Zero Trust 免费版：50 用户、Access 应用数量不限、OTP 免费。本站每天 1~5 次构建，仍在 Pages 免费额度内，整体仍是 **0 成本**。
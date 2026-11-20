# 国内镜像方案（让大陆朋友稳定打开）

主站放在 Cloudflare Pages，但 `*.pages.dev` 在国内时常解析失败或很慢。这里给一条**免备案**的国内镜像路线。

## 先说结论（避免白折腾）

| 方案 | 现状 | 结论 |
|---|---|---|
| **Gitee Pages** | 已于 2024-05 停止服务，入口下线 | ❌ 不可用，别照旧教程操作 |
| **EdgeOne Makers（原 EdgeOne Pages）** | 免费，但境外区默认域名 `*.edgeone.dev` 在国内返回 401；绑自定义域名需**备案** | ⚠️ 备案后才能用 |
| **腾讯云 CloudBase 静态托管** | 0 元环境，免费 1GB 存储 + 5GB/月 CDN 流量，默认域名国内可直连、**免备案** | ✅ 推荐 |
| **阿里云 OSS 静态站** | 默认域名访问 HTML 会强制下载，要正常浏览必须绑备案域名 | ❌ 不推荐 |
| **jsDelivr / Statically 加速 GitHub** | 国内可用性反复波动，且不适合托管整站 | ⚠️ 只能临时应急 |

所以默认路线：**主站 Cloudflare Pages + 国内镜像腾讯云 CloudBase**，两边同一份 `index.html`，每天自动同步。

## 一、开通 CloudBase（约 5 分钟）

1. 注册/登录腾讯云，完成**实名认证**；
2. 打开 <https://tcb.cloud.tencent.com/> → 开通云开发 → 创建环境（选**按量计费**，0 元开通）；
3. 记下 **环境 ID**（形如 `token-daily-1g2h3j4k`）；
4. 在控制台左侧「静态网站托管」里确认服务已开通。

> 免费额度：1GB 存储 + 5GB/月 CDN 流量。页面 36KB，5GB 约等于 **14 万次访问/月**，个人分享完全够。
> 超出后按量计费（几分钱级别），建议在「费用中心 → 预算告警」设一条 10 元提醒。

## 二、本机装 CLI 并登录

```powershell
npm i -g @cloudbase/cli
tcb login          # 会打开浏览器授权，登录后凭据保存在本机
tcb env list       # 确认能看到刚才的环境 ID
```

## 三、配置镜像并首次部署

1. 打开 `mirror.config.json`，改成：

```json
{
  "enabled": true,
  "envId": "你的环境ID",
  "provider": "cloudbase"
}
```

2. 手动跑一次：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\deploy-mirror.ps1
```

3. 到控制台「静态网站托管 → 文件管理」确认根目录有 `index.html`；页面右上角能看到**默认域名**，形如：

```
https://<envId>-<随机串>.tcloudbaseapp.com
```

这个域名**不需要备案**，国内可直接打开，发给朋友即可。

## 四、自动同步怎么工作

`scripts/publish.ps1` 在成功推送 GitHub 后，会调用 `scripts/deploy-mirror.ps1`：

- `mirror.config.json` 不存在或 `enabled=false` → 跳过，不影响主站；
- 已配置 → 执行 `tcb hosting deploy index.html -e <envId>` 覆盖上传；
- 镜像失败只写 `logs/mirror.log`，**不会**让当天的主站发布回滚。

也就是说：每天内容更新后，Cloudflare（主站）和 CloudBase（国内镜像）各上线一份，互不影响。

## 五、缓存与刷新

CloudBase 的 CDN 默认会缓存静态文件，可能出现「主站已更新、镜像还是旧版」。两种处理：

- **推荐**：控制台 → 静态网站托管 → 缓存配置，把 `index.html` 设为**不缓存**（或缓存 1 分钟）；
- 临时：控制台 → CDN 刷新 → 提交 `index.html` 的 URL 刷新。

## 六、可选：绑自己的域名

CloudBase 自定义域名需要**ICP 备案**（腾讯云可代办，一般 1~2 周），流程：

1. 买域名 → 腾讯云备案（需国内主体证件、核验）；
2. 备案通过后，在静态托管 → 自定义域名 → 添加域名；
3. 按提示加 CNAME，等证书签发（自动 HTTPS）。

备案前建议直接用默认域名，体验已经够用。

## 七、两个站点的取舍

| 场景 | 用哪个链接 |
|---|---|
| 国内朋友、微信里直接点 | CloudBase 默认域名 |
| 海外朋友 / 自己能稳定访问 CF | `*.pages.dev` |
| 想统一一个入口 | 备案后绑自定义域名，用 DNS 按地区分流（或干脆都指向国内站） |

## 八、注意事项

- 两个站点内容一致，但**统计不了访问量**（页面没有埋点，也没有 Cookie），这是刻意保持的轻量设计。
- CloudBase 不支持 Cloudflare 的 `_headers` 文件，`noindex` 与缓存策略需要在上面的控制台设置里单独处理。
- 如果以后内容量变大（比如加图片），注意 1GB 存储与 5GB 流量的免费额度；纯 HTML 站点可以忽略。
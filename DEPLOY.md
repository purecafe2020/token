# 部署到 Cloudflare Pages + 每日自动发布

目标：把 `index.html` 变成一个固定网址，朋友随时能打开；内容由 Agent 每天核实更新后，自动推上线。

## 一、谁负责什么

| 环节 | 谁做 | 说明 |
|---|---|---|
| 每天检索 + 核实 + 改数据 | Agent（会话中） | 说一句「更新今日看板」即可，零人工整理 |
| 提交 + 推送 | 本机计划任务（`scripts/publish.ps1`） | 每天 09/12/15/18/21 点自动检查，**当天没更新就跳过，不会伪造时间** |
| 构建 + 托管 | Cloudflare Pages | 监听 `main` 分支，push 后 30~60 秒自动重建 |

本机环境已就绪：git 2.56、Node 22、仓库已初始化（`main` 分支），发布脚本已实跑通过。

## 二、第 1 步：建 GitHub 仓库

1. 打开 <https://github.com/new>
2. 仓库名例如 `token-daily`，选 **Public**（Pages 免费版需要公开仓库；页面本身公开，无妨）
3. **不要**勾选 "Add a README" / .gitignore / license（本地已有文件，避免冲突）
4. 创建后复制仓库地址，形如 `https://github.com/<你的用户名>/token-daily.git`

## 三、第 2 步：本机首次推送

在本目录执行（把地址换成你自己的）：

```powershell
git remote add origin https://github.com/<你的用户名>/token-daily.git
# 本地已有初始提交，可直接推送；若此时提示有未提交改动，再执行下面的 add/commit
git add -A
git commit -m "init: AI Token 羊毛日报看板"
git push -u origin main
```

**认证方式（二选一）**

- **HTTPS + PAT（推荐）**：GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → 只勾选该仓库的 `Contents: Read and write`。首次 `push` 弹窗时用户名填 GitHub 用户名，密码填 PAT。之后由 Windows 凭据管理器记住。
- **SSH**：`ssh-keygen -t ed25519` 后把公钥加到 GitHub，remote 改用 `git@github.com:<用户名>/token-daily.git`。

推送成功后，`git remote -v` 能看到 origin，自动发布脚本才会工作。

## 四、第 3 步：Cloudflare Pages 接上仓库

1. 登录 <https://dash.cloudflare.com> → 左侧 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 授权 GitHub，选择刚建的 `token-daily` 仓库
3. 项目设置：
   - **Project name**：`token-daily`（决定默认网址 `token-daily.pages.dev`）
   - **Production branch**：`main`
   - **Framework preset**：`None`
   - **Build command**：**留空**
   - **Build output directory**：`/`
4. **Save and deploy**，等第一次构建完成（约 1 分钟）

完成后你会得到 `https://token-daily.pages.dev`，直接发给朋友即可。

> 根目录的 `README.md`、`scripts/` 也会被一起公开（都是纯文本，不含任何密钥）。如果不想暴露，把 `Build output directory` 改成 `site`，并把 `index.html`、`_headers` 移进 `site/`，同时告诉我调整发布路径。

## 五、第 4 步：开启每日自动发布

以**当前用户**身份运行（不需要管理员）：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\register-task.ps1
# 自定义起始时间 / 间隔：... -File scripts\register-task.ps1 -At 08:30 -EveryHours 2 -Times 6
```

默认会在每天 **09:00 / 12:00 / 15:00 / 18:00 / 21:00** 各检查一次。脚本是幂等的：没更新就退出，不会产生多余提交与构建。

常用命令：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\publish.ps1  # 立即手动发布一次
Get-ScheduledTaskInfo -TaskName AI-Token-Daily-Publish   # 上次运行结果 / 下次运行时间
Start-ScheduledTask    -TaskName AI-Token-Daily-Publish   # 立刻测试一次
Unregister-ScheduledTask -TaskName AI-Token-Daily-Publish -Confirm:$false  # 取消
Get-Content logs\publish.log -Tail 30                     # 看发布日志
```

运行逻辑（`scripts/publish.ps1`）：

1. 读 `index.html` 里的 `UPDATED` 日期；
2. 不是今天 → 记一条「跳过：尚未更新」并退出（**不会**把旧内容当新内容发）；
3. 是今天 → `git add/commit/push`，失败自动重试 3 次（间隔 60 秒）；
4. Cloudflare 检测到新提交，自动重建。

## 六、第 5 步（可选）：自定义域名与访问控制

- **绑域名**：Pages 项目 → **Custom domains** → 添加域名（域名需已托管在 Cloudflare），按提示加 CNAME。绑好后国内访问通常比 `pages.dev` 稳一些，但仍不保证。
- **加密码**：Cloudflare Zero Trust → Access → Applications，为域名加一条 Email/OTP 策略（免费版支持 50 用户）。注意：纯前端密码不算安全，别用它保护敏感内容。
- **不想被搜索引擎收录**：`_headers` 已带 `X-Robots-Tag: noindex`，删掉这一行即可放开。

## 七、国内访问的现实情况

Cloudflare 免费版在中国大陆没有直连节点，`*.pages.dev` 时常出现解析被污染或速度很慢。三种应对：

1. 绑自定义域名 + Cloudflare 代理（改善有限，但链接更稳定）；
2. 同一仓库再挂一份到 Gitee Pages / 腾讯云静态托管，作为国内镜像（需实名，内容会审核）；
3. 接受现状：发给能正常访问的朋友，或让他们用公司/家庭网络多试几次。

## 八、排错清单

| 现象 | 原因与处理 |
|---|---|
| `push` 报 401 / 403 | PAT 过期或没有 `Contents: Write`；到凭据管理器删掉旧凭据重试 |
| 计划任务没跑 | 任务类型是「仅用户登录时运行」，注销状态下不触发；也可在任务计划程序里改成「不管用户是否登录都运行」并保存密码 |
| Cloudflare 构建失败 | 多半是填了构建命令；静态站应保持 Build command 为空、输出目录 `/` |
| 推送成功但页面没变 | 等 1 分钟；确认浏览器强刷（已配置 `no-cache`）；在 CF 部署列表确认最新 commit 是刚推的 |
| 日志显示「跳过：尚未更新」 | 当天还没在会话里更新内容——说「更新今日看板」即可 |
| 时间对不上 | 计划任务用系统本地时区；CF 构建时间显示为 UTC |

## 九、成本与数据

- Cloudflare Pages 免费版：每月 500 次构建、静态请求不限量，本站每天 1 次构建，**0 成本**。
- GitHub 公开仓库：免费。
- 页面无后端、无 Cookie、无统计脚本，朋友打开只加载一个 HTML（36KB）。
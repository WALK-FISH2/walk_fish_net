# Cloudflare Pages 部署上线指南

版本：1.0.0  
更新日期：2026-07-19  
适用项目：Pixel//Walk 个人像素叙事网站  
目标平台：Cloudflare Pages

本文给出本项目从本地验收到 Cloudflare Pages 公开上线、绑定域名、验证、回滚和故障排查的完整流程。本文只描述纯静态部署，不引入 Cloudflare Pages Functions、Workers SSR、D1、KV、R2 或常驻 Node 服务。

## 1. 当前部署结论

本项目可以直接部署到 Cloudflare Pages，依据如下：

- `astro.config.mjs` 使用 `output: "static"`；
- 构建命令为 `npm run build`；
- 正式静态输出目录为 `dist/`；
- Article、Program 和 Projects 兼容路由均在构建期生成 HTML；
- `dist/server/` 不存在；
- 线上请求不需要 Node.js、数据库或后端 API；
- React、PixiJS 和 GSAP 只在访客浏览器中运行；
- `dist/404.html`、`robots.txt`、Sitemap 和 `_headers` 会一并部署。

Cloudflare Pages 在这里仅负责托管 HTML、CSS、JavaScript、图片和其他静态资源。不要为本项目安装 `@astrojs/cloudflare`，该适配器用于 SSR 或 Pages Functions，不是本项目当前静态架构的依赖。

## 2. 推荐上线方案

推荐使用：

```text
GitHub main 分支
→ Cloudflare Pages Git 集成
→ npm run build
→ 上传 dist/
→ *.pages.dev 或自定义域名
```

选择 Git 集成的原因：

- 推送 `main` 后自动构建和发布；
- 其他分支和 Pull Request 自动获得预览地址；
- 每次部署与 Git commit 对应；
- Cloudflare 保留部署历史，可以回滚；
- 不需要在本地保存 Cloudflare API Token。

当前仓库已经使用 GitHub：

```text
Repository: https://github.com/WALK-FISH2/walk_fish_net
Production branch: main
Repository root: D:\Work\walk_fish_net
Website root: 03_SourceCode/Website
```

Cloudflare Pages 支持公开和私有 GitHub 仓库。授权 Cloudflare GitHub App 时，只授予该仓库即可。

## 3. Cloudflare 项目配置速查

在 Cloudflare Pages 创建项目时使用以下配置：

| 配置项 | 本项目填写值 |
| --- | --- |
| Git provider | GitHub |
| Repository | `WALK-FISH2/walk_fish_net` |
| Production branch | `main` |
| Framework preset | `Astro` |
| Root directory | `03_SourceCode/Website` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | `22.16.0` |
| `BASE_PATH` | `/` |
| `SITE_URL` | 最终公开站点的 HTTPS 根地址 |

不要填写：

```text
Build command: npm run build:sites
Output directory: sites-dist
Functions directory: functions
```

`build:sites` 和 `sites-dist/` 是现有 ChatGPT Sites 发布适配流程，不用于 Cloudflare Pages。Cloudflare Pages 应直接托管 Astro 的核心 `dist/`。

## 4. 上线前业务门禁

技术上可部署不代表内容已经适合正式公开。正式上线前应检查 `tasks.md` 中 M9 的以下事项：

- 已替换真实姓名、联系方式和社交链接；
- 已添加准备公开的真实文章和本人程序；
- 已删除虚假或容易误导访客的占位内容；
- 已确认图片、字体和参考素材的授权；
- 已确认仓库和前端没有 API Key、Token、账号密码或内部地址；
- 已确认 title、description、Open Graph、Sitemap、robots 和 canonical；
- 已确认程序演示没有伪造后端、登录、支付或实时能力。

如果以上内容尚未完成，可以先部署到 Cloudflare 预览分支，但不应把它称为正式上线版本。

## 5. 本地发布前检查

### 5.1 确认工作目录

PowerShell：

```powershell
Set-Location D:\Work\walk_fish_net\03_SourceCode\Website
git status --short
git branch --show-current
```

正式生产发布应基于明确的 commit。不要把未确认的本地修改、临时截图、Token 或构建缓存一起提交。

### 5.2 更新 M5.5 浪花素材时的额外步骤

网站实际构建读取：

```text
src/assets/m5-5/
```

而不是直接读取：

```text
assets/reference/m5-5/
```

如果只替换了参考浪花图，需要先确认图片背景是真正透明的，再运行：

```powershell
python .\scripts\process-m55-assets.py
```

随后检查 `src/assets/m5-5/wave-front.png`、`wave-mid.png` 和 `wave-back.png` 已更新。脚本不会自动抠除不透明蓝底；蓝色预览背景必须先从源 PNG 的 Alpha 通道中删除。

### 5.3 使用最终域名构建

如果最终使用 Cloudflare 提供的域名：

```powershell
$env:SITE_URL = "https://<PROJECT_NAME>.pages.dev"
$env:BASE_PATH = "/"
```

如果准备使用自定义域名：

```powershell
$env:SITE_URL = "https://example.com"
$env:BASE_PATH = "/"
```

`SITE_URL` 不要以 `/` 结尾。Cloudflare Pages 项目默认部署在域名根路径，因此 `BASE_PATH` 保持 `/`。

如果还不知道 Cloudflare 最终分配的 `pages.dev` 地址，可以先完成第一次部署，复制真实生产地址，然后回到 Pages 环境变量更新 `SITE_URL` 并重新部署一次。

### 5.4 安装与质量门禁

```powershell
npm ci
npm run check
npm run lint
npm test
npm run build
```

期望结果：

- Astro Check 没有 errors、warnings 或 hints；
- ESLint 退出码为 0；
- 自动化测试全部通过；
- Astro 报告 `output: static`；
- 输出目录是 `dist/`；
- 当前内容基线生成 15 个 HTML；
- `dist/server/` 不存在。

### 5.5 静态产物检查

```powershell
Test-Path .\dist\index.html
Test-Path .\dist\404.html
Test-Path .\dist\robots.txt
Test-Path .\dist\sitemap-index.xml
Test-Path .\dist\_headers
Test-Path .\dist\server
(Get-ChildItem .\dist -Recurse -File -Filter *.html).Count
```

最后一项 `dist/server` 应返回 `False`。当前 HTML 数量应为 15；以后新增或删除 Article、Program 时数量可以变化，应以内容集合和路由清单为准。

### 5.6 纯静态本地预览

不要只用 Astro 开发服务器证明静态部署可行。应直接托管 `dist/`：

```powershell
Set-Location .\dist
python -m http.server 4173 --bind 127.0.0.1
```

打开：

```text
http://127.0.0.1:4173/
```

测试完成后按 `Ctrl+C` 停止服务器，再回到项目目录。

## 6. 使用 Git 集成部署

### 6.1 确认 GitHub 已包含待发布版本

```powershell
Set-Location D:\Work\walk_fish_net\03_SourceCode\Website
git status
git log -1 --oneline
git push origin main
```

不要为了部署执行 `git reset --hard` 或覆盖未提交文件。若当前分支不是 `main`，应先通过正常审查或合并流程把准备发布的 commit 合并到生产分支。

### 6.2 创建 Pages 项目

1. 登录 Cloudflare Dashboard。
2. 进入 **Workers & Pages**。
3. 选择 **Create application**。
4. 选择 **Pages**。
5. 选择 **Import an existing Git repository** 或 **Connect to Git**。
6. 连接 GitHub，并选择 `WALK-FISH2/walk_fish_net`。
7. 选择 **Begin setup**。

官方说明：[Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)

### 6.3 填写构建设置

```text
Project name: 自定义且全局可用的名称
Production branch: main
Framework preset: Astro
Root directory: 03_SourceCode/Website
Build command: npm run build
Build output directory: dist
```

Root directory 很重要。Git 仓库根目录是 `walk_fish_net`，而 `package.json` 位于 `03_SourceCode/Website`。如果遗漏该配置，Cloudflare 会在错误目录中寻找 `package.json`。

### 6.4 配置环境变量

进入项目构建设置的环境变量区域，至少配置：

| 变量 | Production | Preview | 说明 |
| --- | --- | --- | --- |
| `NODE_VERSION` | `22.16.0` | `22.16.0` | 满足 `package.json` 的 `>=22.13.0` |
| `SITE_URL` | 最终生产域名 | 建议仍使用生产域名 | 生成 canonical、Sitemap 和绝对 SEO 地址 |
| `BASE_PATH` | `/` | `/` | Pages 域名根路径部署 |

Cloudflare Pages v3 构建系统不会依赖 `package.json#engines` 自动选择 Node 版本，因此建议显式设置 `NODE_VERSION`。官方构建环境说明见 [Build image](https://developers.cloudflare.com/pages/configuration/build-image/)。

`SITE_URL` 是公开配置，不是秘密。不要把 Cloudflare API Token 或其他凭证放入前端可读取变量，也不要提交到 Git。

### 6.5 第一次部署

选择 **Save and Deploy**。构建日志中应依次看到：

```text
安装 npm 依赖
运行 npm run build
Astro static build
输出 dist/
部署静态资源
```

成功后会获得：

```text
https://<PROJECT_NAME>.pages.dev
```

如果实际地址与预先填写的 `SITE_URL` 不同：

1. 复制 Cloudflare 显示的准确生产 URL；
2. 打开项目 **Settings → Environment variables**；
3. 修改 Production 的 `SITE_URL`；
4. 在 Deployments 中选择 **Retry deployment**，或推送一个新的 commit；
5. 重新检查 canonical、Sitemap 和 Open Graph 地址。

Cloudflare 官方 Astro 设置同样使用 `npm run build` 与 `dist`：[Deploy an Astro site](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)。

## 7. 自定义域名

### 7.1 添加域名

1. 打开 Cloudflare Pages 项目。
2. 进入 **Custom domains**。
3. 选择 **Set up a domain**。
4. 输入根域名或子域名。
5. 按提示完成 DNS 配置。
6. 等待状态变为 Active。

必须先在 Pages 项目的 Custom domains 中关联域名，再配置外部 DNS。只手动创建一个指向 `pages.dev` 的 CNAME、却没有在 Pages 中添加域名，可能得到 522。

官方说明：[Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)

### 7.2 根域名

例如：

```text
example.com
```

根域名必须作为 Cloudflare Zone 添加到同一个账户，并把域名服务器切换到 Cloudflare。Cloudflare 会在域名关联流程中创建相应 DNS 记录。

### 7.3 子域名

例如：

```text
www.example.com
pixel.example.com
```

如果 DNS 不由 Cloudflare 管理，可以在原 DNS 服务商创建：

```text
Type: CNAME
Name: pixel
Target: <PROJECT_NAME>.pages.dev
```

但仍要先完成 Pages Dashboard 中的 Custom domain 关联。

### 7.4 域名激活后的项目调整

把 Cloudflare Pages 的 Production 环境变量改为：

```text
SITE_URL=https://最终域名
BASE_PATH=/
```

然后重新部署。确认：

- 自定义域名使用 HTTPS；
- `/sitemap-index.xml` 中使用自定义域名；
- 页面 canonical 使用自定义域名；
- Open Graph URL 使用自定义域名；
- `robots.txt` 指向正确 Sitemap；
- `pages.dev` 和自定义域名不会产生相互循环跳转。

如果域名配置了严格 CAA 记录，需要允许 Cloudflare 使用的证书颁发机构，否则证书可能无法签发。

## 8. 本项目的 Cloudflare 静态行为

### 8.1 目录索引

Astro 使用 `build.format: "directory"`，例如：

```text
dist/about/index.html
dist/programs/pixel-journey/index.html
```

Cloudflare Pages 会把它们作为：

```text
/about/
/programs/pixel-journey/
```

无需 SPA fallback 或 Worker 路由。

### 8.2 404

项目包含顶层 `dist/404.html`。Cloudflare Pages 会使用该文件处理未知静态路径，并返回 404。不要删除该文件；如果顶层 404 缺失，Pages 可能按 SPA 方式把未知地址回退到首页。

官方说明：[Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/)

### 8.3 Projects 旧链接兼容

当前 `/projects/` 和 `/projects/[slug]/` 是独立静态兼容页：

- 返回静态 HTML；
- 提供 `noindex,follow`；
- canonical 指向 `/programs`；
- JavaScript 可用时执行替换跳转；
- JavaScript 不可用时仍有可点击链接。

Cloudflare 上这些兼容页通常先返回 HTTP 200，再由页面完成兼容跳转。这是当前设计，不应误判为部署失败。以后可额外增加平台级 301/308，但不能在没有验证旧链接的情况下删除静态兼容页。

### 8.4 响应头与缓存

项目的 `public/_headers` 会在构建后复制到 `dist/_headers`。当前规则包括：

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

带哈希的 `/assets/*` 使用：

```text
Cache-Control: public, max-age=31536000, immutable
```

这适合 Astro 的哈希静态资源。HTML 不应盲目设置同样的长期 immutable 缓存。Cloudflare 会为静态响应提供 ETag 和 CDN 缓存；只有发现部署后仍持续返回旧资源时，才考虑在 Cloudflare 缓存设置中执行 Purge。

官方说明：[Custom headers](https://developers.cloudflare.com/pages/configuration/headers/)

## 9. 上线后自动化路由验证

把 `$site` 替换为实际生产域名：

```powershell
$site = "https://<PROJECT_NAME>.pages.dev"
$routes = @(
  "/",
  "/about/",
  "/articles/",
  "/articles/content-as-levels/",
  "/articles/first-post/",
  "/articles/small-tools/",
  "/programs/",
  "/programs/pixel-journey/",
  "/programs/signal-garden/",
  "/programs/tidy-desk/",
  "/projects/",
  "/projects/pixel-journey/",
  "/projects/signal-garden/",
  "/projects/tidy-desk/",
  "/404.html"
)

foreach ($route in $routes) {
  curl.exe -sS -o NUL -w "$route -> %{http_code}`n" "$site$route"
}

curl.exe -sS -o NUL -w "/missing-cloudflare-check/ -> %{http_code}`n" "$site/missing-cloudflare-check/"
```

期望：

- 15 个当前静态路由均为 200；
- 未知路由为 404；
- Program 和 Article 详情页直接刷新仍为 200；
- Projects 兼容页能到达对应 Programs 地址。

新增内容后，应根据实际生成的路由更新验证列表，不能永远假设只有 15 个 HTML。

## 10. 上线后浏览器验收

### 10.1 页面与 SEO

- 首页、文章列表、Programs 列表和关于页正常；
- 每篇 Article 和每个 Program 详情直接打开、刷新正常；
- `/projects` 兼容链接正常；
- 未知地址显示项目 404，而不是首页；
- `/robots.txt` 可访问；
- `/sitemap-index.xml` 与其子 Sitemap 可访问；
- title、description、canonical 和 Open Graph 域名正确；
- 页面源代码中不再出现旧的 `free-fish.chatgpt.site` canonical。

本地构建后可检查旧域名残留：

```powershell
rg "free-fish\.chatgpt\.site" dist
```

设置新 `SITE_URL` 后，该命令不应发现旧 canonical 或 Sitemap 地址。若某处明确保留旧站迁移说明，应人工判断，而不是机械删除。

### 10.2 视觉与交互

- 桌面端完整滚动陆地、深海、海空过渡和星空；
- 从星空向上倒放回陆地；
- 375px 视口没有横向滚动；
- 系统 `prefers-reduced-motion: reduce` 下三个世界仍可辨识；
- `?motion=full` 不出现旋转、卡片重叠或人物遮挡回归；
- Programs 和文章入口可点击、可聚焦；
- Canvas 失败时 DOM 内容仍存在；
- 浏览器 Console 没有未处理错误；
- 动态流星离开星空后暂停，没有重复 Canvas、timer 或 RAF。

### 10.3 响应头

```powershell
curl.exe -I "https://<DOMAIN>/"
curl.exe -I "https://<DOMAIN>/assets/<HASHED-ASSET>"
```

检查安全响应头和 `/assets/*` 的 immutable 缓存策略。不要在没有完整浏览器验证时直接增加严格 CSP，因为 PixiJS、Astro 客户端脚本、图片和未来程序演示都可能受影响。

## 11. Preview 部署

Git 集成后，非生产分支和 Pull Request 会生成：

```text
https://<HASH>.<PROJECT_NAME>.pages.dev
https://<BRANCH>.<PROJECT_NAME>.pages.dev
```

建议流程：

1. 功能或视觉修改先推送非 `main` 分支；
2. 在 Preview URL 完成桌面、移动端和 Reduced Motion 检查；
3. 确认构建与控制台无错误；
4. 合并到 `main`；
5. Cloudflare 自动发布 Production。

Cloudflare 默认给 Preview 部署添加 `X-Robots-Tag: noindex`。如预览内容不希望公开，可以在 Pages 项目中为 Preview 启用 Cloudflare Access；不要误把正式生产域名也限制为登录后访问。

官方说明：[Preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)

## 12. 备选方案：Direct Upload

只有不希望 GitHub 每次推送自动部署时，才建议创建 Direct Upload 项目。项目创建时要先决定 Git integration 或 Direct Upload；Cloudflare 当前不支持在同一个 Pages 项目中随意切换两种项目类型。

### 12.1 Wrangler 上传

```powershell
Set-Location D:\Work\walk_fish_net\03_SourceCode\Website
$env:SITE_URL = "https://<PROJECT_NAME>.pages.dev"
$env:BASE_PATH = "/"
npm ci
npm run check
npm run lint
npm test
npm run build
npx wrangler login
npx wrangler pages project create
$projectName = "pixel-walk-journey"
npx wrangler pages deploy dist --project-name=$projectName --branch=main
```

Wrangler 上传的是 `dist` 文件夹，不是源码目录、压缩包或 `sites-dist`。

### 12.2 Dashboard 拖拽上传

1. 本地完成 `npm run build`；
2. 打开 **Workers & Pages → Create application**；
3. 选择 Direct Upload/Drag and drop；
4. 上传整个 `dist/` 文件夹，或上传包含 `dist` 内容的 ZIP；
5. 等待部署完成并执行上线验收。

当前官方限制中，Wrangler 最多上传 20,000 个文件，Dashboard 拖拽最多 1,000 个文件，单文件上限 25 MiB。限制可能变化，上线前以 [Direct Upload 官方文档](https://developers.cloudflare.com/pages/get-started/direct-upload/) 为准。

## 13. 回滚

如果新版本上线后发现严重问题：

1. 打开 Cloudflare Pages 项目；
2. 进入 Deployments；
3. 找到最近一次已通过验收的 Production deployment；
4. 选择回滚到该成功版本；
5. 等待生产域名指向旧版本；
6. 重新验证首页、详情页、404 和关键动画；
7. 在 Git 中修复问题，不要只依赖 Cloudflare 回滚长期维持代码与线上不一致。

Cloudflare Pages 的回滚只应指向以前成功的生产部署。回滚完成后，Git `main` 仍可能包含有问题的 commit；修复或 revert 后应再次正常发布，让源码与线上状态重新一致。

## 14. 常见故障排查

| 现象 | 常见原因 | 处理方式 |
| --- | --- | --- |
| 找不到 `package.json` | Root directory 未设置 | 设置为 `03_SourceCode/Website` |
| Node 版本或依赖安装失败 | 构建镜像 Node 不符合项目要求 | 设置 `NODE_VERSION=22.16.0`，使用 `npm ci` |
| 构建成功但首页 404 | 输出目录错误或缺少 `index.html` | 输出目录使用 `dist`，检查 `dist/index.html` |
| 详情页刷新 404 | 没有生成静态详情 HTML | 检查 `getStaticPaths()`、内容 slug 和 `dist/<route>/index.html` |
| 未知路由显示首页 | 顶层 `404.html` 缺失，触发 SPA fallback | 确认 `dist/404.html` 存在 |
| 图片、JS 或 CSS 404 | `BASE_PATH` 错误 | Cloudflare 根域部署设置为 `/` 后重建 |
| Sitemap/canonical 仍是旧域名 | `SITE_URL` 未更新 | 更新 Cloudflare 环境变量并重新部署 |
| 新浪花没有上线 | 只替换了参考素材 | 运行素材处理脚本并确认 `src/assets/m5-5/` 已更新 |
| 浪花出现整块蓝底 | 参考 PNG 背景不透明 | 先清除蓝底 Alpha，再运行处理脚本 |
| 自定义域名出现 522 | 只配置了 CNAME，未在 Pages 关联域名 | 先在 Custom domains 添加域名，再配置 DNS |
| 线上仍显示旧资源 | 浏览器/CDN 缓存或部署版本错误 | 确认部署 commit；硬刷新；必要时再 Purge Cache |
| 网站要求登录 | Cloudflare Access 策略覆盖了生产域名 | 调整 Access，仅保护 Preview 或按目标开放 Production |
| Git push 后没有部署 | Production branch 或自动构建被关闭 | 检查 Git 集成和 Branch control |
| 构建用了 Sites Worker | 错用了 `build:sites` | 改回 `npm run build` 和 `dist` |

Cloudflare 官方排障入口：[Debugging Pages](https://developers.cloudflare.com/pages/configuration/debugging-pages/)

## 15. 安全与隐私

- 不把 Cloudflare API Token 写入 Git、`.env` 示例或前端代码；
- Git 集成优先使用 Cloudflare GitHub App，不需要个人 Token；
- Direct Upload 的 CI Token 使用 Cloudflare CI Secret；
- `SITE_URL`、`BASE_PATH` 和 `NODE_VERSION` 不是秘密；
- 不创建本项目不需要的 Pages Functions、D1、KV 或 R2 binding；
- 不在构建日志中输出凭证；
- 发布前执行秘密扫描并检查浏览器 Network；
- 任何发送到浏览器的环境变量都不能视为秘密。

## 16. 正式上线完成标准

只有满足以下条件，才可把 `tasks.md` 的 `M9-06` 标记为完成：

- Cloudflare Pages Production 部署成功；
- 最终公开域名已确定；
- `SITE_URL` 和 `BASE_PATH` 与公开域名一致；
- 生产构建、类型检查、Lint 和测试通过；
- 所有当前静态路由通过线上验证；
- 未知路由返回 404；
- Article 和 Program 详情直接刷新成功；
- Projects 兼容链接可用；
- robots、Sitemap、canonical 和 Open Graph 正确；
- 桌面、375px、Reduced Motion 和倒放通过；
- Console 没有未处理错误；
- 自定义域名和 HTTPS 正常；
- 已记录生产 URL、部署日期和对应 Git commit；
- 已确认 M9 其他内容门禁不会对公众造成误导。

## 17. 一页式发布清单

### 发布前

- [ ] 确认 M9 内容、许可、隐私和 SEO 门禁；
- [ ] 确认 Git 工作区和待发布 commit；
- [ ] 更新需要进入生产包的素材；
- [ ] 设置正确的 `SITE_URL` 和 `BASE_PATH`；
- [ ] `npm ci`；
- [ ] `npm run check`；
- [ ] `npm run lint`；
- [ ] `npm test`；
- [ ] `npm run build`；
- [ ] 检查 `dist/`、15 个当前 HTML 和 `dist/server` 不存在；
- [ ] 纯静态服务器验证；
- [ ] 推送待发布 commit 到 GitHub。

### Cloudflare

- [ ] GitHub 仓库与 `main` 分支正确；
- [ ] Root directory 为 `03_SourceCode/Website`；
- [ ] Build command 为 `npm run build`；
- [ ] Output directory 为 `dist`；
- [ ] `NODE_VERSION` 正确；
- [ ] Production/Preview 环境变量正确；
- [ ] 部署日志没有错误；
- [ ] 记录生产和 Preview URL。

### 发布后

- [ ] 当前全部静态路由返回 200；
- [ ] 未知路由返回 404；
- [ ] 详情页直接刷新；
- [ ] Projects 旧地址兼容；
- [ ] Sitemap、robots、canonical、Open Graph；
- [ ] 桌面、375px、Reduced Motion；
- [ ] 正向滚动和反向倒放；
- [ ] Canvas 降级与键盘入口；
- [ ] Console 和 Network；
- [ ] 自定义域名与 HTTPS；
- [ ] 必要时演练回滚。

## 18. 官方参考

- [Cloudflare Pages Astro guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Build image and Node version](https://developers.cloudflare.com/pages/configuration/build-image/)
- [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)
- [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Serving Pages and 404 behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Custom headers](https://developers.cloudflare.com/pages/configuration/headers/)
- [Preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
- [Cloudflare Pages debugging](https://developers.cloudflare.com/pages/configuration/debugging-pages/)

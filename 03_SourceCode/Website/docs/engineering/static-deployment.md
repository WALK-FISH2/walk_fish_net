# 静态部署 Static Deployment

## 1. 当前实现

项目使用 Astro 5 静态输出：

```text
Framework: Astro 5.18.2
Build command: npm run build
Output directory: dist/
Output mode: static
Build format: directory
Node runtime: 仅开发、构建和测试使用
```

`astro.config.mjs` 必须保持 `output: "static"`。生产站点直接托管 `dist/`，不需要常驻 Node 服务、数据库、SSR adapter 或请求期 API。

## 2. 本地验证命令

```powershell
npm run check
npm run lint
npm test
npm run build
Set-Location dist
python -m http.server 4173 --bind 127.0.0.1
```

静态服务器启动后必须逐一访问固定页面、内容详情、兼容路由和未知路由。不能用 Astro Preview、SPA fallback 或开发服务器代替纯静态验证。

## 3. 主路由

```text
/
/articles/
/articles/<slug>/
/programs/
/programs/<slug>/
/about/
/404.html
```

`/programs` 是“做点啥呢”的唯一 canonical 主路由。

## 4. 兼容路由

```text
/projects/
/projects/<slug>/
```

已公开的 `/projects` 地址必须保留静态兼容页面并跳转到对应 `/programs` 地址。兼容页应包含：

- 指向新地址的 canonical；
- `noindex,follow`；
- 无脚本环境可点击的新地址；
- 静态主机可执行的页面级跳转。

Sitemap 只收录 `/programs` 主路由，不收录 `/projects` 兼容页。

## 5. 构建产物检查

每次生产构建至少确认：

1. `dist/index.html` 存在；
2. 所有公开 Article 和 Program 详情均有独立 `index.html`；
3. 所有兼容 Project 路由均有独立跳转 HTML；
4. `dist/404.html`、`dist/robots.txt` 和 Sitemap 存在；
5. `dist/server` 不存在；
6. 核心 `dist/` 中没有 Node 服务端运行时文件。

## 6. 子路径部署

`SITE_URL` 和 `BASE_PATH` 由 `astro.config.mjs` 统一读取。例如：

```powershell
$env:SITE_URL = "https://example.github.io"
$env:BASE_PATH = "/pixel-walk"
npm run build
```

验证时必须确认：

- 带 base path 的固定页、列表页、详情页和兼容页可访问；
- JS、CSS、图片和 manifest 使用正确前缀；
- canonical 使用完整主路由；
- 页面内部链接保留 base path；
- 旧 `/projects` 路径跳转到同一 base path 下的 `/programs`。

## 7. GitHub Pages

- Build command：`npm run build`；
- Output directory：`dist`；
- Node：满足 `package.json#engines`；
- 项目站点设置正确的 `SITE_URL` 与 `BASE_PATH`；
- 不使用 SPA fallback 掩盖缺失的静态详情页；
- 页面级兼容跳转保证旧链接在 GitHub Pages 上仍可用。

## 8. Cloudflare Pages

完整的项目专用上线步骤、环境变量、域名、验收、回滚和故障排查见：[`cloudflare-deployment.md`](./cloudflare-deployment.md)。

- Build command：`npm run build`；
- Output directory：`dist`；
- Root directory：网站项目根目录；
- 不配置不必要的 Pages Functions；
- 如平台支持 HTTP 重定向，可在页面级兼容之外增加 301/308，但不能删除静态兼容页。

## 9. Sites 部署

`npm run build:sites` 先生成核心 `dist/`，再把静态产物复制到 `sites-dist/client/`，并生成只负责静态资源读取与目录索引回退的 Worker。该适配不改变 Astro 核心产物的纯静态边界。

## 10. 发布验收

发布前后检查：

- 首页、关于页、文章和 Programs 列表；
- 每篇文章和每个 Program 详情直接刷新；
- `/projects` 及每个旧 slug 的兼容跳转；
- 404、Sitemap、robots、canonical、Open Graph；
- 子路径资源和内部链接；
- 移动端导航及浏览器控制台；
- 不运行 Node 服务时仍能完整访问核心输出。

## 11. 已验证基线

2026-07-17 在 Astro 迁移后的仓库执行：

- `npm run build`：成功；
- 默认输出：`dist/`；
- Programs 迁移后静态 HTML：15 个，其中 11 个主页面、4 个 Projects 兼容页；
- 纯静态服务器：15 个主/兼容路由均为 HTTP 200；
- 未知路由：HTTP 404；
- 子路径构建：15 个路由、抽查资源、旧路由跳转目标、内部链接和 canonical 验证通过；
- Sitemap：包含 Programs 主路由，不包含 Projects 兼容路由；
- `npm run check`：0 errors / 0 warnings / 0 hints；
- `npm run lint`：通过；
- `npm test`：4 项测试全部通过。

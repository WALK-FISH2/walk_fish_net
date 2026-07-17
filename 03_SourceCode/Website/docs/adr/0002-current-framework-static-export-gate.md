# ADR 0002: 当前框架必须通过静态导出门禁

- Status: Accepted
- Date: 2026-07-17
- Decision Owners: 项目所有者

## Context

早期记录把实现描述为 vinext/React，并要求在宣布可部署到纯静态平台前验证动态路由、404、子路径和服务端运行时边界。

当前仓库事实已经改变：项目现使用 Astro 5.18.2，`astro.config.mjs` 明确配置 `output: "static"`，文章和 Program 详情路由通过 `getStaticPaths()` 在构建期生成。

Sites 源码仓库的 `3cd17db` 已确认是 Astro 静态迁移提交。本地 Vibe Coding 文档最初位于另一条 Git 历史，首次对账时无法解析该提交；发布准备阶段只读获取 Sites 历史后，已结合该提交、当前代码、当前命令结果和上一轮浏览器证据完成门禁复核。

## Decision

接受当前 Astro 静态架构，静态导出门禁通过。

默认生产产物是 `dist/`，可由普通静态文件服务器直接托管；网站请求期不需要常驻 Node 服务端。后续不得在没有新 ADR 的情况下引入 SSR adapter、请求期 API、服务端会话或其他常驻运行时依赖。

Program 领域迁移完成后，`/programs` 和 `/programs/[slug]` 成为 canonical 主路由；`/projects` 与旧 slug 继续生成静态兼容页。

## Verification

2026-07-17 执行并核对：

1. `npm ls --depth=0`：Astro 5.18.2、React 19.2.6、PixiJS 8.8.1、GSAP 3.13.0。
2. `npm run build`：成功；Astro 报告静态输出，目录为 `dist/`，生成 15 个 HTML。
3. 输出审查：`dist/server` 不存在，`dist/` 中没有 `.cjs`、`.mjs` 或 `.node` 服务端运行时文件。
4. 路由审查：`src/pages/articles/[slug].astro` 与 `src/pages/programs/[slug].astro` 使用 `getStaticPaths()`；Projects 兼容页使用 Programs slug 集合生成。
5. 静态服务器：以 `python -m http.server` 托管 `dist/`，15 个主/兼容路由均返回 HTTP 200，未知路由返回 404。
6. Program 路由检查：`/programs/` 与 3 个详情页均返回 200；4 个 Projects 旧地址保留静态跳转。
7. 子路径：使用 `SITE_URL=https://example.github.io`、`BASE_PATH=/pixel-walk-audit` 构建后，15 个带前缀路由和抽查资源均返回 HTTP 200；旧路由目标、资源路径和 canonical 均包含前缀。
8. 质量门禁：`npm run check` 为 0 errors / 0 warnings / 0 hints；`npm run lint` 通过；`npm test` 构建成功且 4 项测试通过。

## Consequences

- GitHub Pages、Cloudflare Pages 或等价静态托管在架构上可行；
- Node.js 保留为开发、构建、部署适配和测试工具，不作为线上请求期运行时；
- 动态详情页必须继续在构建期提供完整路径集合；
- 新增路由必须进入静态构建、独立静态服务器、404 与子路径验证；
- `npm run build:sites` 产生的单独 Sites Worker 只用于静态资源转发，不改变核心 `dist/` 的纯静态边界；
- `docs/engineering/static-deployment.md` 仍需在 M1-11 中同步本次结论；
- Program 领域迁移结果由 M2 与 ADR 0009 记录；后续新增 Program 必须保持静态路径和旧链接兼容。

## Alternatives

- 保留早期 vinext 假设：与当前代码事实不符，拒绝；
- 改为 SSR 托管：当前没有需求，且违反 static-first 原则，拒绝；
- 因历史建议直接重建：Astro 迁移已完成且静态门禁已通过，无需再次迁移，拒绝。

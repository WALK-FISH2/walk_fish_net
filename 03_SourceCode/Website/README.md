# PIXEL//WALK 个人像素叙事网站

一个以滚动进度驱动的 Astro 静态个人网站。首页使用 PixiJS 绘制陆地、下潜、深海与太空，GSAP 只负责把页面滚动映射为可逆的 `progress: 0 → 1`；文章、项目、导航和链接始终由可访问的真实 DOM 承载。

## 静态导出审计

原 vinext 构建只生成 Worker/SSR 产物，`dist/` 内没有独立 HTML，因此不能直接部署到 GitHub Pages。项目已最小迁移到 Astro 5：保留原有 Markdown/MDX 内容、路由结构、React 交互岛和场景控制器，`npm run build` 现在会为首页、列表页、详情页、关于页与 404 生成独立 HTML，不依赖 Node 或 Worker 运行时。

## 本地运行与检查

需要 Node.js `>= 22.13.0`。

```bash
npm install
npm run dev
```

默认访问 `http://localhost:4321`。

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

纯静态成品位于 `dist/`。`npm run build:sites` 会在不改变 `dist/` 静态属性的前提下，另行生成 `sites-dist/` 发布适配目录。

## 内容维护

个人信息、导航与链接集中在 `src/config/site.config.ts`。文章放在 `src/content/articles/`，项目放在 `src/content/projects/`；Astro Content Collections 会在构建期校验 frontmatter，并由 `getStaticPaths()` 生成全部详情页。

文章常用字段：

```yaml
---
title: 文章标题
description: 文章摘要
publishDate: 2026-07-17
updatedDate: 2026-07-17
tags: [前端, Python]
featured: true
order: 1
draft: false
---
```

项目常用字段：

```yaml
---
title: 项目名称
summary: 一句话说明项目解决的问题
status: 已完成
startDate: 2026-01
endDate: 2026-06
featured: true
order: 1
stack: [Astro, TypeScript]
tags: [Web]
demoUrl: ""
sourceUrl: ""
draft: false
---
```

空的演示或源码地址不会渲染按钮；生产构建会排除 `draft: true`。

## 场景结构

- `src/config/story.config.ts`：唯一的阶段区间、滚动高度与画质配置。
- `src/components/ImmersiveHome.tsx`：滚动绑定、DOM 叙事层、进度导航和降级状态。
- `src/interactive/SceneController.ts`：Pixi 生命周期、DPR、可见性、WebGL 丢失与场景混合。
- `src/interactive/scenes/OverworldScene.ts`：六层陆地景深、双层云、远山、树林、道路和前景。
- `src/interactive/transitions/DiveTransition.ts`：M4.5 三层像素浪、泡沫幕、反射带与连续入水。
- `src/interactive/scenes/UnderwaterScene.ts`：光束、鱼群、遗迹、水母、海草和前景遮挡。
- `src/interactive/transitions/morphParticles.ts`：固定种子的统一 `MorphParticle` 池与气泡/星点/流星三态目标。
- `src/interactive/transitions/OceanToSpaceTransition.ts`：定向气泡流、同粒子形变、像素流星尾迹与光束到银河过渡。
- `src/interactive/scenes/SpaceScene.ts`：星空底色、星云、星座、行星与信号站；M5/M6 星点和流星继续由统一粒子过渡层持有。

场景使用原创程序化像素图形，没有引入第三方受版权限制素材。桌面端、移动端和 `prefers-reduced-motion` 模式下的 Canvas 世界、正文与固定 UI 始终保持水平，海洋到星空只通过颜色、光束、透明度和粒子形态平滑过渡，不使用任何角度的世界旋转、翻转或倾斜。

## 静态部署

### GitHub Pages

仓库内 `.github/workflows/deploy-pages.yml` 已配置 Astro 官方 Pages 工作流。项目站点构建时需要：

```text
SITE_URL=https://<account>.github.io
BASE_PATH=/<repository>
```

自定义域名或用户站点可将 `BASE_PATH` 设为 `/`。

### Cloudflare Pages

构建命令使用 `npm run build`，输出目录使用 `dist`。不需要数据库、密钥或服务端运行时。

### Sites 发布

运行 `npm run build:sites` 后发布 `sites-dist/`。该目录只为当前 Sites 托管层增加静态资源转发入口；标准静态交付物仍是 `dist/`。

## 仍可继续精修

当前已完成第二轮核心视觉升级、M4.5 陆海三层浪与 M5 气泡到繁星/流星的统一粒子过渡。后续重点是 M6 星空世界的独立正式验收与最终素材替换；MDX 自定义交互组件、代码 token 高亮、RSS、音频与视频也尚未加入。

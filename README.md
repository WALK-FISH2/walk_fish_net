# PIXEL//WALK 个人像素叙事网站

这是需求文档第一轮范围的可运行骨架：内容来自 Markdown/MDX，首页用 PixiJS 与 GSAP 把陆地、深海和星空连接为一条可逆滚动旅程，所有关键信息仍由真实 DOM 渲染。

## 当前已完成

- 首页 900vh 桌面滚动旅程，移动端缩短为约 650vh；
- 陆地、下潜、深海、浪花翻转、星空的几何像素占位场景；
- 单一标准化 `progress: 0 → 1` 与统一 `SceneController`；
- 首页精选文章、精选项目、关于我和阶段进度导航；
- 文章列表、搜索、标签筛选、详情、目录、上下篇；
- 项目列表、技术栈/状态筛选、详情与可选演示/源码按钮；
- 响应式菜单、ESC 关闭、焦点约束、Skip Link 和可见焦点；
- `prefers-reduced-motion` 静态分区模式；
- Canvas/WebGL 失败时的 CSS 背景降级；
- 404、canonical、Open Graph、sitemap、robots 和 manifest；
- Sites/Cloudflare Worker 兼容生产构建。

## 本地运行

要求 Node.js `>= 22.13.0`。

```bash
npm install
npm run dev
```

默认访问 `http://localhost:3000`。

质量检查：

```bash
npm run typecheck
npm run lint
npm test
```

仅生成生产构建：

```bash
npm run build
```

## 修改个人信息

统一编辑 `app/config/site.config.ts`：

- `author`：姓名或品牌名；
- `role`：首页个人定位；
- `email`、`github`：联系方式；
- `url`：正式域名，也可以在构建时设置 `NEXT_PUBLIC_SITE_URL`；
- `nav`：顶部导航。

## 新增文章

在 `app/content/articles/` 新建 `.md` 或 `.mdx`：

```yaml
---
title: 文章标题
description: 文章摘要
publishDate: 2026-07-17
updatedDate: 2026-07-17
tags:
  - 前端
  - Python
featured: true
order: 1
draft: false
---
```

保存后会自动进入文章列表。`featured: true` 的前三篇会进入首页；生产构建会排除 `draft: true`。

正文支持常见 Markdown：标题、链接、列表、引用、代码块和表格。MDX 文件在本轮按 Markdown 内容读取；还未开放正文中的自定义 React 组件。

## 新增项目

在 `app/content/projects/` 新建 `.md` 或 `.mdx`：

```yaml
---
title: 项目名称
slug: project-name
summary: 一句话说明项目解决的问题
status: 已完成
startDate: 2026-01
endDate: 2026-06
featured: true
order: 1
stack:
  - React
  - TypeScript
tags:
  - Web
demoUrl: ""
sourceUrl: ""
draft: false
---
```

`demoUrl` 或 `sourceUrl` 为空时，对应按钮不会渲染。外部演示必须明确真实能力，不能在静态前端中伪造后端功能。

## 场景架构

关键文件：

```text
app/config/story.config.ts
app/interactive/SceneController.ts
app/interactive/scenes/OverworldScene.ts
app/interactive/scenes/UnderwaterScene.ts
app/interactive/scenes/SpaceScene.ts
app/components/immersive-home.tsx
```

`immersive-home.tsx` 只负责读取滚动和 DOM 交互；`SceneController` 管理 PixiJS 生命周期、画质、可见性与 WebGL context lost；每个场景只读取自己的局部进度。

所有阶段比例、粒子档位和滚动高度都在 `story.config.ts` 中。不要在场景类里复制时间线区间。

## 替换最终美术

本轮遵循需求文档建议，先用原创几何像素图形验证架构。后续建议：

1. 为陆地、深海、星空分别制作授权清晰的纹理图集；
2. 保持 nearest-neighbor，逻辑像素尺寸优先使用 32/48/64/96；
3. 在场景类内部替换 `Graphics`，不要把文章和按钮画进 Canvas；
4. 为素材增加失败回退，不让加载页无限等待；
5. 字体放入 `public/fonts/`，同时提交许可证；
6. 第二轮优先精修三层浪花、翻转和泡沫转星点。

## 部署

当前构建保留 Sites 提供的 vinext/Cloudflare Worker 结构，`npm run build` 会生成 `dist/`。项目不含数据库、身份认证、密钥或传统后端业务。

如果必须直接部署到 GitHub Pages，需要在后续单独增加纯静态导出适配；当前交付优先保证 Sites/Cloudflare 深链接刷新可用。

## 已知限制

- 当前是第一轮架构与占位美术，不是最终像素素材；
- MDX 暂不执行自定义组件，只按 Markdown 内容展示；
- 代码块已有可读主题，但尚未接入逐 token 语法高亮；
- 未实现音频、截图画廊、GIF/视频或 iframe 演示；
- 未实现 RSS；
- 当前运行环境使用 vinext/React，而不是需求建议中的 Astro；内容组织与交互模块保持解耦，后续若改为 Astro，Markdown 内容和场景控制器可继续复用。

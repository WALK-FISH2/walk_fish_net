# 任务清单 Tasks

更新时间：2026-07-17

```text
[ ] 未开始
[~] 已由Codex汇报完成，待独立验证
[x] 已完成且已验证
[!] 阻塞
[-] 取消
```

## M0：第一轮骨架

- [~] `M0-01` 三段可逆滚动框架
- [~] `M0-02` Markdown/MDX 文章系统
- [~] `M0-03` 原项目内容系统
- [~] `M0-04` 搜索和筛选
- [~] `M0-05` 详情页
- [~] `M0-06` 关于我
- [~] `M0-07` 404
- [~] `M0-08` 响应式导航
- [~] `M0-09` Reduced Motion
- [~] `M0-10` SEO
- [~] `M0-11` 降级模式
- [~] `M0-12` 类型检查
- [~] `M0-13` ESLint
- [~] `M0-14` 生产构建
- [~] `M0-15` 三组路由测试

验证要求：找到实际命令、保存关键输出、记录构建目录并浏览器复查后，才能改为 `[x]`。

## 本次状态对账基线（2026-07-17）

- Git：Sites 源码仓库的 `3cd17db` 已核对，提交标题为“migrate pixel journey to static Astro world”，包含 Astro 静态迁移基线。本地文档最初位于不相连的历史，首次对账时无法解析；发布准备阶段只读获取该历史后，已将它与当前代码、命令结果和上一轮浏览器证据共同纳入核对。
- 技术栈：`npm ls --depth=0` 验证为 Astro `5.18.2`、React `19.2.6`、PixiJS `8.8.1`、GSAP `3.13.0`；`astro.config.mjs` 明确配置 `output: "static"`。
- 构建：`npm run build` 成功，输出目录为 `dist/`，Programs 迁移后共生成 15 个 HTML；`dist/server` 不存在，输出内没有 Node 服务端运行时。
- 静态服务：以 `python -m http.server` 托管 `dist/`，11 个主页面和 4 个 Projects 兼容页均返回 HTTP 200，未知路由返回 404。
- 子路径：以 `SITE_URL=https://example.github.io`、`BASE_PATH=/pixel-walk-audit` 重新构建并静态托管，15 个带前缀路由和抽查资源均返回 HTTP 200，旧路由目标、内部链接、资源路径和 canonical 均包含前缀。
- 质量命令：`npm run check` 为 0 errors / 0 warnings / 0 hints；`npm run lint` 通过；`npm test` 构建成功且 4 项静态输出测试全部通过。
- 浏览器证据：上一轮留存了桌面端 0%、25%、50%、72%、90% 和移动端 0%、55%、菜单截图；没有 76%、80% 截图，也没有独立的反向滚动验收记录。

## M1：静态导出审查

- [x] `M1-01` 检查当前框架和版本（证据：`package.json`、`npm ls --depth=0`；Astro 5.18.2 + React 19.2.6）
- [x] `M1-02` 检查 SSR、API 和 Node 运行时依赖（证据：`astro.config.mjs` 为静态输出；源码无服务端适配器或请求期 API；`dist/server` 不存在）
- [x] `M1-03` 检查文章动态路由生成（证据：`src/pages/articles/[slug].astro` 使用 `getStaticPaths()`；构建生成 3 个文章详情 HTML）
- [x] `M1-04` 检查程序动态路由生成（证据：`src/pages/programs/[slug].astro` 通过 `getStaticPaths()` 生成 3 个 Program 详情；旧 Projects slug 生成对应兼容页）
- [x] `M1-05` 生成纯静态输出目录（证据：`npm run build` 成功，`dist/` 含 15 个 HTML）
- [x] `M1-06` 使用静态服务器预览（证据：`python -m http.server 4173 --bind 127.0.0.1` 可独立托管 `dist/`）
- [x] `M1-07` 刷新全部详情路由（证据：3 个文章详情、3 个 Program 详情和 3 个旧 slug 兼容页逐一请求均为 HTTP 200）
- [x] `M1-08` 验证 404（证据：`dist/404.html` 存在；`/missing-audit/` 返回 HTTP 404）
- [x] `M1-09` 验证子路径部署（证据：`BASE_PATH=/pixel-walk-audit` 构建后，15 个路由和抽查资源均为 HTTP 200）
- [x] `M1-10` 完成 ADR 0002（证据：ADR 0002 已按静态门禁结果更新为 Accepted）
- [x] `M1-11` 更新部署文档（证据：`docs/engineering/static-deployment.md` 已同步 Astro、`dist/`、Programs/Projects 路由、子路径和 Sites 部署边界）

## M2：Programs 领域迁移

- [x] `M2-01` 统计 Project/projects 使用位置（证据：`rg` 在 `src/`、`tests/` 的 14 个文件中找到 100 次 `Project/project/projects` 匹配）
- [x] `M2-02` 定义 Program 类型（证据：`src/types/content.ts` 的 `ProgramSummary`，内容处理统一使用 `kind: "program"`）
- [x] `M2-03` 定义 ProgramStatus（证据：completed / in-progress / prototype / archived 类型与 schema 枚举）
- [x] `M2-04` 定义 DemoType（证据：六种演示类型均进入类型、schema 和详情页分支）
- [x] `M2-05` 添加 ownerContribution（证据：schema 至少一项，三个 Program 示例及详情页均已渲染）
- [x] `M2-06` 添加 limitations 和 privacy（证据：schema、三个示例及详情页固定区块）
- [x] `M2-07` 新建 programs 内容目录（证据：`src/content/programs/` 与 `programs` collection）
- [x] `M2-08` 迁移示例内容（证据：pixel-journey、tidy-desk、signal-garden 已迁移，旧 projects 内容文件删除）
- [x] `M2-09` 导航显示“做点啥呢”（证据：`src/components/SiteNav.astro` 当前导航文案）
- [x] `M2-10` 新建 `/programs`（证据：静态列表页返回 HTTP 200，canonical 指向 `/programs/`）
- [x] `M2-11` 新建 `/programs/[slug]`（证据：3 个 Program 详情 HTML 均返回 HTTP 200，并显示八个固定内容区块）
- [x] `M2-12` 兼容 `/projects`（证据：列表和 3 个 slug 均生成静态兼容页，包含新 canonical、noindex、脚本/meta/无脚本跳转）
- [x] `M2-13` 更新 SEO、搜索和筛选（证据：Program 搜索覆盖简介/分类/技术栈/标签/本人贡献，支持状态和分类筛选；Sitemap 排除 Projects，详情输出 SoftwareApplication）
- [x] `M2-14` 更新内容文档和测试（证据：内容维护文档、架构、部署文档和 4 项静态输出测试已同步并通过）

## M3：陆地世界

阶段状态：`[x]` 已于 2026-07-17 正式验收，10/10 项完成。

- [x] `M3-01` 建立陆地色板（代码证据：`src/interactive/scenes/OverworldScene.ts` 的陆地渐变和分层颜色）
- [x] `M3-02` 天空渐变与两层云（代码证据：天空渐变带及两组不同速度的云层循环）
- [x] `M3-03` 远山、丘陵和中景（代码证据：远山、丘陵、塔与树木分层绘制）
- [x] `M3-04` 草地与前景遮挡（代码证据：草地、路径、花朵和前景层）
- [x] `M3-05` 原创引导物（代码证据：旅行者和塔的原创像素化引导构图）
- [x] `M3-06` 视差配置（代码证据：`src/config/story.config.ts` 集中定义最大位移、远景、中景、近景、前景强度及层内倍率；`OverworldScene.ts` 只读取配置；静态边界测试确认旧系数不再散落）
- [x] `M3-07` 路牌式文章卡片（代码证据：`src/components/ImmersiveHome.tsx` 和 `src/styles/global.css` 的 road-sign DOM/CSS；浏览器证据：首篇文章指针点击进入 `/articles/first-post/`，第二篇链接获得键盘焦点，`activeElement.href` 为 `/articles/content-as-levels/`）
- [x] `M3-08` 首屏面板精修（代码证据：Hero DOM/CSS；浏览器证据：1280×720、0%、陆地阶段截图 `m3-desktop-00.png`）
- [x] `M3-09` 移动端与 Reduced Motion（浏览器证据：375×812 时横向溢出为 0、Canvas 为 375×812、3 个文章入口仍存在；Reduced Motion 下 `matchMedia` 为 true、故事高度为 `auto`、Hero 为非 sticky 的 `relative`）
- [x] `M3-10` 0%、25% 截图验收（浏览器证据：`m3-desktop-00.png`、`m3-desktop-25.png`；25% 时 CSS 进度为 `0.25`，从 25% 回滚后为 `0`，截图 `m3-desktop-reverse-00.png`）

M3 正式验收证据：

- 命令：`npm run check` 为 0 errors / 0 warnings / 0 hints，`npm run lint` 通过，`npm test` 为 6/6，`npm run build` 生成 15 个静态 HTML；
- 正向/反向：桌面从 0% 滚至 25% 后再回到 0%，记录进度 `0 → 0.25 → 0`，阶段与导航始终为陆地；
- 视觉：0%、25% 与反向回到 0% 的截图均显示天空、云、山、丘陵、草地、路径、原创旅行者和前景遮挡，没有明显退化；
- 可访问性：文章链接可见、可用、可指针导航且可获得键盘焦点；Canvas 为 `aria-hidden="true"`；
- 降级：静态首页包含全部文章 DOM；Canvas 初始化异常与 WebGL context lost 均进入 `canvasFailed`，CSS 切换到 `.canvas-fallback`；对应静态边界测试通过；
- 稳定性：修复 resize 早于 Pixi renderer 初始化的竞态后，375px 切换与重载复验的浏览器 warn/error 列表为空；
- 阶段边界：`docs/product/dive-underwater-spec.md` 已被 Git 跟踪，本轮没有修改其内容，也没有开始 M4。

## M4：下潜与深海

- [x] `M4-01` 水面、水位上涨与折射（代码证据：`src/interactive/transitions/DiveTransition.ts` 的水位、谐波水面与气泡，配合 DOM 水线）
- [ ] `M4-02` 全屏入水和下潜镜头
  - 说明：水位可覆盖全屏，但没有找到明确的镜头向下位移/下潜变换证据，因此保持未完成。
- [x] `M4-03` 深海渐变与光束（代码证据：`src/interactive/scenes/UnderwaterScene.ts` 的深海渐变和光束）
- [x] `M4-04` 鱼群与气泡池（代码证据：远/中景鱼群与固定种子气泡）
- [x] `M4-05` 海草、珊瑚、水母和海床（代码证据：对应前中后景对象均已绘制）
- [x] `M4-06` 海底程序档案终端（代码证据：`ImmersiveHome.tsx` 的海底终端/探针/胶囊 DOM；当前内容仍是 Project 语义）
- [ ] `M4-07` 反向滚动
  - 说明：进度驱动代码具备可逆基础，但没有上一轮独立的反向滚动浏览器验收记录。
- [x] `M4-08` 50% 截图验收（浏览器证据：上一轮 `desktop-50.png`）

## M5：海洋到星空

- [ ] `M5-01` 局部时间线配置
  - 说明：全局阶段范围集中在 `src/config/story.config.ts`，但过渡内部的细分时序仍硬编码，未形成完整局部时间线配置。
- [ ] `M5-02` 水流增强和镜头上升
  - 说明：已有水面上升和波浪变化，但缺少“水流增强→镜头上升”完整序列及独立浏览器验证。
- [x] `M5-03` 远浪、中浪、前浪（代码证据：`src/interactive/transitions/OceanToSpaceTransition.ts` 的三层波浪）
- [ ] `M5-04` 泡沫对象池与固定种子
  - 说明：已使用 64 个固定种子泡沫，但仍逐帧重绘，没有对象池复用证据。
- [x] `M5-05` 背景翻转容器（代码证据：`src/interactive/SceneController.ts` 按过渡进度旋转世界容器）
- [x] `M5-06` DOM 保持水平（代码证据：Canvas 世界层旋转，`ImmersiveHome.tsx` 的内容 DOM 与 Canvas 分离）
- [ ] `M5-07` 泡沫转星点、气泡转星尘
  - 说明：泡沫到星点的形态映射已存在，但深海气泡不是同一批对象连续转换为星尘。
- [x] `M5-08` 高光转银河（代码证据：过渡高光逐步映射为银河带）
- [ ] `M5-09` 反向倒放无重置
  - 说明：实现采用确定性进度计算，但没有反向倒放浏览器验证，不能仅凭实现推断完成。
- [x] `M5-10` 移动端和 Reduced Motion（代码证据：移动端旋转上限与 Reduced Motion 静态替代；浏览器证据：375px/Reduced Motion 验证）
- [ ] `M5-11` 72%、76%、80% 截图验收
  - 说明：只有上一轮 `desktop-72.png`；76% 和 80% 截图不存在。

## M6：星空世界

- [x] `M6-01` 深色星空色板（代码证据：`src/interactive/scenes/SpaceScene.ts` 的深色渐变）
- [x] `M6-02` 三层星点、星云和银河（代码证据：三层固定种子星点、星云种子和银河）
- [x] `M6-03` 流星与星座（代码证据：流星、星座连线与星体绘制）
- [x] `M6-04` 漂浮信号站和关于我（代码证据：`ImmersiveHome.tsx` 的 signal station/about DOM）
- [x] `M6-05` 文章与程序星座入口（代码与构建证据：首页星座链接已改为 Programs，目标详情页均生成并返回 HTTP 200）
- [x] `M6-06` 页脚和重启旅程（代码证据：旅程末尾 footer/reset 控件及重置处理）
- [x] `M6-07` 90% 截图验收（浏览器证据：上一轮 `desktop-90.png`）

## M7：程序演示系统

- [ ] `M7-01` DemoRegistry
- [ ] `M7-02` 静态组件演示容器
- [ ] `M7-03` iframe 演示容器与 sandbox
- [ ] `M7-04` 外部链接和媒体演示
- [ ] `M7-05` Loading、错误和关闭状态
- [ ] `M7-06` 限制与隐私说明
- [ ] `M7-07` 演示懒加载和移动端
- [ ] `M7-08` 至少接入一个真实本人程序
- [ ] `M7-09` 演示隔离测试

## M8：质量

- [ ] `M8-01` 单元测试：进度映射与内容校验
- [ ] `M8-02` 单元测试：DemoRegistry
- [ ] `M8-03` 集成测试：文章和程序路由
- [ ] `M8-04` 集成测试：旧路由兼容
- [ ] `M8-05` E2E：完整和反向滚动
- [ ] `M8-06` E2E：Reduced Motion、375px、键盘
- [ ] `M8-07` E2E：404 和详情页刷新
- [ ] `M8-08` 控制台、内存和销毁检查

## M9：发布

- [ ] `M9-01` 替换真实姓名和联系方式
- [ ] `M9-02` 添加真实文章和程序
- [ ] `M9-03` 删除虚假占位内容
- [ ] `M9-04` 检查素材许可和秘密
- [ ] `M9-05` sitemap、robots、Open Graph
- [ ] `M9-06` GitHub Pages 和 Cloudflare Pages
- [ ] `M9-07` 更新 README、CHANGELOG 和发布检查表

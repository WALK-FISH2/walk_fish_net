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

阶段状态：`[x]` 已于 2026-07-17 正式验收，8/8 项完成。

- [x] `M4-01` 水面、水位上涨与折射（代码证据：`STORY_CONFIG.dive.timeline` 集中定义 30.0%–43.0% 的七段时间线，`getDiveState()` 同时驱动 Pixi 三层水线与 64px DOM 折射带；M4.5 复验：31.5% 远浪出现，32.8% 水面到 `0.82`，34.2% 水线到视口 `0.5`）
- [x] `M4-02` 全屏入水和下潜镜头（代码证据：`SceneController` 按 `landOmen` 调整陆地 tint，并按 `cameraDescent` 上移、缩小陆地容器；M4.5 复验：35.8% 前浪越过中部并由泡沫遮缝，36.8% 水面为顶部 `0.025`、38.0% 为 `0.018`，43.0% 退至 `-0.12`）
- [x] `M4-03` 深海渐变与光束（代码证据：`UnderwaterScene.ts` 的阶段化深海渐变、顶部光束和 `0.640–0.660` 光束倾斜预热；浏览器证据：43.0%、62.0%、65.99% 画面层次清晰）
- [x] `M4-04` 鱼群与气泡池（代码证据：远层鱼群、中层鱼群、下潜气泡和深海气泡均使用模块级固定池；预热阶段鱼群离开、气泡速度和水流轻量增强）
- [x] `M4-05` 海草、珊瑚、水母和海床（代码证据：远/中/近/前景分层配置，包含水母、海草、分枝珊瑚、非规则岩石、起伏海床和前景遮挡；移动端按画质缩减数量）
- [x] `M4-06` 海底程序档案终端（代码证据：`ImmersiveHome.tsx` 保持终端/探针/胶囊三种档案形态，明确“我本人编写”，并显示 Program 状态、演示类型、技术栈、当前限制和真实链接；不存在 Project 内容语义回退）
- [x] `M4-07` 反向滚动（浏览器证据：标准动效从 50% 依次回滚至 45%、40%、38%、36.5%、34.5%、32%、30%，水线位置单调恢复；Reduced Motion 下 30% 与 50% 的往返帧哈希分别完全一致，未发生水线、鱼群或气泡重置）
- [x] `M4-08` 50% 截图验收（浏览器证据：1280×720 标准动效 50% 显示 Programs 档案终端、两层鱼群、气泡、光束、海草、珊瑚、岩石和海床；同位置 650ms 后帧哈希变化，环境循环正常）

M4 正式验收证据：

- 关键进度：标准动效浏览器逐一命中 30.0%、31.5%、32.0%、34.5%、36.5%、38.0%、43.0%、50.0%、62.0% 和 65.99%，65.99% 仍为 `sea`，尚未进入 M5 海空过渡；
- 正向/反向：50%→30% 全路径连续；水线依次从视口外上方回到顶部、中部和底部，阶段从 `sea` 正确回到 `land`；
- 移动端：375×812 在 34.5% 时水线为 `0.5` 且顶部为 405.98px，在 50% 时 Program 卡片为单列、宽 334px、左边距 13px，无正向横向溢出（测得 `scrollWidth - innerWidth = -15`），所有 Program 链接可见且 `tabIndex=0`；
- Reduced Motion：系统媒体查询命中，环境循环停止；50% 间隔 650ms 的两帧 SHA-256 摘要一致，水线使用 24px 静态像素带；
- 可访问性：Programs 标题链接可见、可用、可获得焦点，指针点击实际进入 `/programs/pixel-journey/`；Canvas 保持 `aria-hidden="true"`；
- Canvas 降级：`?canvas=fallback` 浏览器验收中 Canvas 为 `display:none`、CSS fallback 为 `display:block`，3 篇文章、3 个 Programs 档案及其全部链接仍存在；
- 控制台：标准动效、Reduced Motion、375px 和 Canvas 降级四种浏览器状态的 warn/error 列表均为空；
- 命令：`npm run check` 为 0 errors / 0 warnings / 0 hints，`npm run lint` 通过，`npm test` 完成生产构建且 7/7 测试通过，生成 15 个静态 HTML；纯静态服务器下 15 个主/兼容页面均为 HTTP 200，未知路由为 HTTP 404；
- M5 边界：本轮只在 `0.640–0.660` 增强水流、海草、气泡、鱼群离开和光束倾斜，没有修改三层浪花、泡沫转星点或银河转换；背景世界旋转随后已作为 M4.5 需求更正全面取消。

## M4.5：陆地到海洋翻涌海浪精修

阶段状态：`[x]` 已于 2026-07-17 正式验收，17/17 项完成。

- [x] `M4.5-01` 审查现有陆海交接实现（证据：确认旧 `DiveTransition` 的三条波形共用同一水线公式、没有泡沫池；审查范围和 M5 边界已在实施前汇报）
- [x] `M4.5-02` 集中配置陆海过渡局部时间线（代码证据：`STORY_CONFIG.dive.timeline` 集中维护 `0.300–0.430` 七段时间线，`getLandOceanTransitionState()` 只按绝对进度计算状态）
- [x] `M4.5-03` 实现远浪（代码证据：`waves.far` 与独立 `farWave` Graphics；浏览器证据：31.5% 在视口底部先出现低幅远浪）
- [x] `M4.5-04` 实现中浪（代码证据：`waves.mid` 与独立 `midWave` Graphics；浏览器证据：32.8% 中浪跟随水面进入）
- [x] `M4.5-05` 实现前浪（代码证据：`waves.foreground` 与独立 `foregroundWave` Graphics；浏览器证据：34.2%–35.8% 前浪从接近视口底部连续越过中部并退出顶部）
- [x] `M4.5-06` 区分三层浪参数（代码证据：三层分别配置 amplitude、wavelength、phase、speed、alpha、pixelStep、blockSize、verticalOffset、crestBlocks 和 foamWeight）
- [x] `M4.5-07` 实现像素浪峰（代码证据：`drawPixelWaveLayer()` 使用步进采样、矩形浪体和独立浪峰块，不使用平滑矢量曲线）
- [x] `M4.5-08` 实现泡沫对象池（代码证据：模块级 96 项固定 `foamPool` 与复用 Graphics，源码无 `Math.random()`，逐帧不创建泡沫对象）
- [x] `M4.5-09` 使用泡沫遮挡场景接缝（代码证据：`seamCover`、三层浪峰泡沫和中部遮缝簇共同驱动；浏览器证据：35.0%–36.8% 的水陆接缝被泡沫/薄雾覆盖）
- [x] `M4.5-10` 实现镜头穿浪（代码证据：前浪基准位置按 `0.88 → 0.56 → -0.08` 穿过视口，陆地 tint、fade 与 cameraDescent 继续由同一进度状态驱动）
- [x] `M4.5-11` 实现水面退到顶部（浏览器证据：36.8% 水面为 `0.025`，38.0% 为 `0.018`；既有 `0.380–0.430` `surfaceRetreat` 继续将水面退至 `-0.12`）
- [x] `M4.5-12` 验证反向倒放（浏览器证据：38%→30% 的水线位置依次 `0.018 → 0.025 → 0.0725 → 0.2203 → 0.5000 → 0.8200 → 1.0800`，状态连续恢复且未重建池）
- [x] `M4.5-13` 移动端简化（代码证据：375px 下细节倍率 `0.72`、泡沫倍率 `0.38`、禁用薄雾；浏览器证据：31.5%、35.8%、38.0% 正常且无正向横向溢出）
- [x] `M4.5-14` Reduced Motion 浪幕（代码证据：只绘制单层 `drawReducedWaveCurtain()`，不绘制动态泡沫、薄雾和气泡；浏览器证据：35.8% 间隔 700ms 两帧及 38%→30%→35.8% 往返 SHA-256 均一致）
- [x] `M4.5-15` 完成关键进度截图验收（浏览器证据：1280×720 逐一保存并检查 31.5%、32.8%、34.2%、35.0%、35.8%、36.8%、38.0%；另验证 375×812、Reduced Motion 和 Canvas fallback）
- [x] `M4.5-16` 构建、测试与静态输出验证（命令证据：`npm run check`、`npm run lint`、`npm test`、`npm run build:sites` 全部通过；9/9 测试通过，生成 15 个静态 HTML，15 个主/兼容路由文件完整，`dist/server` 不存在）
- [x] `M4.5-17` 全面取消背景世界旋转（需求更正与代码证据：海洋到星空改为颜色、光束、透明度和粒子的平滑过渡；`SceneController` 全程固定 `world.rotation = 0`，删除桌面/移动端 `maxRotation` 和正弦旋转公式；回归测试确认旧旋转逻辑不存在）

M4.5 Definition of Done：

```text
陆地与水下不再直接切色
三层浪参数明显不同
泡沫遮挡接缝
可以向上完整倒放
海洋到星空期间世界方向始终为 0°
```

M4.5 正式验收证据：

- 标准动效：31.5% 远浪先出现，32.8% 中浪接近，34.2% 水线到中部，35.0% 三层分离，35.8% 前浪越过中部，36.8% 完全入水，38.0% 水面留在顶部；
- 确定性：`getLandOceanTransitionState()`、固定泡沫池和现有气泡池只依赖绝对进度与固定动画时间；38%→30% 倒放没有重置水线或对象池；
- 可访问性与降级：过渡中首篇文章链接和 Programs 导航均可见、可用、`tabIndex=0` 且可获得焦点；实际指针点击分别进入文章详情和 `/programs`；Canvas fallback 下核心 DOM 仍存在；
- 控制台：标准动效、375px、Reduced Motion 和 Canvas fallback 的浏览器 warn/error 列表为空；
- 固定方向证据：`SceneController.ts` 明确设置 `world.rotation = 0`；第 9 项测试锁定该约束，并排除旧 `maxRotation` 与正弦旋转公式；
- M5 边界：本次只移除世界旋转并建立固定方向约束，`OceanToSpaceTransition.ts`、M5 `0.660–0.800` 粒子时间线、泡沫转星点和银河转换未重做，M5 其余状态保持不变。

## M5：海洋到星空

- [ ] `M5-01` 局部时间线配置
  - 说明：全局阶段范围集中在 `src/config/story.config.ts`，但过渡内部的细分时序仍硬编码，未形成完整局部时间线配置。
- [ ] `M5-02` 水流增强和镜头上升
  - 说明：已有水面上升和波浪变化，但缺少“水流增强→镜头上升”完整序列及独立浏览器验证。
- [x] `M5-03` 远浪、中浪、前浪（代码证据：`src/interactive/transitions/OceanToSpaceTransition.ts` 的三层波浪）
- [ ] `M5-04` 泡沫对象池与固定种子
  - 说明：已使用 64 个固定种子泡沫，但仍逐帧重绘，没有对象池复用证据。
- ~~`M5-05` 背景翻转容器~~（需求更正：该效果已由 `M4.5-17` 全面取消，不再属于产品目标或待办项）
- [x] `M5-06` 世界与 DOM 保持水平（代码证据：`SceneController` 固定 `world.rotation = 0`，`ImmersiveHome.tsx` 的内容 DOM 与 Canvas 分离）
- [ ] `M5-07` 泡沫转星点、气泡转星尘
  - 说明：泡沫到星点的形态映射已存在，但深海气泡不是同一批对象连续转换为星尘。
- [x] `M5-08` 高光转银河（代码证据：过渡高光逐步映射为银河带）
- [ ] `M5-09` 反向倒放无重置
  - 说明：实现采用确定性进度计算，但没有反向倒放浏览器验证，不能仅凭实现推断完成。
- [x] `M5-10` 移动端和 Reduced Motion（代码证据：移动端缩减粒子，Reduced Motion 使用静态替代，且所有模式的世界方向均固定为 0°；浏览器证据：375px/Reduced Motion 验证）
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

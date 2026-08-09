# M7 真实 Programs 展示系统规格

状态：已完成
确认日期：2026-08-06
实现对账：2026-08-09

## 1. 产品方向

“做点啥呢”继续只展示站点所有者本人编写的程序、工具、网页应用、交互实验和程序演示。M7 优先接入已经独立上线的真实程序，不要求把项目源码或演示副本放进 `Project_Demos`。

- 有独立网址的程序：Program 详情页作为介绍与入口，主操作打开真实站点；
- 有微信小程序版本：同时展示真实小程序码和明确的扫码说明；
- 有演示视频：在详情页展示竖屏或横屏媒体；
- 没有公开在线版本：诚实使用视频、GIF、截图或 `none`；
- 只有未来确实需要站内静态交互演示时，才评估 `Project_Demos`、DemoRegistry 和 sandbox iframe。

首个真实程序是“拉了么”，网页版为 `https://poo.nuanzhualife.cn/`。2026-08-09，项目所有者提供并确认了最终状态、技术栈、本人贡献、限制、隐私、外部服务、小程序码、H.264 演示视频和 poster；这些资料已写入 `src/content/programs/laleme.md`，没有推测源码地址、Android 下载或尚未完成的能力。

## 2. Program 详情页首屏优先级

桌面端使用稳定的双栏普通文档流，不使用 sticky、pin 或独立滚动容器：

```text
┌───────────────────────────────┬────────────────┐
│ 标题、状态、简介               │                │
│ [打开网页版]                   │  9:16 竖屏视频  │
│ 这是什么程序                   │                │
│ 为什么编写                     │  小程序码/入口  │
│ 本人完成了什么                 │                │
└───────────────────────────────┴────────────────┘
```

“打开网页版”是 `external-live` Program 的首要操作，必须放在标题、状态与简介之后、长篇正文之前，不得埋在技术说明或页面底部。按钮使用清楚的外部链接提示，在新标签页打开并带 `noopener noreferrer`。

右栏优先放手机竖屏演示视频；微信小程序码位于视频下方或相邻入口卡中。下方继续显示核心功能、技术方案、当前限制、数据和隐私说明等完整内容。

## 3. 移动端顺序

移动端改为单列普通文档流：

```text
标题、状态、简介
→ 打开网页版
→ 演示视频
→ 微信小程序码/入口
→ 这是什么程序、为什么编写、本人完成内容
→ 核心功能、技术方案、限制和隐私
```

按钮不得因为媒体加载失败而消失。二维码必须有可读替代文本和“微信扫码打开小程序”说明，不依赖 hover。

## 4. 组合式展示模型

现有 `demoType` 与 `demoUrl` 继续描述 Program 的主要演示方式和主要在线地址，以保持列表筛选和已有内容兼容。M7 增加可选的组合字段：

```yaml
demoType: external-live
demoUrl: https://poo.nuanzhualife.cn/

platforms:
  - kind: web
    label: 打开网页版
    url: https://poo.nuanzhualife.cn/
  - kind: wechat-mini-program
    label: 微信小程序
    qrImage: /programs/laleme/wechat-qr.png
    description: 微信扫码打开小程序
    alt: 拉了么微信小程序码

media:
  - type: video
    src: /programs/laleme/demo.mp4
    poster: /programs/laleme/video-poster.webp
    orientation: portrait
    caption: 拉了么微信小程序竖屏操作演示
```

以上是当前真实生产路径。`demo.mp4` 已验证为 H.264 High Profile、576×1280、约 22.1 秒；`video-poster.webp` 为 1080×2210；`wechat-qr.png` 为项目所有者提供的真实小程序码。原始 HEVC 文件只作为本地备份，不进入发布。

建议稳定值：

```text
ProgramPlatformKind: web | wechat-mini-program
ProgramMediaType: video | gif | screenshot
ProgramMediaOrientation: portrait | landscape
```

`platforms`、`media` 均为可选数组；每个外链、二维码和媒体条目都必须通过 schema 校验。现有必填的 Program 介绍、本人贡献、限制和隐私字段保持不变。

## 5. 视频与媒体要求

- 竖屏视频按 `9:16` 容器显示，使用 `object-fit: contain`，最大可视高度建议不超过 `70svh`；
- 默认不自动播放、不循环、不自动播放声音；保留原生 controls、`playsinline`、poster 和 `preload="metadata"`；
- 视频未提供或加载失败时，显示诚实的“演示视频待补充”或错误状态，正文与外部入口仍可用；
- 大视频优先使用独立媒体托管/CDN 地址，避免全部打入主站初始包；
- 二维码、poster 与截图可以作为优化后的静态资源随站点构建；
- 图片和二维码必须有 alt，视频需要标题或可读说明；
- 任何媒体都不得进入首页包，详情页之外不提前加载。

## 6. 隔离、隐私与静态边界

- 主站继续是 Astro 纯静态站；链接到需要后端的独立程序不会给主站引入 Node 服务端运行时；
- Program 详情页不代理、不伪造外部程序的 API、登录、数据库或实时能力；
- “拉了么”首轮使用外部新标签页，不在 iframe 中直接嵌入；
- 主站本地视频、poster 和小程序码只由静态托管读取；访客打开外部程序后，位置等数据才按程序功能交由微信/腾讯地图、高德、Geoapify、OpenStreetMap/OpenMapTiles 或 Google Maps 处理；
- “拉了么”不建立用户账号，不在业务数据库中持久化位置、搜索历史、查询中心或导航记录，也不后台持续定位；诊断日志可能记录截断或四舍五入坐标，正式日志访问权限和最短保留期仍需完善；
- 未来若加入站内静态演示，仍按 ADR 0006 使用独立路由或 sandbox iframe，并按需加载；该能力不是本轮 M7 的退出前提。

## 7. 内容真实性

- 接入前逐项确认程序确由站点所有者编写，并填写真实 ownerContribution；
- Tidy Desk、Signal Garden 按项目所有者本轮决定恢复公开，作为内容仍可后续维护的 `prototype` 档案；现阶段保留明确的原型状态、演示边界、限制与隐私说明，不把它们描述为已经上线的完整产品；
- 不伪造源码地址、线上状态、后端能力、用户数量、技术栈或隐私声明；
- 程序列表现有版式和 `/programs`、`/programs/<slug>` canonical 路由保持不变；
- `/projects` 兼容入口继续可用。

## 8. 验收

- “打开网页版”在桌面和移动端均位于简介之后、长篇说明之前；
- 外链目标、文案、新标签页安全属性和无链接状态正确；
- 同一详情页可同时展示网页版、竖屏视频和微信小程序码；
- 桌面双栏无重叠，移动端顺序符合本规格；
- 视频不自动播放声音，缺失/失败不影响正文和外链；
- 二维码可辨识、有替代文本和扫码说明；
- 外部程序不会被打入首页，也不会给主站增加服务端运行时；
- 真实 Program 内容、本人贡献、限制和隐私已经人工确认；
- 搜索、筛选、SEO、Sitemap、旧路由兼容、375px、键盘与静态刷新通过；
- Astro Check、ESLint、测试、生产构建和纯静态路由验证通过。

## 9. 2026-08-09 完成状态

- 已实现 `platforms`/`media` schema、摘要/详情数据分层、首要网页版入口、桌面双栏、375px 单列、视频失败提示、小程序码组件、平台搜索筛选和 SoftwareApplication 外部地址；
- 视频使用原生 controls、`playsinline`、`preload="metadata"`，没有 autoplay 或 loop；竖屏媒体使用 `9:16` 与 `max-height: 70svh`；
- “拉了么”以 `prototype` 发布：网页和微信小程序已形成完整原型，Android 仍在开发；网页版、小程序、Android 共用统一后端，主站不代理该后端；
- 详情页展示真实网页版、H.264 竖屏视频、poster、小程序码、本人贡献、21 项单元测试、限制和完整隐私边界；暂不显示 Android 下载与源码按钮；
- 首页三张卡片按 `order` 排列为“拉了么”“像素漫游个人站”“Tidy Desk”，`Signal Garden` 继续在 `/programs` 公开；星空的前两个 Program 入口同步为“拉了么”和“像素漫游个人站”；
- 当前公开 Program 为 `laleme`、`pixel-journey`、`tidy-desk` 与 `signal-garden`，生产输出为 17 个 HTML：12 个主页面和 5 个 Projects 兼容页；
- 媒体只在“拉了么”详情页加载，首页 HTML 不包含视频、poster 或小程序码地址；主站仍无 Node 请求期运行时。

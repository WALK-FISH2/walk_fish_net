# 内容模型 Content Model

## 1. Article

```yaml
title: 像素世界中的可逆滚动
description: 记录如何把滚动位置映射成可逆场景时间线。
publishDate: 2026-07-17
updatedDate: 2026-07-17
tags:
  - 前端
  - 动画
featured: true
order: 1
draft: false
```

规则：标题、摘要、发布日期必填；草稿不进入生产列表；slug 来自文件名且必须唯一。

## 2. Program 领域定义

“做点啥呢”不是普通项目经历、公司项目或宽泛作品列表。这里只展示站点所有者本人编写的程序、工具、网页应用、交互实验和程序演示。

代码中的领域名称统一使用 `Program/programs`：

```text
内容集合：programs
内容目录：src/content/programs/
主路由：/programs/、/programs/<slug>/
中文栏目名：做点啥呢
兼容路由：/projects/、/projects/<slug>/
```

## 3. 当前公开原型内容格式示例

Tidy Desk、Signal Garden 当前按项目所有者要求作为可继续维护的原型档案公开，以保证首页海洋区域保持三张完整卡片。它们的 `prototype` 状态、无公开演示或静态演示边界、限制和隐私字段必须保持清楚；后续可以由项目所有者手动替换，也可以在获得真实资料后由开发任务更新。不得在维护时补造在线地址、后端能力、用户数据或已完成功能。

```yaml
title: Tidy Desk
slug: tidy-desk
summary: 一个把零散工作记录整理成可检索时间线的本地优先小工具原型。
status: prototype
category: tool
startDate: 2026-04
featured: true
order: 2

stack:
  - React
  - TypeScript
  - IndexedDB
  - PWA

tags:
  - 本地优先
  - 效率工具

demoType: static-embedded
demoUrl:
sourceUrl:

ownerContribution:
  - 产品概念与使用流程设计
  - 前端原型开发
  - 本地数据模型设计

limitations:
  - 当前只提供静态前端演示说明
  - 未接入云同步、账号或跨设备协作

privacy:
  storesData: local-only
  sendsDataExternally: false
  externalServices: []

whatItIs: 一个本地优先的工作记录整理工具原型。
whyBuilt: 让临时记录先快速落地，再逐步整理。
coreFeatures:
  - 本地记录收集
  - 时间线浏览
technicalApproach:
  - React 管理界面状态
  - IndexedDB 作为本地数据层
demoDescription: 本轮只展示界面和数据流程说明。
draft: false
```

## 4. Program 必填字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `title` | string | 程序名称 |
| `slug` | string | 唯一 URL 标识 |
| `summary` | string | 一句话说明 |
| `status` | ProgramStatus | 当前状态 |
| `category` | ProgramCategory | 程序分类 |
| `stack` | string[] | 技术栈 |
| `tags` | string[] | 内容标签 |
| `featured` | boolean | 是否在首页展示 |
| `order` | number | 排序值 |
| `demoType` | DemoType | 演示方式 |
| `ownerContribution` | string[] | 本人完成的内容，至少一项 |
| `limitations` | string[] | 当前限制，可为空数组但必须存在 |
| `privacy` | ProgramPrivacy | 数据处理说明 |
| `whatItIs` | string | “这是什么程序”内容 |
| `whyBuilt` | string | “为什么编写它”内容 |
| `coreFeatures` | string[] | 核心功能 |
| `technicalApproach` | string[] | 技术方案 |

当前代码可选字段：`startDate`、`endDate`、`demoUrl`、`sourceUrl`、`demoDescription`、`platforms`、`media`。

## 5. ProgramStatus

```text
completed
in-progress
prototype
archived
```

页面显示时转换为“已完成、进行中、原型、已归档”，内容文件必须保存稳定英文值。

## 6. ProgramCategory

```text
web-app
desktop-app
mini-program
tool
visualization
automation
game-prototype
experiment
other
```

## 7. DemoType

```text
static-embedded
external-live
video
gif
screenshots
none
```

- `static-embedded`：只在 Program 详情页渲染静态前端演示，不进入首页包；
- `external-live`：打开真实存在的在线程序；
- `video`：详情页按需加载视频；
- `gif`：详情页按需加载 GIF；
- `screenshots`：详情页按需加载截图；
- `none`：明确说明当前没有公开演示。

所有 `static-embedded` 条目必须显示：

> 这是静态演示版，部分后端、数据库、登录或实时功能未接入。

不得用假数据伪装接口成功、登录完成、支付成功、实时同步或已经存在的后端能力。

## 8. M7 组合入口与媒体模型

> 本节模型已于 2026-08-08 写入 `src/content.config.ts`、`src/types/content.ts` 与详情页组件。`demoType`/`demoUrl` 继续兼容旧内容，`platforms`/`media` 为可选组合字段。

`demoType` 和 `demoUrl` 继续表示 Program 的主要演示方式与主要地址，供列表筛选、主要按钮和现有内容兼容。一个 Program 需要同时展示网页版、微信小程序、视频或截图时，使用可选数组：

```yaml
demoType: external-live
demoUrl: https://pp.nuanzhualife.cn/

platforms:
  - kind: web
    label: 打开网页版
    url: https://pp.nuanzhualife.cn/
  - kind: wechat-mini-program
    label: 微信小程序
    qrImage: /programs/laleme/wechat-qr.png
    description: 微信扫码打开小程序
    alt: 拉了么微信小程序码

media:
  - type: video
    src: https://media.example.com/laleme-demo.mp4
    poster: /programs/laleme/video-poster.webp
    orientation: portrait
    caption: 手机端操作演示
```

其中媒体 URL 是字段格式示例，并非已经确认的“拉了么”素材。实际内容不得保留虚构地址。

```text
ProgramPlatformKind = web | wechat-mini-program
ProgramMediaType = video | gif | screenshot
ProgramMediaOrientation = portrait | landscape
```

约束：

- `platforms` 和 `media` 均可省略，不得为满足 schema 伪造条目；
- `web` 必须有真实 `https` URL；主按钮文案优先为“打开网页版”；
- `wechat-mini-program` 必须有真实二维码图片、alt/说明，不用不可验证的跳转代替；
- `video` 默认不自动播放，支持 poster、controls、`playsinline` 和 `preload="metadata"`；
- 大视频优先引用独立媒体托管地址，二维码、poster 和截图可作为优化后的静态资源；
- 媒体缺失或失败不影响正文与主要外链；
- 这些资源只在 Program 详情页按需加载，不进入首页初始包。

内容读取分为两层：列表和首页使用 `ProgramSummary`，只携带平台种类与标签，不携带二维码和媒体地址；详情页使用 `ProgramDetail`，才包含完整 `platforms` 和 `media`。因此新增竖屏视频或小程序码不会被序列化进首页 React island。

## 9. Privacy

```yaml
privacy:
  storesData: none | local-only | external
  sendsDataExternally: false
  externalServices: []
```

如果 `sendsDataExternally: true`，必须在 `externalServices` 列出真实服务。不能用空数组掩盖外部数据传输。

## 10. 程序详情页内容与展示顺序

每个 Program 详情页仍必须包含以下八类内容：

1. 这是什么程序；
2. 为什么编写它；
3. 本人完成了什么；
4. 核心功能；
5. 技术方案；
6. 程序演示；
7. 当前限制；
8. 数据和隐私说明。

八类内容是完整性约束，不要求全部被锁进一个固定的单栏顺序。对于具有真实网页版的 Program，详情页显示优先级为：

```text
桌面：标题/状态/简介 → 打开网页版 → 左侧核心介绍 + 右侧竖屏视频/小程序码 → 其余完整详情
移动：标题/状态/简介 → 打开网页版 → 视频 → 小程序码 → 其余完整详情
```

“打开网页版”必须位于长篇正文之前。桌面使用普通文档流双栏，移动端使用单列；不使用 sticky、pin 或嵌套主滚动容器。源码地址为空时不显示按钮；演示缺失或加载失败不能影响其余详情内容。

## 11. 路由与 SEO

- `/programs/` 和 `/programs/<slug>/` 是 canonical；
- `/projects/` 和 `/projects/<slug>/` 只保留静态兼容跳转；
- 兼容页使用 `noindex,follow` 并指向新 canonical；
- Sitemap 只收录主 Programs 路由；
- Program 详情页输出标题、摘要、Open Graph、canonical 和 SoftwareApplication 结构化数据。

## 12. 新增或维护 Program

1. 在 `src/content/programs/` 新建 Markdown 或 MDX；
2. 填写所有必填字段；
3. 确认条目确实是本人编写，或明确本人贡献；
4. 选择真实的 `status`、`category` 和 `demoType`；
5. 填写当前限制和隐私边界；
6. 有独立网页版时设置真实 `external-live`/`demoUrl`，并把“打开网页版”作为详情页首要操作；
7. 有真实小程序码或媒体时再填写 `platforms`/`media`，不填写不存在的演示、源码或外部服务；
8. 不要求把已上线项目复制进 `Project_Demos`；站内静态演示仅按未来真实需求评估；
9. 运行 `npm run check` 验证 schema；
10. 运行测试和生产构建；
11. 使用纯静态服务器刷新新旧路由；
12. 检查 Sitemap 只包含主路由。

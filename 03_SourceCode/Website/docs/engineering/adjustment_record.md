# 首页布局调整记录

## 2026-07-18：陆地人物遮挡与海洋 Programs 重叠修复

### 1. 调整范围

本次只修复首页 DOM 内容层与 Canvas 场景层之间的两个布局缺陷：

1. 陆地 Hero 卡片在旅行者的大部分横向行走区间上方，导致人物长期被卡片遮挡；
2. 海洋 Programs 标题和档案卡片使用相互错开的 sticky 定位，卡片实际高度大于 sticky 偏移，导致标题/卡片及卡片/卡片重叠；系统开启 Reduced Motion 后使用 `?motion=full` 时，故事总高度已恢复，但各阶段高度仍保持 Reduced Motion 的 `auto`，进一步放大了进度与内容位置错位。

没有修改 Programs 内容模型、路由、文章系统、Canvas 绘制顺序、滚动状态机、三层浪参数或海洋到星空时间线。陆地旅行者路径仍为 `start: 0.13`、`travel: 0.46`，地面线仍为 `0.73 × viewportHeight`；Canvas 世界旋转仍固定为 `0`。

### 2. 陆地修复参数

| 参数 | 调整前 | 调整后 | 目的 |
| --- | --- | --- | --- |
| 桌面 Hero sticky top | `24vh` | `max(88px, 12vh)` | 把面板上移，同时避开浮动导航，给地面人物留出垂直走廊 |
| 375px Hero sticky top | `18vh` | `max(76px, 8vh)` | 在窄屏保留导航间距并减少面板对地面区域的侵占 |
| Hero 精修宽度 | `min(530px, 90vw)` | 不变 | 不改变现有文字换行和构图宽度 |
| Hero 精修 padding | `clamp(22px, 3vw, 36px)` | 不变 | 避免为修复遮挡而压缩可点击区域 |
| 旅行者横向路径 | `0.13 + progress × 0.46` 个视口宽度 | 不变 | 保留既有陆地叙事运动 |
| 旅行者地面线 | `0.73 × viewportHeight` | 不变 | 不修改 Canvas 场景美术 |

顶部偏移集中为 CSS 自定义属性 `--hero-safe-top`。默认值为 `max(88px, 12vh)`，`max-width: 767px` 时为 `max(76px, 8vh)`；普通 Reduced Motion 仍使用非 sticky 的正常文档流，只有 `?motion=full` 会恢复 sticky，但继续读取同一个安全偏移。

### 3. 海洋 Programs 修复参数

| 参数 | 调整前 | 调整后 |
| --- | --- | --- |
| Programs 标题定位 | `position: sticky; top: 18vh` | `position: relative; top: auto` |
| 桌面标题顶部留白 | 由 sticky 位置隐式决定 | `clamp(120px, 18vh, 190px)` |
| 桌面卡片容器顶部留白 | `32vh` | `clamp(56px, 10vh, 104px)` |
| 移动端标题顶部留白 | 由 `top: 16vh` 隐式决定 | `clamp(92px, 12vh, 120px)` |
| 移动端卡片容器顶部留白 | `30vh` | `48px` |
| 桌面卡片定位 | `sticky; top: calc(21vh + index × 8vh)` | `relative; top: auto` |
| 移动端卡片定位 | `sticky; top: calc(18vh + index × 6vh)` | `relative; top: auto` |
| 桌面卡片间距 | 每卡 `margin-bottom: 36vh`，但会 sticky 叠压 | Grid `gap: clamp(72px, 12vh, 128px)` |
| 移动端卡片间距 | 每卡 `margin-bottom: 29vh`，但会 sticky 叠压 | Grid `gap: 42px` |
| Reduced Motion 卡片间距 | 每卡 `margin-bottom: 35px` | Grid `gap: 35px`，卡片 margin 为 `0` |
| Programs 总入口 | `absolute; right: 0; bottom: 20vh` | 正常文档流，顶部间距复用 `--program-card-offset` |

Programs 卡片仍保留 terminal、probe、capsule 三种视觉外形、原有宽度、最小高度、内容与真实链接。调整只移除了会相互覆盖的 sticky 堆栈。

### 4. `?motion=full` 修复参数

`?motion=full` 是验收辅助参数，不是独立产品版本。它只在系统设置为 Reduced Motion 时强制恢复标准场景运动。本次补齐阶段高度，避免“故事总高度为完整模式、内容阶段仍为 Reduced Motion 自动高度”的混合状态：

| 视口 | 故事高度 | Hero | Articles | Programs | Space |
| --- | ---: | ---: | ---: | ---: | ---: |
| 桌面 | `900vh` | `160vh` / `980px` 最小高度 | `190vh` / `1260px` | `300vh` / `1900px` | `210vh` / `1320px` |
| `≤767px` | `650vh` | `130vh` / `820px` | `170vh` / `1240px` | `230vh` / `1720px` | `120vh` / `900px` |

完整动效模式会恢复上述阶段高度和其他场景 sticky 行为，但 Programs 标题、卡片与总入口明确保持正常文档流，不再恢复旧的卡片堆叠定位。

### 5. 修改文件

- `src/styles/global.css`：两个布局修复及完整动效阶段高度；
- `tests/static-export.test.mjs`：增加人物安全区、Programs 非 sticky 布局和完整动效高度回归测试；
- `docs/product/interaction-spec.md`：增加人物走廊和 Programs 顺序阅读要求；
- `docs/product/visual-system.md`：增加内容层与场景层遮挡边界；
- `docs/product/acceptance-criteria.md`：增加中间进度遮挡、Programs 重叠和 `?motion=full` 验收项；
- `tasks.md`：增加 M8 布局回归任务；
- `architecture.md`：记录 DOM/Canvas 安全区和完整动效阶段高度；
- `CHANGELOG.md`：记录两个缺陷修复。

### 6. 验证结果

| 验证项 | 命令 | 结果 |
| --- | --- | --- |
| Astro Check | `npm run check` | 通过；36 个文件，0 errors / 0 warnings / 0 hints |
| ESLint | `npm run lint` | 通过，无报错 |
| 自动化测试 | `npm test` | 通过；10/10，其中内容碰撞回归测试覆盖 Hero、文章路牌和 Programs |
| 生产构建 | `npm run build` | 通过；Astro `output: static`，输出 `dist/`，生成 15 个 HTML |
| Sites 构建 | `npm run build:sites` | 通过；生成 `sites-dist/` 部署包 |
| 静态路由 | Python 静态服务器逐一请求 | 15/15 个主页面和兼容页返回 HTTP 200，未知路由返回 HTTP 404 |
| 服务端边界 | 检查 `dist/server` | 不存在，生产静态输出无 Node 请求期运行时 |
| 补丁格式 | `git diff --check` | 通过，无空白错误 |

新增回归测试同时确认：

- Hero、文章路牌桌面与移动端安全偏移存在，旅行者原路径参数未被修改；
- Programs 标题和档案卡片使用 `position: relative` 与 Grid gap；
- 标准样式与 `?motion=full` 均不再包含按 `--porthole-index` 计算的 sticky top；
- `?motion=full` 在 Reduced Motion 环境恢复桌面 Programs `300vh / 1900px` 阶段高度，在 375px 使用 `650vh` 总故事高度和移动端四段高度；
- 既有 15 个静态路由、Programs 语义、Canvas fallback、M4/M4.5 时间线和世界方向回归测试继续通过。

本记录与修复代码位于同一 Git 提交。发布包由该提交重新构建，不包含 `dist/` 之外的 Node 服务端运行时。

### 7. 2026-07-18 二次复验：三张文章路牌遮挡旅行者

用户提供的 1920×1040、8.87 秒裁剪视频显示：Hero 修复已经生效，但进入“沿途捡到的想法”后，三张文章路牌的底部和路牌柱仍覆盖旅行者。逐秒接触表确认遮挡在路牌组 sticky 后持续存在，不是单帧环境动画。

根因是上一轮只调整了 `.hero-copy`，没有把 `.road-signs` 纳入人物走廊。旧布局同时包含：路牌组 `top: 38vh`、固定 `padding-top: 38px`、每张卡片 `250px` 最小高度、按索引递增的 `18px` 垂直错层，以及向下延伸 `76px` 的 `.road-sign__post`。在视频视口中，第三张路牌最低边界约为：

```text
38vh（395px）+ 38px + 2 × 18px + 250px + 76px ≈ 795px
旅行者像素顶部约为：0.73 × 1040 + 7 - 56 ≈ 710px
旧布局进入人物区域约 85px
```

本次将文章标题、路牌组、卡片和装饰柱统一纳入陆地安全区：

| 参数 | 调整前 | 常规桌面调整后 | 短视口桌面（高度 ≤820px） |
| --- | --- | --- | --- |
| 文章标题 sticky top | `18vh` | `max(88px, 9vh)` | `max(72px, 8vh)` |
| 路牌组 sticky top | `38vh` | `28vh` | `30vh` |
| 路牌组顶部 padding | `38px` | `clamp(18px, 3vh, 32px)` | `18px` |
| 卡片最小高度 | `250px` | `250px` | `190px` |
| 每张卡片垂直错层 | `18px` | `12px` | `8px` |
| 路牌柱高度 | `76px` | `52px` | `28px` |
| 卡片 padding | `25px` | `25px` | `18px` |
| 摘要行数 | 不限制 | 不限制 | 最多 2 行 |

在 1920×1040 视频视口中，新的第三张路牌最低设计边界约为：

```text
28vh（291px）+ 31px + 2 × 12px + 250px + 52px ≈ 648px
旅行者像素顶部约 710px
设计安全间距约 62px
```

在既有 1280×720 验收视口中启用短视口参数后，最低设计边界约为 `468px`，旅行者像素顶部约为 `477px`，保留约 `9px` 间距。该计算包含第三张卡片错层和路牌柱，不只计算卡片本体。

窄屏无法在人物上方同时容纳三张纵向卡片，因此 `≤980px` 不再使用单列纵向堆叠，改为容器内部横向路牌轨道：

- `grid-auto-flow: column`；
- 每张宽度 `min(82vw, 440px)`；
- 卡片最小高度 `230px`，取消索引错层；
- 隐藏纯装饰 `.road-sign__post`；
- 使用 `scroll-snap-type: x proximity`、`overscroll-behavior-x: contain`，横向滚动限制在路牌容器内；
- 当视口高度 `≤700px` 时，卡片最小高度降为 `190px`、padding 降为 `16px`、标题字号为 `0.95rem`、摘要字号为 `0.8rem` 且最多 2 行。

旅行者的 `start: 0.13`、`travel: 0.46`、地面线 `0.73 × viewportHeight`、三篇文章内容和链接均未修改。Reduced Motion 继续使用正常文档流；`?motion=full` 恢复 sticky 时读取同一组文章与路牌安全区变量，不恢复旧的 `38vh` 参数。

本次补充修改 `src/styles/global.css`、`tests/static-export.test.mjs`、交互规格、视觉系统、验收标准、架构、任务清单和 Changelog。验证结果见下一节。

### 8. 二次复验验证结果

| 验证项 | 结果 |
| --- | --- |
| 视频审查 | 已将 1920×1040、8.87 秒裁剪视频按 1 秒间隔生成 3×3 接触表，确认 Hero 已避让、三张文章路牌仍持续进入人物走廊 |
| Astro Check | 通过；36 个文件，0 errors / 0 warnings / 0 hints |
| ESLint | 通过，无报错 |
| 自动化测试 | 通过；10/10；内容碰撞测试已扩展到路牌安全顶部、卡片高度、错层、装饰柱、短视口、窄屏轨道和 `?motion=full` |
| 生产构建 | 通过；Astro 纯静态输出，生成 15 个 HTML |
| 静态路由 | 15/15 个主页面与兼容页面返回 HTTP 200，未知路由返回 HTTP 404 |
| Node 请求期运行时 | `dist/server` 不存在 |
| Sites 构建 | 通过；重新生成 `sites-dist/` 部署包 |
| 补丁格式 | `git diff --check` 通过 |

本次验证没有通过删除旅行者、隐藏文章、改变 Canvas 地面线或缩短陆地进度来规避遮挡。三个文章链接仍保留在真实 DOM 中；窄屏只隐藏无语义的装饰路牌柱。

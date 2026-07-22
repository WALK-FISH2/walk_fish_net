# ADR 0010: 完整动画默认值与用户动效偏好

- Status: Accepted
- Date: 2026-07-22
- Decision Owners: 项目所有者
- Related: ADR 0007 渐进增强和 Reduced Motion

## Context

当前首页自动遵循系统 `prefers-reduced-motion: reduce`，因此部分访问者只有添加 `?motion=full` 才能看到完整动画。项目所有者要求普通网址首次进入即展示完整动画，同时继续保留可主动选择的简化动画和完整的降级能力。

ADR 0007 关于“必须保留 Reduced Motion 分支、Canvas 降级和完整内容”的决定继续有效。本 ADR 补充动效模式的默认值、选择入口、持久化和解析优先级；不删除简化动画实现。

## Decision

M6 实施统一的 `full | reduce` 动效模式：

1. 有效 `?motion=full` 或 `?motion=reduce` 是当前页面最高优先级的临时覆盖，不写入本地偏好；
2. 没有 URL 覆盖时使用用户通过站内控件主动保存的选择；
3. 两者都不存在时，产品默认值为 `full`，即普通网址直接展示完整动画；
4. `prefers-reduced-motion: reduce` 继续被检测，并在动效开关中显示“系统建议简化动画”，但不自动替换首次默认值；
5. fixed UI 提供始终可达、键盘和触控可用的完整/简化动画开关；
6. 用户主动选择使用浏览器本地存储持久化；存储失败时退化为当前会话状态；
7. 已保存简化模式在场景、滚动时间线和动态流星初始化前生效；
8. 模式切换复用现有完整和 Reduced Motion 分支，保持当前进度与内容，不产生重复实例。

## Alternatives

1. 继续自动遵循系统 Reduced Motion：无障碍默认更保守，但无法满足普通网址默认展示完整作品的产品目标；
2. 永久强制完整动画且不提供简化模式：实现简单，但违反项目宪章的渐进增强与 Reduced Motion 要求；
3. 仅保留 URL 参数：无需 UI 状态，但普通访问者难以发现，也无法形成可持续的个人选择。

## Consequences

- 首次访问时沉浸式视觉成为默认体验；
- 系统 Reduced Motion 不再自动决定最终模式，这是明确的产品与无障碍权衡；
- 需要新增可访问控件、本地偏好、初始化前解析和生命周期测试；
- 简化动画、Canvas fallback、静态内容与系统偏好检测继续保留；
- 不改变路由、Sitemap、静态部署、章节区间或 M5/M5.5 动画实现。

## Verification

- 普通网址在无保存值时进入完整动画；
- 手动选择简化后刷新、站内跳转和再次访问仍为简化；
- `?motion=full` 与 `?motion=reduce` 可临时覆盖，但移除参数后恢复保存值；
- 系统 Reduced Motion 环境显示简化建议，开关可由键盘和触控操作；
- 已保存简化模式没有完整动画闪现；
- 连续切换、切后台、章节往返和卸载后没有重复 RAF、timer、时间线或监听器；
- 桌面、375px、Canvas fallback 和控制台验收通过。

2026-07-22 实施证据：

- `npm run check` 为 0 errors / 0 warnings / 0 hints，`npm run lint` 通过，`npm test` 为 13/13；
- 生产构建仍生成 15 个静态 HTML，纯静态服务器逐一验证 15/15 页面为 HTTP 200；
- 系统实际命中 `prefers-reduced-motion: reduce` 时，裸地址仍解析为 `full/default` 并显示“系统建议简化动画”；
- 简化选择刷新及 `/articles/` 往返后仍解析为 `reduce/saved`；URL 覆盖解析为 `url`，从控件切换后只移除 `motion` 并保留其他查询参数；
- 星空 80.0073% 处完整↔简化双向切换进度差为 0；动态流星 `true→false→true`，overlay/Canvas 数量恒为 1/2；
- 375×812 下两种模式均无正向横向溢出，控件与阶段导航不重叠；Canvas fallback 保留主内容，浏览器 warn/error 为空。

## 2026-07-22 Owner Clarification and Reopened Verification

项目所有者在生产环境补充了两项证据：完整→简化后偶发停在深海到星空之间且无法继续向下；产品默认改为完整动画后，旧 Reduced Motion 体验中常显的左侧四项星座标题在完整模式退化为 hover/focus 才可见。

ADR 的默认值、优先级与持久化决定不变，但第 8 条“保持当前进度与内容”细化为：

1. 模式切换以活动故事 ScrollTrigger 的实测 start/end 为进度坐标系，不以可能包含其他布局的页面总高度替代；
2. 切换后必须可继续滚到 `globalProgress >= 0.999 / phase=space` 并反向回到 0%，物理底部不得停在 sea/transition；
3. 连续切换时旧恢复事务必须失效，只有最后一次切换可以写入滚动位置；
4. 产品默认完整动画不得降低核心内容可发现性。四项文章/Program 星座标题在完整与简化模式均默认常显，hover/focus 只增强反馈。

原 80.0073% 单点切换证据不能覆盖上述偶发回归，因此当时重新打开 M6-13 与 M6-15。

## 2026-07-22 Final Verification

项目所有者确认细化需求后已完成实现。活动 ScrollTrigger 的 end 改为按当前 story 实际高度动态计算；模式切换事务等待布局连续 4 帧稳定，最多观察 12 帧，再刷新唯一触发器并按 start/end 恢复进度。事务 revision 使旧 RAF 和旧坐标失效，进度复核容差为 `0.01`。

浏览器矩阵覆盖 64%、72%、76%、79%、80%、82%、90%，full→reduce 与 reduce→full 最大误差为 `0.0002`；每点均可到 `progress=1 / phase=space` 并回到 0。连续 5 轮快速切换后仍为预期模式和 `0.8001`，误差 0。桌面与 375px 的四项星座标题均常显，移动端信号站与列表重叠为 0；Canvas fallback、键盘焦点、Program 详情链接和新建标签页控制台均通过。

Astro Check、ESLint、14/14 测试和 Sites 生产构建均通过，静态输出仍为 15 个 HTML。M6-13～M6-19 恢复完成状态，本 ADR 的决定不再处于重新验收中。

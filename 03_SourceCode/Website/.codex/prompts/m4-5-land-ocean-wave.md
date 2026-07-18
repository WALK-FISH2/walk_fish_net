# Codex 提示词：M4.5 陆地到海洋翻涌海浪精修

请先完整阅读：

- constitution.md
- spec.md
- architecture.md
- plan.md
- tasks.md
- AGENTS.md
- docs/product/interaction-spec.md
- docs/product/visual-system.md
- docs/product/acceptance-criteria.md
- docs/product/dive-underwater-spec.md
- docs/product/land-ocean-wave-transition-spec.md
- docs/adr/0004-canvas-dom-separation.md
- docs/adr/0005-scroll-progress-state-machine.md
- docs/adr/0007-progressive-enhancement.md

当前状态：

- M1 已完成；
- M2 已完成；
- M3 已完成；
- M4 下潜与深海已完成，整体效果已经可用；
- 本轮精修陆地到海洋的交接，并落实“全面取消背景世界旋转”的需求更正；
- 不重做深海主体；
- 不开始海洋到星空的气泡转换。

本轮目标：

```text
陆地
→ 远处水面出现
→ 三层浪潮接近
→ 泡沫覆盖接缝
→ 镜头穿过浪峰
→ 水面退到顶部
→ 深海
```

第一步只审查，不立即修改代码。

请先输出：

1. 当前陆海过渡涉及的文件；
2. 当前全局和局部进度区间；
3. 当前水面、浪花、泡沫和下潜的实现方式；
4. `land-ocean-wave-transition-spec.md` 中哪些要求已有；
5. 哪些要求缺失；
6. 本轮计划修改文件；
7. 如何保证不破坏已完成的 M4；
8. 如何保证与后续 M5 边界分离。

审查后再实施。

必须完成：

1. 远浪、中浪、前浪三层；
2. 三层振幅、周期、相位、速度、透明度不同；
3. 像素化浪峰；
4. 前浪泡沫；
5. 泡沫对象池或复用；
6. 泡沫遮挡陆地与水下场景接缝；
7. 镜头穿浪；
8. 入水后水面退到顶部；
9. 向上滚动完整倒放；
10. 导航和 DOM 始终保持水平；
11. Programs/文章按钮仍可点击；
12. 移动端保留核心浪潮；
13. Reduced Motion 使用单层像素浪幕；
14. 不使用视频；
15. 不引入新大型依赖；
16. 不修改 Programs 内容模型和路由；
17. 不修改 constitution.md；
18. 不提前实现气泡变星星；
19. 所有模式下 Canvas 世界方向固定为 0°，海洋到星空不得旋转、翻转或倾斜。

禁止：

- 直接切色；
- 只有一条正弦波；
- 三层浪完全相同；
- 任何角度的世界旋转；
- 自动播放并劫持滚轮；
- 泡沫每帧大量创建；
- 过渡时长时间遮挡正文。

必须验证：

- 31.5%
- 32.8%
- 34.2%
- 35.0%
- 35.8%
- 36.8%
- 38.0%
- 从 38% 向上滚回 30%
- 375px
- Reduced Motion
- 浏览器控制台
- Astro Check
- ESLint
- 测试
- 生产构建
- 静态输出

完成后：

1. 更新 tasks.md，增加或完成 M4.5；
2. 不修改 M5 完成状态；
3. 汇报修改文件；
4. 汇报每层浪参数；
5. 汇报泡沫复用方式；
6. 提供关键进度截图；
7. 汇报向上倒放结果；
8. 汇报移动端与 Reduced Motion；
9. 汇报构建和测试结果；
10. 列出仍属于 M5 的工作；
11. 将固定世界方向登记为 `M4.5-17`，并确认 M5 不会重新引入旋转。

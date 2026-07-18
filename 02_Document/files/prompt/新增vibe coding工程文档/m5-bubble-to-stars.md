# Codex 提示词：M5 海底气泡变繁星与流星

请先完整阅读：

- constitution.md
- spec.md
- architecture.md
- plan.md
- tasks.md
- AGENTS.md
- docs/product/content-model.md
- docs/product/interaction-spec.md
- docs/product/visual-system.md
- docs/product/acceptance-criteria.md
- docs/product/ocean-space-bubble-morph-spec.md
- docs/adr/0004-canvas-dom-separation.md
- docs/adr/0005-scroll-progress-state-machine.md
- docs/adr/0007-progressive-enhancement.md
- docs/adr/0009-program-domain-and-routes.md

前置条件：

- M4 已完成；
- M4.5 陆海翻涌海浪及固定世界方向约束已完成；
- Programs 领域迁移已完成；
- 星空主体场景已经存在；
- 本轮只精修深海尾段到星空稳定之间的过渡。

本轮核心目标：

```text
深海
→ 气泡增密
→ 气泡形成上升流
→ 气泡发亮并收缩
→ 同一批气泡变成星点
→ 少量星点拉伸为流星
→ 水下光束变银河或星云
→ 星空稳定
```

第一步只审查，不立即修改代码。

请先输出：

1. 当前 M5 相关文件；
2. 当前进度区间；
3. 当前气泡、泡沫、星点、流星的对象结构；
4. 当前是否存在三层海浪，以及世界方向是否始终固定为 0°；
5. 当前是否销毁气泡后重新生成星星；
6. 当前反向滚动行为；
7. `ocean-space-bubble-morph-spec.md` 中已完成与缺失项；
8. 本轮计划修改文件；
9. 复验 M4.5 已取消的世界旋转不会被 M5 重新引入；
10. 风险与性能方案。

审查后再实施。

必须完成：

1. 建立统一 MorphParticle 对象或等价结构；
2. 使用固定随机种子；
3. 深海尾段气泡逐渐增密；
4. 气泡形成一到三股有方向的上升流；
5. 同一对象从气泡状态变为星点状态；
6. 少量同一对象从星点变为流星；
7. 流星比例桌面端约 3%～8%，移动端约 1%～3%，具体根据性能调整；
8. 流星尾迹像素化；
9. 水下光束连续变为银河或星云；
10. 背景从深海藏青连续变为靛紫星空；
11. Programs 内容自然退出；
12. 关于我内容自然进入；
13. 向上滚动时流星、星点、气泡完整倒放；
14. 回滚时不得重新随机；
15. 移动端减少粒子和流星；
16. Reduced Motion 不出现流星和高速粒子；
17. Canvas 世界、导航和 DOM 在所有模式下都保持水平；
18. 粒子层不能阻止点击；
19. 不修改文章、Programs schema、路由和静态部署；
20. 不修改 constitution.md。

关于固定世界方向：

- M4.5 已全面取消背景世界旋转；
- 新过渡以“气泡变星星与流星”为主，以颜色、光束和透明度为辅助；
- 不得重新引入 150～180 度、15～35 度或任何其他角度的世界旋转；
- 标准动效、移动端和 Reduced Motion 的 Canvas 世界方向都必须固定为 0°；
- 向下推进和向上倒放都必须保持水平。

必须验证：

- 64%
- 66%
- 69%
- 72%
- 75.5%
- 78.5%
- 80%
- 82%（若当前时间线允许）
- 从 80%/82% 向上滚回 64%
- 375px
- Reduced Motion
- Programs 退出
- 关于我进入
- 浏览器控制台
- 粒子性能
- 内存和销毁
- Astro Check
- ESLint
- 测试
- 生产构建
- 静态输出

完成后：

1. 更新 tasks.md 中 M5；
2. 汇报统一粒子结构；
3. 汇报气泡到星点的插值方式；
4. 汇报流星选择与尾迹方式；
5. 汇报固定世界方向约束的复验结果；
6. 提供关键进度截图；
7. 汇报向上倒放；
8. 汇报移动端与 Reduced Motion；
9. 汇报性能、构建和测试结果；
10. 明确尚未完成的视觉精修。

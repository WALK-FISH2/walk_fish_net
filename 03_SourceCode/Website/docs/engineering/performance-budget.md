# 性能预算 Performance Budget

## 首屏

- 关键压缩资源目标约 1.5MB；
- 不加载完整深海和星空高质量资源；
- 不加载未打开的程序演示；
- 字体优先 WOFF2；
- 图片优先 WebP/AVIF。

## JavaScript

按场景拆包，程序演示按需加载，不把所有演示打入首页，新增大依赖需说明体积影响。

## 帧率

```text
桌面：接近60fps
普通移动端：不低于可接受的30fps
Reduced Motion：接近静态页面成本
```

## 画质

- high：完整三层浪、完整粒子和折射；
- medium：减少粒子、简化折射、降低 DPR；
- low：少量粒子、无复杂 Shader；
- static：Reduced Motion、Canvas失败或极低性能。

## 资源生命周期

页面隐藏暂停、场景退出降低频率、释放纹理、移除监听器、销毁 Ticker/ScrollTrigger/ResizeObserver 和媒体查询监听。

开发模式可显示 FPS、粒子数、画质、DPR、当前阶段和加载状态，生产默认隐藏。

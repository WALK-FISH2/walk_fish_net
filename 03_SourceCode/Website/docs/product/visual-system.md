# 视觉系统 Visual System

## 1. 风格

核心：二维像素、精细、复古主机感、明确轮廓、环境层次和少量现代光影辅助。

禁止：体素、3D 方块、大量玻璃拟态、全页纯色、所有内容套同一种矩形卡片和直接复制经典游戏素材。

## 2. 陆地色板

```css
--land-sky: #73d7ff;
--land-sky-light: #c8f2ff;
--land-cloud: #fff6dd;
--land-grass: #58c65a;
--land-grass-dark: #267a40;
--land-soil: #a85f3f;
--land-accent-red: #f45b5b;
--land-yellow: #ffd25a;
--land-ink: #18233b;
```

## 3. 深海色板

```css
--sea-top: #0b5275;
--sea-mid: #092e55;
--sea-deep: #04162f;
--sea-cyan: #25bec4;
--sea-light: #89f0d7;
--sea-coral: #ff806e;
--sea-text: #e5faff;
--sea-muted: #8db9cb;
```

## 4. 星空色板

```css
--space-void: #050411;
--space-indigo: #181443;
--space-purple: #5b4cb5;
--space-nebula: #c16de0;
--space-blue: #5e8cff;
--space-star: #fff3c4;
--space-text: #f3f1ff;
--space-muted: #aaa8cc;
```

## 5. 字体

像素字体用于 Logo、小标题、按钮、标签、状态和关卡文字；正文使用系统中文字体，不使用低清晰度像素字体写长段中文。

## 6. 像素规则

```css
.pixel-art {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

精灵使用 nearest-neighbor，DPR 上限 2，精灵尽量落在整数坐标，UI 阴影使用整数像素。背景渐变和光束可以平滑。

## 7. 容器语言

- 文章：路牌、公告板、关卡入口；
- 程序：海底终端、舷窗、探测器、沉没档案舱；
- 关于我：漂浮信号站、太空档案、星座中心。

## 8. 组件状态

所有交互组件需要 default、hover、focus-visible、active、disabled、loading 和 error 状态，不能只设计 hover。

## 9. 素材许可

记录文件名、来源、作者、许可证、修改情况和项目内许可文件位置。

## 10. 场景方向

陆地、深海、海洋到星空和星空场景始终保持水平。海空过渡通过色彩、光束、透明度、浪花与粒子形态变化完成，不使用 Canvas 世界旋转、翻转或倾斜制造转场。

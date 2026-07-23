# M6.2 生产角色素材

本目录由 `scripts/process-m62-assets.mjs` 从 `assets/reference/m6-2/generated-alpha/` 生成：

- `octopus-land.png`
- `octopus-diver.png`
- `octopus-astronaut.png`

三张 PNG 均为 `384×384` 透明画布、统一视觉中心和感知尺寸。Astro/Vite 必须通过源码 import 生成哈希资源，页面不能直接读取 `assets/reference/`。

不要手工覆盖生产 PNG。需要调整裁切、尺寸或像素缩放时，修改处理脚本并重新生成，然后复验桌面、375px、简化动画和 Canvas fallback。

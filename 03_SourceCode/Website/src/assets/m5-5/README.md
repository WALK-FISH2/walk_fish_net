# M5.5 生产素材

本目录由 `scripts/process-m55-assets.py` 从项目所有者提供的 `assets/reference/m5-5/` 生成。PNG 均为透明背景、裁切后的像素 sprite；Astro/Vite 通过源码 import 生成带哈希的静态资源。

不要手工覆盖 PNG。需要调整透明边界、Alpha 或色板时，修改处理脚本后重新生成，并同时检查 1280×720、375×812 和 Reduced Motion。

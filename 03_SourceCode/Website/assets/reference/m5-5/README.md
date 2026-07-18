# M5.5 参考素材记录

- 提供者：项目所有者；
- 接收日期：2026-07-18；
- 授权范围：用于本项目 M5.5 星空、浪花与气泡视觉抛光及其生产衍生素材；
- 运行时边界：`assets/reference/m5-5/` 只保存现状截图和参考源，生产代码不得直接读取此目录。

生产处理由 `scripts/process-m55-assets.py` 完成：按 Alpha 可见边界裁切，四周保留 `8px` 透明安全边，清除透明像素中的 RGB 残留，将 Alpha 量化为 `0/80/160/224/255`，并映射到项目海洋色板。处理不做平滑缩放，不改变参考轮廓。

| 参考源 | 生产素材 | 用途 |
| --- | --- | --- |
| `wave-large-01.png` | `src/assets/m5-5/wave-front.png` | 前景卷浪 |
| `wave-medium-02.png` | `src/assets/m5-5/wave-mid.png` | 中景卷浪 |
| `wave-small-03.png` | `src/assets/m5-5/wave-back.png` | 背景低浪 |
| `bubble-foam-band-01.png` | `src/assets/m5-5/foam-band-front.png` | 前浪与接缝横向泡沫 |
| `bubble-foam-band-03.png` | `src/assets/m5-5/foam-band-mid.png` | 中浪横向碎泡 |
| `bubble-clusters-02.png` | `src/assets/m5-5/bubble-clusters.png` | 水体内部竖向气泡簇 |
| `star-sky-current-state.png` | 不生成运行时素材 | M5 基线现状对照 |

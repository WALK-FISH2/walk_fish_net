# M6.2 小章鱼参考素材

项目所有者提供的原始参考：

- `octopus1.png`：普通小章鱼；
- `octopus2.png`：潜水小章鱼；
- `octopus3.png`：宇航员小章鱼。

`generated-alpha/` 是通过内置图像编辑流程生成的高分辨率透明作者素材。三次编辑都使用 `background-extraction`，要求只把背景替换为纯绿色键色，同时保持角色、装备、姿势、像素几何、色彩和方向；随后使用内置技能提供的 `remove_chroma_key.py` 以 border 自动取色、soft matte、despill 生成透明 PNG。

运行时不直接读取本目录。`scripts/process-m62-assets.mjs` 将 `generated-alpha/` 裁切、nearest-neighbor 缩放并居中到统一 `384×384` 透明画布，输出到 `src/assets/m6-2/`。

不得删除项目所有者提供的三张原始参考，也不得用运行时 CSS 遮掉原图背景代替生产素材处理。

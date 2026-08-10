---
title: CRT转换器
slug: image_converter
summary: 一个复古未来风格的图像与视频栅格化工具，通过字符、点阵和半调重绘媒体内容，并提供网页版、微信小程序和本地 FFmpeg 视频处理服务。
status: in-progress
category: web-app
featured: true
order: 1
stack:
  - JavaScript
  - HTML / CSS
  - Vite
  - Canvas 2D
  - WebCodecs
  - Mediabunny
  - 微信小程序
  - Node.js
  - FFmpeg
tags:
  - 图像处理
  - 视频处理
  - ASCII Art
  - 复古未来
  - 微信小程序
  - 多端应用
demoType: external-live
platforms:
  - kind: web
    label: 网页版
    description: 在浏览器本地处理图片和视频，支持实时预览、参数调整、PNG 保存和 WebCodecs 离线视频导出。
    url: https://image-converter-4lb.pages.dev/
# media:
#   - type: video
#     src: /programs/ic84-raster-console/demo.mp4
#     poster: /programs/ic84-raster-console/video-poster.webp
#     orientation: portrait
#     caption: Rick-137 Raster Console 微信小程序竖屏操作演示

ownerContribution:
  - 提出并持续完善复古未来桌面视觉终端的产品概念，确定白色拟物硬件外壳、CRT 屏幕、实体按键和工业仪器风格
  - 规划字符、点阵、半调三种渲染方式，以及列数、缩放、对比度、字符集、色调、反相、抖动、辉光和屏幕反光等控制能力
  - 推动网页版和微信小程序形成不同但一致的交互布局，使桌面端突出大型 CRT、小程序端适配手机竖屏
  - 持续进行浏览器、微信开发者工具和 Android 真机测试，发现并推动解决按钮遮挡、比例压缩、背景发绿、真机暗部单元消失和处理后视频无法展示等问题
  - 设计并确认 WebCodecs 离线逐帧导出方案，使网页视频保存脱离实时录制，并支持画质、帧率、进度、取消和音频保留
  - 完成 FFmpeg 环境和局域网视频服务联调，校准 DENSE 字符亮度阶梯，并验证小程序视频处理、播放和保存流程
  - 建立需求基线、产品规格、架构、API 契约、ADR、验收标准、测试记录、运维说明和任务管理文档体系
limitations:
  - WebCodecs 主要导出能力依赖较新的 Chrome 或 Edge
  - Web 导出期间会在内存中保存完整视频，超长或高分辨率素材可能占用较多内存
  - VP9/WebM 降级、异常音轨转码和无声导出尚未完成完整目标设备验证
  - 小程序视频处理依赖单独运行的 Node.js 与 FFmpeg 服务，不能完全离线完成
  - 小程序视频处理是同步长请求，暂时没有逐阶段进度、任务队列、取消和自动重试
  - 小程序已经处理的视频不会随参数实时重新渲染，修改参数后需要重新上传和处理
  - Server 接收辉光参数，但当前视频逐帧渲染尚未实际应用该参数
  - Web、小程序和 Server 分别维护部分字符集、亮度映射和绘制公式，仍存在跨端效果漂移风险
  - 小程序 API 地址仍需要在本机、局域网和正式环境之间手工配置
  - iOS 微信真机和公网 HTTPS 小程序环境尚未完成正式回归
  - Server 上传、临时和输出文件目前没有自动过期与清理机制
privacy:
  storesData: none
  sendsDataExternally: false
  externalServices:
    - 微信小程序平台
    - 用户自行配置的 Node.js / FFmpeg 视频处理服务
  notes:
    - 网页版图片和视频默认完全在浏览器本地处理，不上传到项目 Server，也不依赖第三方云端图像或视频处理服务
    - 小程序图片在设备本地 Canvas 中处理；小程序视频会上传到用户配置的 Node.js 服务，由 FFmpeg 逐帧处理后返回 MP4
    - Server 会在本地磁盘暂存上传原文件、中间文件和处理结果，目前没有自动清理机制，使用者需要自行管理文件生命周期
    - 项目目前没有账号系统、用户数据库、行为分析、广告、云对象存储或第三方 AI 服务
    - Mediabunny、FFmpeg 和 FFprobe 均作为本地软件组件运行，不会主动将媒体发送给外部供应商
    - 微信平台可能处理小程序运行、网络请求和相册授权等平台数据，具体行为受微信平台规则和用户设备权限控制
    - 局域网开发环境通常使用未加密 HTTP，不适合直接暴露到公网；正式部署前需要增加 HTTPS、鉴权、限流、上传校验和文件删除策略
whatItIs: “Rick-137 Raster Console”是一个将图片和视频转换为字符、点阵或半调画面的复古视觉处理工具。项目已经形成网页版、微信小程序和本地视频处理服务：网页版可以完全在浏览器中完成实时预览与离线视频导出，小程序负责手机端交互和图片处理，并通过 Node.js/FFmpeg 服务完成视频逐帧转换。
whyBuilt: 这个项目用于探索现代浏览器和微信小程序能否呈现一台真实存在般的 80 年代桌面视觉终端，同时验证图片与视频如何在保持原始比例的前提下，被统一转换为字符、点阵和半调栅格。项目也重点解决了不同 Canvas、字体、浏览器编解码能力和移动端性能造成的跨平台差异。
coreFeatures:
  - 将图片和视频转换为字符、点阵或半调构成的低分辨率视觉画面
  - 提供 DENSE、BLOCK 和 LINE 三套字符亮度阶梯
  - 支持绿屏、琥珀和冷白三种 CRT 屏幕色调
  - 支持屏幕列数、图像缩放、对比度、反相、有序抖动和辉光调整
  - 提供扫描线、暗角、点阵蒙版、玻璃反光和可切换屏幕反光效果
  - 网页版支持 PNG 保存和 WebCodecs 离线逐帧视频导出
  - 视频导出支持快速、高清和精细画质，以及跟随源视频、24、30 和 60 FPS
  - 视频导出过程中显示预计规格、处理进度和当前帧数，并支持取消
  - 小程序支持图片保存、视频上传、处理结果播放和 MP4 保存
  - 图片和视频处理尽可能保持输入媒体的原始宽高比例
technicalApproach:
  - 网页版使用 HTML、CSS、JavaScript 与 Vite 构建拟物硬件控制台，并通过 Canvas 2D 完成实时栅格渲染
  - Web 视频使用 Mediabunny 解封装、WebCodecs VideoDecoder 逐帧解码，并在 Web Worker 与 OffscreenCanvas 中按照目标分辨率重新渲染
  - Web 导出优先使用 VideoEncoder 编码 H.264/MP4，不支持时尝试 VP9/WebM，MediaRecorder 仅作为兼容降级
  - Web 图片和视频共用栅格参数语义，但视频导出使用独立高清画布，不依赖页面 CRT Canvas 的显示尺寸
  - 微信小程序使用 JavaScript、WXML、WXSS、微信 Canvas、wx.uploadFile、wx.downloadFile 和原生 video 组件
  - 小程序图片与开屏演示在本地处理，完整视频上传至 Node.js 服务后再下载处理结果
  - Server 使用 Node.js 原生 HTTP 模块接收 multipart 请求，调用 FFprobe 获取显示比例，并通过 FFmpeg 解码 RGB 帧和编码 H.264 MP4
  - Server 对每一帧执行字符、点阵或半调重绘，使用黑色背景，并尽可能将源音频编码或复用为 AAC
  - 已执行 Node 单元测试、Vite 生产构建、FFprobe 媒体检查、浏览器实际视频导出以及微信 Android 真机人工测试
demoDescription: 网页版的大型桌面 CRT 控制台。
draft: false
---
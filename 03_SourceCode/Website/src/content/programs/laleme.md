---
title: 拉了么
slug: laleme
summary: 一个以地图为核心的公共厕所查询项目，使用统一后端为网页版、微信小程序和开发中的 Android 客户端提供地点、厕所、地铁与导航能力。
status: in-progress
category: web-app
featured: true
order: 0
stack:
  - Node.js
  - JavaScript
  - TypeScript
  - 高德地图
  - Geoapify
  - Leaflet
tags:
  - 地图应用
  - 公共厕所
  - 多端应用
  - 微信小程序
demoType: external-live
demoUrl: https://poo.nuanzhualife.cn/
platforms:
  - kind: web
    label: 打开网页版
    url: https://poo.nuanzhualife.cn/
  - kind: wechat-mini-program
    label: 微信小程序
    qrImage: /programs/laleme/wechat-qr.png
    description: 微信扫码打开小程序，体验定位、地点搜索、厕所与地铁查询以及原生导航。
    alt: 拉了么微信小程序码
media:
  - type: video
    src: /programs/laleme/demo.mp4
    poster: /programs/laleme/video-poster.webp
    orientation: portrait
    caption: 拉了么微信小程序竖屏操作演示
ownerContribution:
  - 设计当前位置、城市选择、地点搜索、地图长按选点和搜索半径等核心流程
  - 规划厕所与地铁两套独立查询逻辑，以及地铁厕所的三状态数据模型
  - 推动网页、微信小程序和 Android 三端共用统一后端与地铁数据，避免重复维护
  - 确定国内使用高德、海外使用 Geoapify 的全球 POI 与坐标策略
  - 持续进行真机测试和问题复现，发现并推动解决定位、导航目标错误、配额、加载性能、地图底图、中文海外搜索和首次权限等问题
  - 建立正式规格、架构、API、测试、安全隐私、部署和开发历史文档体系
limitations:
  - 高德和 Geoapify 的 POI 都不能保证覆盖现实中的所有公共厕所
  - 国内地铁厕所数据仍不完整，未核实站点只能标记为橙色
  - 海外地铁站目前主要来自 Geoapify，厕所状态普遍无法确认
  - 暂无账号、收藏同步、用户纠错、投票、后台管理和数据库
  - 外部服务存在配额、限流、网络超时和供应商故障风险
  - 微信开发者工具的地图、定位和视口行为不能完全代表真机
  - 暂无完整的小程序端到端自动化和 CI，发布前仍需要 Android、iOS 微信真机回归
  - 公开后端尚需继续完善认证、限流、配额告警和正式日志保留策略
privacy:
  storesData: external
  sendsDataExternally: true
  externalServices:
    - 微信与腾讯地图
    - 高德地图
    - Geoapify
    - OpenStreetMap / OpenMapTiles
    - Google Maps
  notes:
    - 项目暂不建立用户账号，不在业务数据库中持久化用户位置、搜索历史、查询中心或导航记录，也不进行后台持续定位
    - 微信和腾讯地图处理小程序定位、地图底图及 wx.openLocation；高德处理国内地点、厕所、逆地理编码、地图和部分路线；Geoapify 处理海外城市识别、地点、厕所、地铁和网页地图瓦片；OpenStreetMap/OpenMapTiles 提供海外地图与 POI 基础数据；Google Maps 用于网页版海外外部导航
    - 高德 Web Service Key 和 Geoapify API Key 只保存在后端；浏览器必须使用的高德 JS Key 和瓦片 Key 属于客户端可见凭据，需要通过域名白名单、来源限制和独立配额保护
    - 后端诊断可能记录经过截断或四舍五入的查询坐标，正式上线前仍需确定日志访问权限和最短保留期限
whatItIs: “拉了么”是一个以地图为核心的公共厕所查询项目，现已形成统一后端、多个客户端的完整原型。网页版和微信小程序已经可以查询国内外地点、厕所与地铁站，Android 客户端仍在开发中；三个客户端共用厕所、地点、地铁和导航相关接口。
whyBuilt: 在陌生地点寻找公共厕所时，地点搜索、查询中心、搜索半径、地铁厕所状态和外部导航需要连成一套明确流程。这个项目也用于验证国内外不同地图与 POI 服务能否通过统一后端被多个客户端共同使用，减少重复维护。
coreFeatures:
  - 自动获取当前位置，并查询默认半径内的公共厕所
  - 选择城市后搜索具体地点，也可在地图上长按选点作为查询中心
  - 支持 300 m、500 m、1 km 和 3 km 查询半径
  - 使用专用地铁按钮查询中心点 20 km 内最近 10 个地铁站
  - 地铁厕所状态以绿色、红色、橙色分别表示有厕所、无厕所和不确定
  - 厕所与地铁结果独立加载，地图标记可以同时保留
  - 支持深浅色模式、地点详情、分享和外部导航
technicalApproach:
  - 后端使用 Node.js、REST JSON API、进程内缓存和 Node Test Runner，三个客户端共用厕所、地点、地铁与导航接口
  - 网页版使用 HTML、CSS、JavaScript、高德 JS API 与 Leaflet 1.9.4
  - 微信小程序使用 TypeScript、WXML、WXSS、微信原生 map、wx.getLocation 与 wx.openLocation
  - Android 客户端使用原生 Android、Gradle 与高德 Android SDK，目前仍在开发中
  - 国内地图与 POI 使用高德和 GCJ-02，海外地点与 POI 使用 Geoapify Geocoding/Places 和 WGS84
  - 海外网页底图使用 Leaflet、Geoapify Tiles 与 OpenStreetMap/OpenMapTiles，地铁数据按省、市和线路拆分为 JSON
  - 已执行 Node 语法检查、21 项单元测试、微信小程序 TypeScript 检查和真机人工测试
demoDescription: 网页版由独立服务器承载；右侧视频展示微信小程序的竖屏操作流程，也可扫描小程序码进入微信版本。Android 客户端仍在开发中，本页暂不提供下载或源码入口。
draft: false
---

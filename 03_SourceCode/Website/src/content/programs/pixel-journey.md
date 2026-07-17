---
title: 像素漫游个人站
slug: pixel-journey
summary: 用一条可逆的滚动时间轴，把文章、本人程序与个人介绍连接成连续世界。
status: in-progress
category: web-app
startDate: 2026-07
featured: true
order: 1
stack:
  - Astro
  - TypeScript
  - React
  - PixiJS
  - GSAP
tags:
  - Web
  - 叙事交互
demoType: external-live
demoUrl: /
ownerContribution:
  - 信息架构与内容结构设计
  - Astro 静态站点开发
  - PixiJS 场景与滚动状态协调
  - 响应式与 Reduced Motion 适配
limitations:
  - Program 演示系统仍在后续里程碑中完善
  - 部分场景细节与反向滚动验收尚未完成
privacy:
  storesData: none
  sendsDataExternally: false
  externalServices: []
whatItIs: 一个使用 Astro 构建的个人内容网站，通过可逆滚动把文章、本人程序和个人介绍组织成陆地、深海、星空三段旅程。
whyBuilt: 普通作品集擅长陈列，却不一定能表达创作过程。这个程序尝试让浏览本身成为叙事，同时保持正文、链接和静态路由真实可访问。
coreFeatures:
  - Markdown/MDX 内容在构建期生成独立静态页面
  - 单一滚动进度驱动三段 Canvas 场景
  - 真实 DOM 内容与 Canvas 背景分层
  - 支持移动端、键盘访问和 Reduced Motion
technicalApproach:
  - Astro Content Collections 管理文章与 Programs
  - React 交互岛负责首页状态和内容入口
  - PixiJS 绘制场景，GSAP ScrollTrigger 映射滚动进度
  - 生产输出为可独立托管的静态目录
demoDescription: 当前网站本身就是该程序的在线版本，可从演示入口返回旅程首页。
draft: false
---

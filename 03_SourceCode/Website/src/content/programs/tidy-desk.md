---
title: Tidy Desk
slug: tidy-desk
summary: 一个把零散工作记录整理成可检索时间线的本地优先小工具原型。
status: prototype
category: tool
startDate: 2026-04
featured: true
order: 2
stack:
  - React
  - TypeScript
  - IndexedDB
  - PWA
tags:
  - 本地优先
  - 效率工具
demoType: static-embedded
ownerContribution:
  - 产品概念与使用流程设计
  - 前端原型开发
  - 本地数据模型设计
  - 键盘操作与导入导出方案设计
limitations:
  - 当前只提供静态前端演示说明
  - 数据仅计划保存在当前浏览器
  - 未接入云同步、账号或跨设备协作
  - 不应作为正式数据备份工具
privacy:
  storesData: local-only
  sendsDataExternally: false
  externalServices: []
whatItIs: 一个本地优先的工作记录整理工具原型，用时间线、标签和搜索帮助归档临时记录。
whyBuilt: 临时记录需要足够快地落地，但传统知识库往往要求先分类。这个程序把整理延后，让记录先进入本地收件箱，再逐步补充结构。
coreFeatures:
  - 本地记录收集与时间线浏览
  - 标签与关键词筛选
  - 计划中的 JSON 导入导出
  - 删除和覆盖前的明确确认流程
technicalApproach:
  - React 负责界面与交互状态
  - IndexedDB 作为浏览器本地数据层
  - PWA 提供离线使用方向
  - 数据模型优先考虑可导出与可恢复
demoDescription: 本轮只展示界面和数据流程说明，不会模拟已经接通的账号、数据库或云同步结果。
draft: false
---

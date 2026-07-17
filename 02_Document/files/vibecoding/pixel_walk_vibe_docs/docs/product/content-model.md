# 内容模型 Content Model

## 1. Article

```yaml
title: 像素世界中的可逆滚动
description: 记录如何把滚动位置映射成可逆场景时间线。
publishDate: 2026-07-17
updatedDate: 2026-07-17
cover: /assets/articles/reversible-scroll/cover.webp
tags:
  - 前端
  - 动画
featured: true
draft: false
```

规则：标题、摘要、发布日期必填；标签至少一个；草稿不进入生产列表；slug 唯一；图片路径构建时可解析。

## 2. Program

“做点啥呢”中的条目必须使用 Program 模型。

```yaml
title: Tidy Desk
summary: 一个把零散工作记录整理成可检索时间线的本地优先工具。
status: prototype
category: tool
startDate: 2026-04
endDate:
cover: /assets/programs/tidy-desk/cover.webp
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
demoEntry: tidy-desk
demoUrl:
sourceUrl:

ownerContribution:
  - 产品设计
  - 前端开发
  - 本地数据模型
  - 交互设计

limitations:
  - 演示版只保存在当前浏览器
  - 未接入云同步
  - 不适合作为正式数据备份

privacy:
  storesData: local-only
  sendsDataExternally: false
  externalServices: []
```

## 3. Program 字段

| 字段 | 必填 | 说明 |
|---|---:|---|
| title | 是 | 程序名称 |
| summary | 是 | 一句话说明 |
| status | 是 | completed/in-progress/prototype/archived |
| category | 是 | 程序类型 |
| stack | 是 | 技术栈 |
| tags | 是 | 标签 |
| featured | 是 | 是否首页展示 |
| demoType | 是 | 演示方式 |
| ownerContribution | 是 | 本人完成内容 |
| limitations | 推荐 | 演示限制 |
| cover | 推荐 | 封面 |
| demoEntry | 条件 | 站内组件注册键 |
| demoUrl | 条件 | iframe或外部地址 |
| sourceUrl | 否 | 源码地址 |
| privacy | 推荐 | 数据处理说明 |

## 4. Program 分类

```text
web-app
desktop-app
mini-program
tool
visualization
automation
game-prototype
experiment
other
```

## 5. 演示类型

- `static-embedded`：站内按需加载组件；
- `external-live`：跳转外部程序；
- `video`：视频演示；
- `gif`：短动画；
- `screenshots`：截图画廊；
- `none`：暂无演示。

## 6. 内容真实性

每个程序详情页必须回答：这是什么、谁写的、本人写了什么、是否能真实运行、缺失哪些功能、是否依赖外部服务、是否存储或发送数据。

## 7. 从 Projects 迁移

1. 备份当前内容；
2. 建立 Program schema；
3. 对每个旧条目分类；
4. 非本人程序移出“做点啥呢”；
5. 补充 `ownerContribution`、`demoType`、`limitations`；
6. 迁移 slug；
7. 保留旧地址兼容；
8. 更新搜索索引和测试。

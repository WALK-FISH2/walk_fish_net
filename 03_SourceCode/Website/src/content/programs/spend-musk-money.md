---
title: 花光马斯克的钱
slug: spend-musk-money
summary: 一个以 4000 亿美元虚拟预算为核心的消费模拟小游戏，通过商品清单、限时挑战、成就和消费统计，直观体验一笔极大金额究竟有多难花完。
status: prototype
category: game-prototype
featured: true
order: 10
stack:
  - Taro
  - React
  - JavaScript
  - PWA
  - Cloudflare Pages
tags:
  - 消费模拟
  - 互动游戏
  - 本地存储
  - 跨端原型
demoType: external-live
demoUrl: "https://exhaust-all-of-musk-s-money.pages.dev/#/pages/index/index"
platforms:
  - kind: web
    label: 打开网页版
    url: "https://exhaust-all-of-musk-s-money.pages.dev/#/pages/index/index"
ownerContribution:
  - 设计以 4000 亿美元虚拟预算为核心的自由消费与限时挑战玩法
  - 完成商品分类、关键词搜索、数量输入、加减与 MAX 快捷操作等主要交互
  - 实现余额、消费进度、购物清单、结果统计和精确清零流程
  - 建立成就、长期解锁进度、挑战纪录、游戏恢复与本地数据清理机制
  - 完成 Taro H5、PWA 静态构建和 Cloudflare Pages 在线部署
limitations:
  - 当前是 M0 阶段的互动原型，后续商品、数值、挑战和视觉细节仍可能调整
  - 4000 亿美元预算和商品价格用于游戏化体验，不代表实时净资产或真实市场报价
  - 游戏进度、成就、挑战纪录和偏好只保存在当前浏览器，清理站点数据后无法恢复
  - 暂无账号、云同步、排行榜、多人玩法或服务端存档
privacy:
  storesData: local-only
  sendsDataExternally: false
  externalServices: []
  notes:
    - 当前游戏进度、永久成就、挑战纪录和偏好保存在访问者自己的浏览器中
    - 项目不建立用户账号，不把商品选择、消费记录或挑战成绩发送到业务后端
    - 页面和静态资源由 Cloudflare Pages 提供，程序本身没有独立数据接口或数据库
whatItIs: “花光马斯克的钱”是一个浏览器端消费模拟小游戏。访问者获得 4000 亿美元虚拟预算，可以从不同分类的商品中调整购买数量，观察余额、消费比例、购物清单和结果统计，并尝试在自由模式或限时挑战中把余额花到零。
whyBuilt: 极大的财富数字很难通过普通文字形成直觉。这个程序把抽象金额转换成连续的购买操作和即时统计，同时用限时挑战、成就与精确清零目标增加可重复体验，也用于验证一套状态明确、可本地恢复的跨端互动原型。
coreFeatures:
  - 提供自由模式，以及 30 秒、60 秒和 300 秒限时挑战
  - 按商品分类浏览，并支持关键词搜索
  - 支持手动数量、加减按钮和 MAX 快捷购买
  - 实时计算剩余余额、累计消费和消费进度
  - 生成购物清单、总件数、商品种类、覆盖分类和最高单项消费等结果
  - 支持精确清零、挑战结算和重新开始
  - 提供永久成就、解锁记录与本地挑战最佳纪录
  - 自动恢复未完成游戏，并允许主动清除全部本地数据
technicalApproach:
  - 使用 Taro 与 React 构建 H5 页面和组件交互，当前公开版本通过 hash 路由运行
  - 将商品目录、购买规则、余额校验、挑战计时、结果统计和成就判定组织为明确的状态流程
  - 对数量、单价、预算和截止时间执行边界校验，避免无效数量、超额购买和过期挑战继续写入状态
  - 在浏览器本地持久化当前游戏、长期成就、挑战纪录和显示偏好，并提供恢复、重开与清除入口
  - 使用 PWA 静态资源和 Service Worker 支持网页安装与资源缓存方向，通过 Cloudflare Pages 独立部署
demoDescription: 网页版是可以直接操作的真实在线原型，当前无需登录。程序数据只保存在当前浏览器；本页不嵌入外站代码，也不宣称存在账号、云存档或服务端排行榜。
draft: false
---

# ADR 0006: 程序演示必须与主站隔离

- Status: Accepted
- Date: 2026-07-17
- Decision Owners: 项目所有者

## Context

“做点啥呢”需要展示本人程序示例。演示可能有独立 CSS、脚本、存储和错误，不能影响主站。

## Decision

演示按风险采用按需加载独立组件、sandbox iframe、外部新标签或视频/截图。建立 DemoRegistry，不把全部演示打入首页。

## Alternatives

所有演示直接嵌入主组件；只提供截图；自建统一后端。

## Consequences

隔离更安全，加载更轻；需要注册表、错误边界和权限说明。

## Verification

演示崩溃不导致主站白屏，iframe 不能任意控制顶层页面。

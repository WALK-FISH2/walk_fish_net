# ADR 0004: Canvas 只负责场景，DOM 负责内容

- Status: Accepted
- Date: 2026-07-17
- Decision Owners: 项目所有者

## Context

沉浸式场景需要 Canvas/WebGL，但文章、程序和导航必须可访问、可搜索和可降级。

## Decision

Canvas 负责环境与装饰；DOM 负责全部重要信息和交互。分层不代表允许旋转 Canvas 世界；按照产品更正，Canvas 与 DOM 在全部阶段都保持水平。

## Alternatives

全部 Canvas；全部 DOM 绝对定位。

## Consequences

需要协调两个渲染层，但可访问性、SEO 和降级更可靠。

## Verification

禁用 Canvas 后仍能阅读和导航；海洋到星空期间 Canvas 世界方向固定为 0°。

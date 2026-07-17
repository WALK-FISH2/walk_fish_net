# ADR 0007: 渐进增强和 Reduced Motion

- Status: Accepted
- Date: 2026-07-17
- Decision Owners: 项目所有者

## Context

沉浸式动画可能在低性能设备、无 WebGL 或减少动画用户环境中不可用。

## Decision

核心内容优先，提供 high/medium/low/static 四级体验并支持 `prefers-reduced-motion`。

## Alternatives

只支持高性能桌面；Canvas 失败空白；Reduced Motion 移除全部场景。

## Consequences

实现复杂度增加，但扩大可用范围。

## Verification

关闭 WebGL 或开启 Reduced Motion 后仍有三个可辨识世界和完整内容。

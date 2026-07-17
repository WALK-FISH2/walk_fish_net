# ADR 0005: 使用统一滚动进度状态机

- Status: Accepted
- Date: 2026-07-17
- Decision Owners: 项目所有者

## Context

多个场景和过渡需要可逆，分散监听滚动会造成冲突和回滚跳变。

## Decision

使用单一 globalProgress 0..1，所有场景映射局部进度。海洋到星空只映射颜色、透明度、光束、浪花和粒子形态，世界方向是固定 0°的不变量。

## Alternatives

每区块一次性播放、多个独立 scroll handler、视频播放。

## Consequences

时间线更清晰、可测试；需要集中管理进度和场景生命周期。

## Verification

向上滚动完整倒放，同一进度画面基本一致；正向和反向经过 0.66–0.80 时均不产生世界旋转。

# 提示词：做点啥呢程序演示模块

请先阅读 spec、architecture、content-model 和 ADR 0006/0009。

本轮目标：把“做点啥呢”建设为本人编写程序的真实展示与演示系统，不要做成普通工作项目列表。

请完成：

1. Program schema、ProgramStatus、DemoType；
2. ownerContribution、limitations 和 privacy；
3. DemoRegistry；
4. 按需加载静态组件；
5. sandbox iframe；
6. 外部演示；
7. 视频、GIF 和截图；
8. 加载、失败和关闭状态；
9. “静态演示版/功能有限”提示；
10. 不伪造后端成功；
11. 至少接入一个真实本人程序；
12. 迁移 `/projects` 并兼容旧链接；
13. 更新测试和文档。

验收：演示崩溃不导致主站白屏；iframe 不能控制顶层页面；移动端可用；不包含秘密；详情页明确本人完成内容；静态构建成功。

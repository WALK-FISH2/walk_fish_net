# AGENTS.md

本文件是 Codex、ChatGPT、Claude Code 和其他 AI 编程代理在本仓库中的操作说明。

## 1. 必读顺序

任何修改前必须阅读：

```text
constitution.md
spec.md
architecture.md
plan.md
tasks.md
相关 docs/adr/*.md
```

按任务补充阅读：

```text
内容模型：docs/product/content-model.md
滚动交互：docs/product/interaction-spec.md
视觉系统：docs/product/visual-system.md
测试：docs/engineering/testing-strategy.md
部署：docs/engineering/static-deployment.md
程序演示：docs/adr/0006-program-demo-isolation.md
```

## 2. 开始任务前

必须：

1. 查看当前工作目录；
2. 查看 `git status`；
3. 阅读 `package.json`；
4. 确认现有技术栈和构建脚本；
5. 查找相关代码；
6. 查看 `tasks.md` 中对应任务；
7. 给出最小实施计划。

禁止：

- 未检查仓库就重建项目；
- 未经允许替换整个框架；
- 删除不认识的文件；
- 执行 `git reset --hard`；
- 强制覆盖用户本地改动；
- 将当前功能退化为占位实现。

## 3. 任务粒度

一次开发会话尽量只处理一个目标，例如静态导出审查、陆地世界视觉、程序演示沙箱或海洋到星空过渡。

大任务必须先拆分到 `tasks.md`。

## 4. 领域语义

“做点啥呢”表示站点所有者本人编写的程序示例和演示。

代码中优先使用：

```text
Program
ProgramDemo
programs
/programs
```

若现有代码使用 `Project/projects/projects`，不要立即暴力全局替换。先统计引用、设计迁移、保留旧链接兼容、更新内容模型和测试，再实施。

## 5. 编码规则

必须：

- TypeScript 严格模式；
- 尽量避免 `any`；
- 核心类型集中定义；
- 资源路径和动画区间集中配置；
- 组件职责单一；
- 所有事件监听和动画实例有清理；
- 使用可测试纯函数处理进度映射。

不要：

- 把全部首页写在一个组件中；
- 在多个组件各自监听滚动；
- 在 Canvas 中绘制正文；
- 使用随机数导致回滚跳变；
- 引入无关大型依赖；
- 使用来源不明素材。

## 6. 文档同步规则

| 修改 | 必须更新 |
|---|---|
| 新增或调整路由 | `spec.md`、`architecture.md`、路由测试 |
| 调整文章/程序字段 | `content-model.md` |
| 调整阶段进度 | `interaction-spec.md`、配置说明 |
| 改变框架或渲染方式 | 新 ADR、`architecture.md` |
| 改变部署方式 | `static-deployment.md` |
| 改变演示隔离策略 | ADR 0006 或新 ADR |
| 完成任务 | `tasks.md` |
| 发布版本 | `CHANGELOG.md` |

## 7. 验证规则

优先使用 `package.json` 已存在的脚本。期望至少覆盖类型、Lint、测试、构建和 E2E。

任何“验证通过”都要记录：

```text
命令
退出码
关键输出
静态输出目录
已验证路由
```

只完成代码但没有运行验证时，应写“实现完成，尚未验证”。

## 8. 浏览器验证

涉及视觉或交互时，至少验证桌面、375px、Reduced Motion、正向与反向滚动、详情页刷新、Canvas 降级、键盘 Tab 和控制台。

关键进度截图：

```text
0%
25%
50%
72%
90%
```

## 9. 完成汇报模板

```text
## 本轮完成
- ...

## 修改文件
- ...

## 验证
- `npm run ...`：通过/失败
- 静态输出：...
- 路由检查：...

## 文档同步
- ...

## 仍存在的问题
- ...

## 下一步
- ...
```

## 10. 提交前检查

使用：

```text
.codex/checklists/preflight.md
.codex/checklists/handoff.md
docs/workflows/review-checklist.md
```

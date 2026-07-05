# Harness Start Here

## 目的

这个 harness 是给 AI 开发者的项目导航系统。它的目标不是替代代码阅读，而是让 DeepSeek 在每次开发前快速知道：

- 项目是什么，当前功能边界在哪里。
- 代码模块如何协作。
- 常见任务应该先读哪些文件。
- 修改后如何验证。
- 哪些开发约定不能随意破坏。

## Harness 理念

调研主流 AI coding 入口文档和规则系统后，本项目采用这些实践：

- 入口薄：`AGENTS.md` 只放启动路径和硬规则。
- 分层读：项目概览、架构、功能地图、规范、验证分别维护。
- 按需读：每次任务只加载相关 harness 文件，避免长上下文稀释重点。
- 可执行：规范必须能落到命令、文件位置、检查清单。
- 常更新：代码结构变化时同步更新 harness，避免 AI 读到过期地图。

详细调研摘要见 `harness/RESEARCH_NOTES.md`。
DeepSeek 启动提示模板见 `harness/DEEPSEEK_BOOTSTRAP.md`。

## 每次开发前的读取流程

所有任务都先读：

1. `AGENTS.md`
2. `harness/START_HERE.md`
3. `harness/PROJECT_BRIEF.md`

然后按任务类型追加读取：

| 任务类型 | 追加读取 |
| --- | --- |
| 改 Three.js 场景、相机、动画 | `harness/ARCHITECTURE.md`, `harness/FEATURE_MAP.md`, `harness/VERIFICATION.md` |
| 加 3D 对象、岛屿元素、角色 | `harness/FEATURE_MAP.md`, `harness/DEVELOPMENT_GUIDE.md`, `harness/TASK_PLAYBOOKS.md` |
| 改 canvas 布局、移动端显示 | `harness/DEVELOPMENT_GUIDE.md`, `harness/VERIFICATION.md` |
| 引入新库或资源管线 | `harness/ARCHITECTURE.md`, `harness/DECISIONS.md`, `harness/VERIFICATION.md` |
| 修 bug | `harness/ARCHITECTURE.md`, `harness/TASK_PLAYBOOKS.md`, `harness/VERIFICATION.md` |
| 大改或重构 | 全部 harness 文件，并更新 `harness/DECISIONS.md` |
| 配置 DeepSeek 启动流程 | `harness/DEEPSEEK_BOOTSTRAP.md` |

## 修改后必须考虑是否更新

- 新模块、新职责、新数据流：更新 `ARCHITECTURE.md`。
- 新玩法、新关卡、新障碍：更新 `FEATURE_MAP.md`。
- 新约定、新依赖、新限制：更新 `DEVELOPMENT_GUIDE.md`。
- 新测试命令、新运行方式：更新 `VERIFICATION.md`。
- 做出长期取舍：更新 `DECISIONS.md`。

## TDD 要求

每个新功能或 bug 修复都应先写或更新测试。场景结构用 Vitest，真实 3D 渲染和移动端用 Playwright，验证命令见 `harness/VERIFICATION.md`。

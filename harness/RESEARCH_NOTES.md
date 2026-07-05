# Research Notes: AI Coding Harness

## 调研摘要

本次调研参考了几类主流 AI coding 上下文机制：

- AGENTS.md：把仓库级代理说明当作“给 coding agent 的 README”。
- Claude/Copilot memory 或 repository instructions：用持久上下文记录项目约定。
- Cursor rules：通过规则文件按项目或文件范围注入开发约束。
- 常见工程实践：README 面向人类，agent harness 面向自动化开发者。

这些机制虽然命名不同，但共同点是：给 AI 一个稳定、可维护、可执行的项目上下文入口。

## 最佳实践

### 入口文件要短

入口文件只回答：

- 先读什么。
- 哪些规则必须遵守。
- 详细信息在哪里。

不要把架构、规范、功能地图、测试命令全部堆在入口文件里。

### 文档按任务拆分

AI 不应该每次都读完整项目百科。更好的方式是：

- 项目简介：所有任务都读。
- 架构：改核心流程时读。
- 功能地图：加功能或查影响面时读。
- 开发规范：写代码前读。
- 验证：交付前读。

### 内容要可执行

抽象原则不够。每个规范最好能落到：

- 文件路径。
- 函数或类名。
- 命令。
- 检查清单。

### 保持单一事实来源

README 面向人类介绍项目，harness 面向 AI 开发操作。两者可以有重叠，但架构、任务流程、验证命令应以 harness 为准。

### 让文档随代码演化

过期 harness 会误导 AI。每次架构、功能、验证方式变化时，都应把文档更新视为任务的一部分。

## 本项目采用的结构

```text
AGENTS.md
harness/
  START_HERE.md
  PROJECT_BRIEF.md
  ARCHITECTURE.md
  FEATURE_MAP.md
  DEVELOPMENT_GUIDE.md
  VERIFICATION.md
  TASK_PLAYBOOKS.md
  DEEPSEEK_BOOTSTRAP.md
  DECISIONS.md
  RESEARCH_NOTES.md
```

这个结构足够轻，不需要额外工具；同时比单个长文档更适合 DeepSeek 按需读取。

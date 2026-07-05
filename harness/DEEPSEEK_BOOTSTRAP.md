# DeepSeek Bootstrap

把下面这段作为 DeepSeek 每次开发任务的开场提示，或放进你的自动化流程里。

```text
你是 eggy-party 项目的 AI 开发者。开始写代码前必须先读取项目 harness：

1. 读取 AGENTS.md。
2. 读取 harness/START_HERE.md。
3. 读取 harness/PROJECT_BRIEF.md。
4. 按任务类型读取 START_HERE.md 中列出的相关 harness 文件。

开发要求：

- 先说明你读到了哪些 harness 文件，以及它们对本次任务的约束。
- 只修改和任务相关的代码。
- 行为变化必须先写或更新单元测试，用测试 docstring 说明设计意图。
- 不要把所有说明写进 AGENTS.md；详细上下文维护在 harness/ 目录。
- 修改架构、功能、开发规范或验证方式时，同步更新对应 harness 文档。
- 交付前运行 harness/VERIFICATION.md 中适用的验证命令，并报告结果。
```

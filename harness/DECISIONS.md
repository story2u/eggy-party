# Decisions

记录会影响后续开发方向的决定。小 bug 修复不用写。

## 2026-07-05: 使用轻量分层 harness

决定：

- `AGENTS.md` 作为薄入口，只放读取顺序和硬规则。
- 详细上下文放在 `harness/` 目录。
- 按主题拆分为项目简介、架构、功能地图、开发规范、验证、任务 playbook、决策记录。

原因：

- AI 每次开发前需要稳定上下文。
- 单个大文档容易过长、过期且难以按任务读取。
- 当前项目较小，不需要复杂文档系统或外部工具。

## 2026-07-05: 保持 Pygame demo 架构

决定：

- 继续使用现有 Python + Pygame 单进程架构。
- 暂不引入大型游戏框架、ECS、外部物理引擎或资源管线。

原因：

- 项目目标是教学和原型验证。
- 当前功能规模可以由清晰模块边界支撑。
- 过早抽象会降低初学者可读性。

## 2026-07-05: 使用 unittest 作为 TDD 基线

决定：

- 当前测试框架使用 Python 标准库 `unittest`。
- 测试放在 `tests/`，通过 `python3 -m unittest discover -s tests -v` 运行。
- 每个测试方法写 docstring，用来记录功能设计意图。

原因：

- 当前环境没有安装 pytest，unittest 可零依赖运行。
- 项目规模小，标准库测试足够覆盖核心行为。
- DeepSeek 可以通过测试名称和 docstring 理解回归保护的原因。

## 2026-07-05: 主线迁移到 Vite + TypeScript + Three.js

决定：

- 根目录主项目从 Python/Pygame 2D demo 迁移到 Web 3D。
- 技术栈为 Vite、TypeScript、Three.js、Vitest、Playwright。
- 旧 2D 原型归档到 `legacy/pygame-2d/`。

原因：

- 用户目标变为 3D 蛋仔岛展示。
- Three.js 更适合轻量 3D Web 展示和后续浏览器验收。
- Vite + TypeScript 提供更好的模块化、类型检查和 DeepSeek 接手边界。

## 2026-07-05: 3D 验证必须包含浏览器像素检查

决定：

- 单元测试使用 Vitest。
- 真实渲染验证使用 Playwright，覆盖桌面和移动 viewport。
- Playwright 测试必须检查 canvas 全视口、非空和颜色变化，并输出截图。

原因：

- 3D 场景只通过类型检查无法确认画面是否真的渲染。
- headless WebGL 容易出现空 canvas、相机错位或移动端尺寸问题。

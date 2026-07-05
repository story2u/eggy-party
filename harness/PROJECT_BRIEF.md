# Project Brief

## 项目定位

`eggy-party` 现在是一个基于 Vite + TypeScript + Three.js 的 3D 蛋仔岛展示项目。当前阶段不是完整玩法游戏，而是为后续 DeepSeek 开发提供稳定的 3D 场景、工程结构和验证基线。

旧 Python/Pygame 2D 原型已归档到 `legacy/pygame-2d/`，仅作为历史参考，不再作为主开发方向。

## 当前目标体验

- 打开页面后直接进入全屏 3D 蛋仔岛。
- 场景包含浮岛、水面、沙滩、中央广场、蛋仔角色、棕榈树、云、码头和入口拱门。
- 相机可以围绕岛屿查看，场景有轻微动画。
- 桌面和移动视口都必须能渲染出非空 3D canvas。

## 技术边界

- 语言：TypeScript。
- 构建与开发服务器：Vite。
- 3D 渲染：Three.js。
- 单元测试：Vitest。
- 浏览器回归：Playwright。
- 当前不引入物理引擎、后端服务、联网或账号系统。

## 非目标

- 不继续扩展根目录下的 Python/Pygame 2D 代码。
- 不引入大型游戏引擎或复杂 ECS，除非玩法复杂度真正需要。
- 不把首屏做成营销页；首屏就是 3D 场景。
- 不依赖网络资源加载基础场景，基础展示应能本地离线运行。

## 维护者

- 主要维护者：AI coding agent + 人类审阅。
- DeepSeek 接手新功能前必须先读 `AGENTS.md` 和 `harness/START_HERE.md`。

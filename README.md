# Eggy Island

3D 蛋仔岛基础展示项目。当前目标是提供一个稳定的 Three.js 场景骨架，让后续 DeepSeek 可以继续扩展玩法、交互、角色和关卡。

## 技术栈

| 技术 | 用途 |
| --- | --- |
| Vite | 本地开发服务器和构建 |
| TypeScript | 主要开发语言 |
| Three.js | 3D 场景、渲染、相机、灯光 |
| Vitest | 单元测试 |
| Playwright | 桌面/移动 3D canvas 回归验证 |

## 运行

```bash
npm install
npm run dev
```

然后打开 Vite 输出的本地地址，默认是 `http://localhost:5173`。

也可以用：

```bash
./run.sh
```

## 验证

```bash
npm run typecheck
npm test
npm run build
npm run test:e2e
```

完整验证：

```bash
npm run verify
```

## 项目结构

```text
eggy-party/
├── src/
│   ├── app/                 # Three.js 应用生命周期
│   ├── world/               # 蛋仔岛场景对象和工厂函数
│   ├── main.ts              # 浏览器入口
│   └── styles.css           # 全屏 3D 画布样式
├── tests/
│   ├── unit/                # Vitest 单元测试
│   └── e2e/                 # Playwright 视觉/渲染回归
├── harness/                 # AI 开发上下文
├── legacy/pygame-2d/        # 旧 Pygame 2D 原型归档
├── index.html
└── package.json
```

## 当前展示内容

- 浮岛、海面、沙滩和中央广场。
- 三个蛋仔角色。
- 棕榈树、云、码头、弹跳垫和入口拱门。
- 自动旋转相机控制和轻微场景动画。

后续新增玩法时，先阅读 `AGENTS.md` 和 `harness/START_HERE.md`。

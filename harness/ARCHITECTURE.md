# Architecture

## 运行入口

- `index.html`：浏览器入口，挂载 `#app`。
- `src/main.ts`：创建 `EggyIslandApp` 并启动渲染。
- `src/app/EggyIslandApp.ts`：Three.js renderer、camera、OrbitControls、resize、animation loop 生命周期。
- `run.sh`：执行 `npm run dev -- --host 0.0.0.0`。

## 核心模块

| 路径 | 职责 |
| --- | --- |
| `src/app/EggyIslandApp.ts` | 应用生命周期、渲染器、相机、控制器、窗口 resize、动画循环 |
| `src/world/createEggyIslandScene.ts` | 组合完整蛋仔岛场景，暴露 `scene`、`cameraTarget`、`update` |
| `src/world/createIslandBase.ts` | 浮岛、草地、沙滩、石头等地形对象 |
| `src/world/createEggyCharacter.ts` | 蛋仔角色模型工厂 |
| `src/world/createPalmTree.ts` | 棕榈树模型工厂 |
| `src/styles.css` | 全屏 canvas 和基础页面样式 |
| `tests/unit/` | Vitest 单元测试，验证场景结构和意图 |
| `tests/e2e/` | Playwright 桌面/移动 WebGL canvas 验证 |
| `legacy/pygame-2d/` | 旧 2D Pygame 原型归档 |

## 数据流

`EggyIslandApp` 创建 renderer/camera/controls，然后调用 `createEggyIslandScene()` 获取场景对象。每帧：

1. 用 `performance.now()` 计算 `delta` 和 `elapsed`。
2. 调用 `island.update(delta, elapsed)` 更新动画。
3. 调用 `controls.update()`。
4. `renderer.render(scene, camera)` 绘制 WebGL canvas。

## 场景对象约定

- 可被测试或后续功能识别的重要对象必须设置 `name`。
- 重要类别使用 `object.userData.kind` 标记，例如：
  - `island`
  - `water`
  - `eggy-character`
  - `landmark`
  - `play-prop`
  - `foliage`
- 新增场景工厂优先放在 `src/world/`，避免把所有几何体堆进 app 生命周期类。

## 渲染和交互约定

- Three.js canvas 必须全视口显示，不放在装饰性卡片里。
- 3D 场景是第一屏主体，不添加营销 hero。
- 使用 `OrbitControls` 做基础查看交互，后续玩法控制再单独设计。
- 基础展示使用程序化 Three.js 几何体，不依赖远程图片资源。

## 测试边界

- 单元测试验证场景结构、对象命名、动画更新不会替换关键对象。
- Playwright 验证桌面/移动 canvas 全屏、非空、有足够颜色变化，并保存截图。

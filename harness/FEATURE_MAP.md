# Feature Map

## 已有功能

| 功能 | 位置 | 说明 |
| --- | --- | --- |
| 全屏 3D 入口 | `index.html`, `src/main.ts` | 页面直接挂载 Three.js canvas |
| 应用生命周期 | `src/app/EggyIslandApp.ts` | renderer、camera、controls、resize、animation loop |
| 蛋仔岛场景 | `src/world/createEggyIslandScene.ts` | 组合岛屿、水面、蛋仔、装饰和动画 |
| 共享材质 | `src/world/materials.ts` | 高饱和卡通材质和 `applyShadows` |
| 大厅岛地形 | `src/world/createIslandBase.ts` | 圆形石质广场、外圈道路、局部绿化、台阶、路缘 |
| 中央蛋仔雕像 | `src/world/createCentralEggyStatue.ts` | 大型原创白黄蛋仔雕像、台座、星星眼和发光道具 |
| 左侧摩天轮 | `src/world/createFerrisWheel.ts` | 彩色轮圈、支撑架、8 个座舱，场景 update 中缓慢旋转 |
| 右侧火箭塔 | `src/world/createRocketHub.ts` | 白橙火箭舱体、发射平台、金属围栏、发光指示灯 |
| 广场细节 | `src/world/createPlazaDetails.ts` | 地砖线、斑马线、护栏、灯杆、锥桶、装饰箱、花坛、GlowPickup |
| 蛋仔角色 | `src/world/createEggyCharacter.ts` | 程序化蛋仔模型，含身体、脸、手臂、脚、腰带/背包/头饰 |
| 棕榈树 | `src/world/createPalmTree.ts` | 程序化树干和叶子 |
| 相机查看 | `OrbitControls` in `EggyIslandApp` | 更低更近的大厅视角，移动端保持完整可见 |
| 场景单测 | `tests/unit/scene.test.ts` | 保护对象命名、类别和动画意图 |
| 浏览器渲染回归 | `tests/e2e/island.spec.ts` | 桌面/移动 canvas 非空、全视口、截图 |
| 旧 2D 原型归档 | `legacy/pygame-2d/` | 保留历史实现，不作为当前主线 |

## 重要扩展点

- 新 3D 道具：在 `src/world/` 新增工厂函数，并设置 `name` 和 `userData.kind`。
- 新动画：优先通过 `createEggyIslandScene().update(delta, elapsed)` 编排。
- 新相机策略：修改 `EggyIslandApp`，并同步 Playwright 视口验证。
- 新玩法输入：不要塞进 `createEggyIslandScene`；新增 `src/input/` 或 `src/gameplay/`。
- 新素材管线：先设计加载边界和 fallback，再引入到场景。

## 当前缺口

- 没有玩家可控角色。
- 没有碰撞、任务、关卡或物理。
- 没有音效和资源加载器。
- 没有性能监控或帧率面板。

# Task Playbooks

## 加 3D 场景对象

1. 阅读 `harness/ARCHITECTURE.md` 和 `harness/FEATURE_MAP.md`。
2. 先在 `tests/unit/` 写对象存在、命名或类别测试。
3. 在 `src/world/` 新增或扩展工厂函数。
4. 设置 `object.name` 和 `object.userData.kind`。
5. 如果影响画面构图，运行 `npm run test:e2e`。
6. 更新 `harness/FEATURE_MAP.md`。

## 改相机或画布布局

1. 阅读 `src/app/EggyIslandApp.ts`。
2. 先补 Playwright 断言，覆盖桌面和移动视口。
3. 修改相机、controls 或 CSS。
4. 运行 `npm run test:e2e` 并查看截图。

## 加动画

1. 在 Vitest 中写动画意图测试，至少验证对象被更新且不被替换。
2. 使用 `delta` 和 `elapsed`，不要依赖固定帧率。
3. 把动画编排放在 `createEggyIslandScene().update` 或专门的 animation 模块。

## 修 bug

1. 先复现。
2. 选择 Vitest 或 Playwright 写失败测试。
3. 做最小修复。
4. 运行 `npm run typecheck && npm test && npm run build`。
5. 涉及渲染时额外运行 `npm run test:e2e`。

## 引入新库

1. 说明它解决的问题，以及为什么现有 Three.js/Vite 不够。
2. 更新 `package.json`。
3. 更新 `harness/DECISIONS.md`。
4. 更新验证命令或测试策略。

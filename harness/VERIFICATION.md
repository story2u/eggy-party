# Verification

## TDD 基线

本项目继续使用 TDD。新增功能或修 bug 时，先写或更新测试，再修改实现。

当前测试分两层：

- `tests/unit/`：Vitest，验证场景结构和纯逻辑。
- `tests/e2e/`：Playwright，验证真实浏览器中的 WebGL canvas。

## 快速验证

每次代码修改后至少运行：

```bash
npm run typecheck
npm test
npm run build
```

## 3D 浏览器验证

涉及 Three.js 场景、样式、相机、交互或首屏显示时必须运行：

```bash
npm run test:e2e
```

Playwright 测试会覆盖：

- desktop Chromium viewport。
- mobile Chromium viewport。
- canvas 是否全视口。
- WebGL 像素是否非空且颜色足够丰富。
- 截图输出到 `test-results/`。

如果本机首次运行 Playwright 缺浏览器：

```bash
npx playwright install chromium
```

## 完整验证

```bash
npm run verify
```

## 手动验证

```bash
npm install
npm run dev
```

打开 `http://localhost:5173`，检查：

- 首屏就是 3D 蛋仔岛。
- 岛屿、水面、蛋仔、树、云等对象可见。
- 拖动/触摸可围绕岛屿观察。
- 桌面和手机尺寸下文字与 canvas 不重叠。

## 当前测试缺口

- 尚未测试具体用户输入玩法，因为当前只是 3D 展示。
- 尚未做性能预算测试。
- 尚未做视觉差异快照比对，只做非空 canvas 和截图留档。

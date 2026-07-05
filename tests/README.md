# Tests

当前测试体系：

- `unit/`：Vitest，验证 Three.js 场景结构、对象命名、类别和动画意图。
- `e2e/`：Playwright，验证真实浏览器中的 3D canvas。

常用命令：

```bash
npm run typecheck
npm test
npm run build
npm run test:e2e
```

TDD 流程：

1. 先写或更新测试。
2. 再改实现。
3. 用测试名称和断言表达功能意图。
4. 3D 画面相关变化必须跑 Playwright。

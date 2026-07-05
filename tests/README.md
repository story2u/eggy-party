# Tests

测试文件按代码模块组织。每个测试方法都应写一句 docstring，说明这个测试保护的设计意图。

运行全部测试：

```bash
python3 -m unittest discover -s tests -v
```

TDD 流程：

1. 先为新功能或 bug 写一个会失败的测试。
2. 再改实现让测试通过。
3. 保留测试作为回归保护和功能意图说明。


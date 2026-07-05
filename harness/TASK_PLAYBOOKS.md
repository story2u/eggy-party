# Task Playbooks

## 修 bug

1. 复现或定位触发路径。
2. 先写一个失败的回归测试，docstring 写清当初应该保护的行为。
3. 阅读相关模块和 `harness/ARCHITECTURE.md`。
4. 做最小范围修改让测试通过。
5. 运行 `harness/VERIFICATION.md` 中的快速验证和必要 smoke test。
6. 如果 bug 暴露了架构或规范缺口，更新对应 harness 文件。

## 加新关卡

1. 阅读 `harness/FEATURE_MAP.md`。
2. 先在 `tests/test_level_data.py` 或新测试文件中写关卡意图测试。
3. 在 `level.py` 新增 `LEVEL_N`。
4. 复用已有障碍类，除非任务需要新机制。
5. 把关卡加入 `ALL_LEVELS`。
6. 手动运行游戏检查出生点、平台、终点、摄像机和 AI。
7. 更新 `harness/FEATURE_MAP.md`。

## 加新障碍

1. 阅读 `obstacles.py` 现有类。
2. 先在 `tests/test_obstacles.py` 写障碍状态、hitbox 或规则测试。
3. 新类继承 `Obstacle`。
4. 实现 `update`、`draw`、`get_hitbox`。
5. 在一个关卡中接入并验证屏幕坐标和摄像机偏移。
6. 如需伤害或淘汰，在 `game.py` 中统一处理碰撞效果。
7. 更新 `harness/FEATURE_MAP.md`。

## 改玩家/AI

1. 阅读 `player.py`。
2. 先在 `tests/test_player.py` 写行为测试。
3. 输入映射留在 `game.py`，角色运动规则留在 `player.py`。
4. 保持 `dt` 单位为秒。
5. 验证人类玩家和 AI 都不会卡死在第一关开头。

## 改 UI/HUD

1. 阅读 `game.py` 的渲染区域。
2. 使用 `font_utils.get_font`。
3. 优先避免 emoji，除非已确认目标字体支持。
4. 运行渲染 smoke test。
5. 手动查看文字是否溢出。

## 重构

1. 先写下重构目标和不会改变的行为。
2. 保持一次重构只移动一个清晰边界。
3. 不在同一次提交里混入大量玩法变化。
4. 更新 `harness/ARCHITECTURE.md` 和 `harness/DECISIONS.md`。

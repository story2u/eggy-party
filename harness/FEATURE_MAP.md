# Feature Map

## 已有功能

| 功能 | 位置 | 说明 |
| --- | --- | --- |
| 菜单页 | `game.py::_draw_menu` | 标题、开始提示、操作说明 |
| 游戏状态机 | `game.py::Game` | `MENU`, `PLAYING`, `FINISHED` |
| 玩家移动 | `game.py::_update_playing`, `player.py::Player` | 键盘输入转成水平速度和跳跃 |
| 二段跳 | `player.py::Player.jump` | `MAX_JUMPS = 2` |
| 简单重力和平台碰撞 | `player.py::Player.update` | 使用矩形平台碰撞 |
| AI 对手 | `player.py::AIPlayer` | 朝终点移动，简单避障和跳坑 |
| 摄像机跟随 | `game.py::_update_camera` | 跟随人类玩家横向移动 |
| 排名记录 | `game.py::finished_order` | 到达终点后按完成顺序记录 |
| HUD | `game.py::_draw_hud` | 关卡名、计时、排名、存活数 |
| 旋转锤 | `obstacles.py::SpinningHammer` | 圆形锤头绕 pivot 旋转 |
| 尖刺 | `obstacles.py::Spike` | 静态危险区域 |
| 移动平台 | `obstacles.py::MovingPlatform` | 正弦往返移动 |
| 一二三木头人 | `obstacles.py::DollGuardian`, `game.py::_update_freeze` | 红灯移动会淘汰 |
| 中文字体回退 | `font_utils.py` | 优先加载系统中文字体 |
| 单元测试回归网 | `tests/` | 用 unittest 记录功能意图并保护核心行为 |

## 当前关卡

| 关卡 | 文件对象 | 主题 | 主要机制 |
| --- | --- | --- | --- |
| 第一关 | `LEVEL_1` | 新手草原 | 基础平台、旋转锤、尖刺 |
| 第二关 | `LEVEL_2` | 齿轮工厂 | 更多锤子、尖刺、移动平台 |
| 第三关 | `LEVEL_3` | 最终乱斗 | 缺口、更密集障碍、移动平台 |
| 第四关 | `LEVEL_4` | 一二三木头人 | 木头人红绿灯规则 |

## 重要扩展点

- 新障碍：继承 `Obstacle`，实现 `update`、`draw`、`get_hitbox`。
- 新关卡：在 `level.py` 定义 `Level` 实例并加入 `ALL_LEVELS`。
- 新 HUD：优先放在 `Game._draw_hud()`。
- 新玩家能力：优先改 `Player`，只在 `Game` 中处理输入映射。
- 新 AI 行为：优先改 `AIPlayer._avoid_obstacles()` 或新增 AI helper 方法。
- 新字体/文本策略：统一通过 `font_utils.py`。

## 已知缺口

- 障碍物 hitbox 已定义，但常规关卡中玩家与障碍的伤害碰撞逻辑还未完整接入。
- `AIPlayer.draw_name()` 存在但当前主渲染没有调用。
- 没有资源加载、音效、存档、设置页。
- `README.md` 项目结构和关卡数量可能落后于当前代码，需要后续同步。

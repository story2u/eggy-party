# Architecture

## 运行入口

- `run.sh`：进入项目目录并执行 `python3 main.py`。
- `main.py`：初始化 Pygame，创建 `Game`，进入主循环。
- `game.py`：项目核心，管理状态机、事件、更新、渲染、关卡切换。

## 核心模块

| 文件 | 职责 |
| --- | --- |
| `main.py` | 程序入口，生命周期外壳 |
| `game.py` | 主循环、状态机、关卡加载、玩家列表、摄像机、HUD、渲染编排 |
| `player.py` | `Player` 物理、输入结果应用、角色绘制；`AIPlayer` 简单自动驾驶 |
| `level.py` | 关卡静态数据：平台、障碍、出生点、终点 |
| `obstacles.py` | 障碍物基类和具体障碍：旋转锤、尖刺、移动平台、木头人娃娃 |
| `font_utils.py` | 中文字体加载和回退，避免 Pygame 默认字体导致中文乱码 |
| `tests/` | 单元测试和回归测试，测试 docstring 记录功能意图 |
| `assets/` | 预留素材目录 |

## 主循环

`Game.run()` 每帧执行：

1. `clock.tick(FPS)` 计算 `dt`。
2. `_handle_events()` 处理退出、重开、开始等键盘事件。
3. 按 `state` 调用 update/draw：
   - `MENU`：静态菜单。
   - `PLAYING`：更新玩家、AI、障碍、木头人规则、摄像机，再渲染。
   - `FINISHED`：通关画面。
4. `pygame.display.flip()` 交换画面。

## 状态机

| 状态 | 进入方式 | 主要行为 |
| --- | --- | --- |
| `MENU` | 游戏启动；通关页按 Enter 返回 | 显示标题、操作说明 |
| `PLAYING` | 菜单按 Enter/Space；按 R 重开 | 更新当前关卡和游戏对象 |
| `FINISHED` | 关卡索引超过 `ALL_LEVELS` | 显示全部通关页 |

## 关卡数据流

`level.py` 定义 `Level` 对象和 `ALL_LEVELS`。

`Game.load_level(idx)` 读取关卡数据：

- 设置 `self.level`。
- 创建人类玩家。
- 根据 `level.ai_spawns` 创建 AI。
- 重置计时、排名、摄像机、木头人状态。

新增关卡时优先在 `level.py` 中新增 `LEVEL_N`，再追加到 `ALL_LEVELS`。

## 物理和碰撞

- `Player.update(dt, platforms)` 负责重力、位置积分、平台碰撞、掉落死亡。
- 平台是 `(x, y, w, h)` 元组。
- 障碍提供 `get_hitbox()`，但当前玩家受伤/障碍碰撞逻辑还不完整，这是后续扩展点。
- 终点检测在 `Game._check_finish()` 中，用玩家和终点坐标距离判断。

## 渲染分层

`Game._draw_playing()` 渲染顺序：

1. 背景色。
2. 终点线。
3. 平台。
4. 障碍物。
5. 木头人 GO/STOP 提示。
6. 玩家。
7. HUD。

各对象自己的外观尽量留在各自模块内：

- 玩家外观在 `player.py`。
- 障碍外观在 `obstacles.py`。
- 全局 UI 和关卡地形在 `game.py`。

## 字体策略

所有需要渲染中文的新增代码应使用 `font_utils.get_font(size)`，不要直接写 `pygame.freetype.SysFont("notosanscjk", size)`。

原因：Pygame 在找不到指定字体时会退回 `FreeSans`，导致中文显示为方块或乱码。

# Verification

## TDD 基线

本项目的验证基线是单元测试优先。新增功能或修 bug 时，先写一个能表达意图的测试，再修改实现。

运行全部单元测试：

```bash
python3 -m unittest discover -s tests -v
```

测试方法必须用 docstring 说明设计意图。回归失败时，DeepSeek 应先阅读对应测试的 docstring，再判断是实现错了、测试过期了，还是需求改变了。

## 快速验证

每次代码修改后至少运行：

```bash
python3 -m unittest discover -s tests -v
python3 -m py_compile main.py game.py player.py level.py obstacles.py font_utils.py
```

## 渲染 smoke test

没有图形环境或只想确认核心画面不崩溃时，运行：

```bash
SDL_VIDEODRIVER=dummy python3 - <<'PY'
import pygame
from game import Game

pygame.init()
game = Game()
game._draw_menu()
game.load_level(0)
game._draw_playing()
game.human_player.alive = False
game.human_player.draw(game.screen, game.camera_x)
game.state = "FINISHED"
game._draw_finished()
pygame.quit()
print("render smoke test passed")
PY
```

## 手动验证

本地运行：

```bash
./run.sh
```

手动检查：

- 菜单中文显示正常。
- Enter 或 Space 能开始游戏。
- A/D 或左右键能移动。
- W/上键/空格能跳跃。
- R 能重开当前关卡。
- ESC 能退出。
- 第一关能看到平台、终点、玩家和 AI。
- 第四关木头人红灯移动会淘汰。

## 字体验证

改字体或中文文案时运行：

```bash
python3 - <<'PY'
from font_utils import get_font
font = get_font(24)
print("font:", getattr(font, "path", None), getattr(font, "name", None))
print("metrics:", font.get_metrics("中文"))
PY
```

如果 `metrics` 返回有效元组，说明中文字符能被当前字体处理。

## 当前测试缺口

- 没有截图级 UI 回归。
- 没有性能测试。
- 常规障碍伤害碰撞尚未实现，因此目前没有对应行为测试。

在增加复杂玩法前，先补对应 unittest 用例。后续如引入 pytest，需要同步更新本文件和 `tests/README.md`。

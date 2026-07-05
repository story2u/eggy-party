"""
level.py — 关卡定义
蛋仔派对 Demo 的 3 个关卡
"""
from obstacles import SpinningHammer, Spike, MovingPlatform, DollGuardian


class Level:
    """关卡基类"""
    def __init__(self, name, bg_color, platforms, obstacles, spawn_x, spawn_y,
                 finish_x, finish_y, ai_spawns=None):
        self.name = name
        self.bg_color = bg_color
        self.platforms = platforms        # [(x, y, w, h), ...]
        self.obstacles = obstacles        # 障碍物列表
        self.spawn_x = spawn_x
        self.spawn_y = spawn_y
        self.finish_x = finish_x
        self.finish_y = finish_y
        self.ai_spawns = ai_spawns or []  # AI 出生点 [(x, y), ...]


# ═══════════════════════════════════════════
#  关卡 1：新手草原 🌿
# ═══════════════════════════════════════════
LEVEL_1 = Level(
    name="第一关：新手草原",
    bg_color=(135, 206, 235),

    # 平台: (x, y, 宽, 高)
    platforms=[
        # 地面
        (0, 500, 300, 100),
        (400, 500, 200, 100),
        (700, 500, 250, 100),
        (1050, 500, 800, 100),

        # 跳跃平台
        (250, 420, 100, 16),
        (550, 380, 100, 16),
        (800, 420, 120, 16),
        (1000, 360, 100, 16),
        (1200, 420, 100, 16),
        (1400, 370, 100, 16),
    ],

    # 障碍物
    obstacles=[
        SpinningHammer(350, 490, speed=2.0),
        SpinningHammer(600, 450, speed=-2.5),
        Spike(500, 484, width=48),
        Spike(950, 484, width=48),
    ],

    spawn_x=80, spawn_y=440,
    finish_x=1550, finish_y=440,
    ai_spawns=[(60, 440), (50, 440)],
)


# ═══════════════════════════════════════════
#  关卡 2：齿轮工厂 ⚙️
# ═══════════════════════════════════════════
LEVEL_2 = Level(
    name="第二关：齿轮工厂",
    bg_color=(50, 50, 70),

    platforms=[
        # 地面
        (0, 520, 250, 80),
        (400, 520, 150, 80),
        (700, 520, 150, 80),
        (1000, 520, 200, 80),
        (1350, 520, 700, 80),

        # 跳跃平台
        (200, 440, 100, 16),
        (300, 360, 80, 16),
        (500, 440, 100, 16),
        (600, 360, 80, 16),
        (800, 440, 100, 16),
        (900, 360, 100, 16),
        (1100, 440, 100, 16),
        (1200, 380, 100, 16),
        (1400, 440, 100, 16),

        # 移动平台
    ],

    obstacles=[
        SpinningHammer(480, 500, speed=3.0),
        SpinningHammer(780, 500, speed=-3.0),
        SpinningHammer(1100, 500, speed=3.5, arm_length=60),
        Spike(350, 504, width=64),
        Spike(650, 504, width=64),
        Spike(950, 504, width=64),
        MovingPlatform(1400, 400, dx=1, dy=0, move_range=80),
    ],

    spawn_x=80, spawn_y=460,
    finish_x=1750, finish_y=460,
    ai_spawns=[(60, 460), (50, 460)],
)


# ═══════════════════════════════════════════
#  关卡 3：最终乱斗 🔥
# ═══════════════════════════════════════════
LEVEL_3 = Level(
    name="第三关：最终乱斗",
    bg_color=(30, 10, 10),

    platforms=[
        # 地面（故意留缺口）
        (0, 540, 180, 60),
        (280, 540, 150, 60),
        (530, 540, 150, 60),
        (780, 540, 150, 60),
        (1030, 540, 200, 60),
        (1350, 540, 800, 60),

        # 跳跃平台
        (100, 460, 80, 16),
        (180, 390, 80, 16),
        (350, 460, 80, 16),
        (450, 380, 80, 16),
        (600, 460, 100, 16),
        (700, 380, 80, 16),
        (850, 460, 100, 16),
        (950, 370, 80, 16),
        (1100, 460, 100, 16),
        (1200, 390, 100, 16),
        (1400, 460, 100, 16),
    ],

    obstacles=[
        SpinningHammer(420, 520, speed=4.0),
        SpinningHammer(680, 520, speed=-4.0),
        SpinningHammer(920, 520, speed=4.5, arm_length=80),
        SpinningHammer(1200, 520, speed=-3.5),
        Spike(230, 524, width=64),
        Spike(480, 524, width=64),
        Spike(730, 524, width=64),
        Spike(980, 524, width=48),
        MovingPlatform(1350, 420, dx=1, dy=0, move_range=100),
        MovingPlatform(1550, 360, dx=0, dy=1, move_range=60),
    ],

    spawn_x=80, spawn_y=480,
    finish_x=1800, finish_y=480,
    ai_spawns=[(60, 480), (50, 480)],
)


# ═══════════════════════════════════════════
#  关卡 4：一二三木头人 🧟
# ═══════════════════════════════════════════
LEVEL_4 = Level(
    name="第四关：一二三木头人",
    bg_color=(200, 180, 160),

    platforms=[
        (0, 560, 280, 40),
        (280, 560, 300, 40),
        (580, 560, 300, 40),
        (880, 560, 300, 40),
        (1180, 560, 300, 40),
        (1480, 560, 320, 40),
        (1800, 560, 400, 40),

        (150, 480, 80, 16),
        (350, 430, 80, 16),
        (500, 480, 80, 16),
        (700, 430, 80, 16),
        (850, 480, 100, 16),
        (1050, 420, 80, 16),
        (1200, 480, 100, 16),
        (1400, 430, 100, 16),
        (1600, 480, 80, 16),
    ],

    obstacles=[
        DollGuardian(1800, 450),
    ],

    spawn_x=100, spawn_y=500,
    finish_x=2000, finish_y=500,
    ai_spawns=[(80, 500), (70, 500), (60, 500)],
)


# 所有关卡列表
ALL_LEVELS = [LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4]

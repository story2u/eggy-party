"""
obstacles.py — 障碍物

蛋仔派对 demo 的各种障碍物：
- 旋转锤子（绕一个点旋转）
- 尖刺（静止的危险区域）
- 移动平台
"""

import pygame
import random
import math


class Obstacle:
    """障碍物基类"""
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def update(self, dt):
        pass  # 子类实现

    def draw(self, screen, camera_x):
        pass  # 子类实现

    def get_hitbox(self):
        """返回碰撞矩形 (x, y, w, h)"""
        return (0, 0, 0, 0)


# ─────────────────────────────────────────────
#  旋转锤子
# ─────────────────────────────────────────────
class SpinningHammer(Obstacle):
    """
    绕 pivot 点旋转的锤子
       pivot
         │
         │  (arm_length)
         │
        ⚫  ← hammer_head (圆形)
    """

    ARM_LENGTH = 70
    HEAD_RADIUS = 16
    SPEED = 2.5  # 弧度/秒

    def __init__(self, pivot_x, pivot_y, speed=None, arm_length=None):
        super().__init__(pivot_x, pivot_y)  # x,y 是旋转中心
        self.pivot_x = pivot_x
        self.pivot_y = pivot_y
        self.angle = random.uniform(0, math.pi * 2)
        self.speed = speed or self.SPEED
        self.arm_length = arm_length or self.ARM_LENGTH

    def update(self, dt):
        self.angle += self.speed * dt

    def get_head_pos(self):
        """锤头当前位置"""
        hx = self.pivot_x + math.cos(self.angle) * self.arm_length
        hy = self.pivot_y + math.sin(self.angle) * self.arm_length
        return hx, hy

    def get_hitbox(self):
        """返回锤头碰撞圆 (center_x, center_y, radius)"""
        hx, hy = self.get_head_pos()
        return (hx, hy, self.HEAD_RADIUS)

    def draw(self, screen, camera_x):
        # 旋转臂
        hx, hy = self.get_head_pos()
        px = self.pivot_x - camera_x
        hx_s = hx - camera_x

        # 画臂
        arm_color = (120, 80, 40)
        pygame.draw.line(screen, arm_color,
                         (px, self.pivot_y),
                         (hx_s, hy), 6)

        # 画旋转中心
        pygame.draw.circle(screen, (100, 60, 30),
                           (px, self.pivot_y), 8)

        # 画锤头
        hammer_color = (180, 180, 180)
        pygame.draw.circle(screen, hammer_color,
                           (int(hx_s), int(hy)),
                           self.HEAD_RADIUS)
        # 锤头边框
        pygame.draw.circle(screen, (60, 60, 60),
                           (int(hx_s), int(hy)),
                           self.HEAD_RADIUS, 2)

        # 危险区域光环
        danger_color = (255, 80, 80, 100)
        s = pygame.Surface((self.HEAD_RADIUS * 3, self.HEAD_RADIUS * 3),
                           pygame.SRCALPHA)
        pygame.draw.circle(s, danger_color,
                           (self.HEAD_RADIUS * 1.5, self.HEAD_RADIUS * 1.5),
                           self.HEAD_RADIUS * 1.5)
        screen.blit(s, (hx_s - self.HEAD_RADIUS * 1.5,
                        hy - self.HEAD_RADIUS * 1.5))


# ─────────────────────────────────────────────
#  尖刺
# ─────────────────────────────────────────────
class Spike(Obstacle):
    """地面尖刺，碰到就受伤"""

    WIDTH = 32
    HEIGHT = 20

    def __init__(self, x, y, width=None):
        super().__init__(x, y)
        self.w = width or self.WIDTH

    def get_hitbox(self):
        return (self.x, self.y, self.w, self.HEIGHT)

    def draw(self, screen, camera_x):
        sx = self.x - camera_x
        spike_count = max(1, self.w // 16)

        for i in range(spike_count):
            tx = sx + i * 16
            # 三角形尖刺
            points = [
                (tx + 8, self.y + self.HEIGHT),   # 底部中点
                (tx, self.y),                       # 左下 → 顶部尖
                (tx + 16, self.y),                  # 右下
            ]
            pygame.draw.polygon(screen, (200, 30, 30), points)
            pygame.draw.polygon(screen, (255, 60, 60), points, 1)


# ─────────────────────────────────────────────
#  移动平台
# ─────────────────────────────────────────────
class MovingPlatform(Obstacle):
    """水平或垂直移动的平台"""

    WIDTH = 100
    HEIGHT = 16

    def __init__(self, x, y, dx=0, dy=0, move_range=120):
        super().__init__(x, y)
        self.start_x = x
        self.start_y = y
        self.dx = dx
        self.dy = dy
        self.move_range = move_range
        self.moved = 0.0

    def update(self, dt):
        self.moved += dt
        offset = math.sin(self.moved * 2.0) * self.move_range

        self.x = self.start_x + (self.dx * offset if self.dx else 0)
        self.y = self.start_y + (self.dy * offset if self.dy else 0)

    def get_hitbox(self):
        return (self.x, self.y, self.WIDTH, self.HEIGHT)

    def draw(self, screen, camera_x):
        sx = self.x - camera_x
        # 平台主体
        pygame.draw.rect(screen, (100, 180, 255),
                         (sx, self.y, self.WIDTH, self.HEIGHT),
                         border_radius=4)
        # 发光边框
        pygame.draw.rect(screen, (150, 210, 255),
                         (sx, self.y, self.WIDTH, self.HEIGHT), 2,
                         border_radius=4)


# ─────────────────────────────────────────────
#  一二三木头人 · 巨型娃娃
# ─────────────────────────────────────────────
class DollGuardian(Obstacle):
    """
    一二三木头人的巨型机器娃娃
    - green_light: 可以移动（娃娃背对）
    - red_light: 必须停止（娃娃转头）
    """

    GREEN_TIME = 2.5   # 绿灯秒数
    RED_TIME = 1.8     # 红灯秒数

    def __init__(self, x, y, green_time=None, red_time=None):
        super().__init__(x, y)
        self.state = "green"
        self.timer = 0
        self.green_time = green_time or self.GREEN_TIME
        self.red_time = red_time or self.RED_TIME
        self.cycle_time = self.green_time

    def update(self, dt):
        self.timer += dt
        if self.timer >= self.cycle_time:
            self.timer = 0
            if self.state == "green":
                self.state = "red"
                self.cycle_time = self.red_time
            else:
                self.state = "green"
                self.cycle_time = self.green_time

    def draw(self, screen, camera_x):
        sx = self.x - camera_x if camera_x else self.x
        sy = self.y

        # 身体（大圆柱）
        body_rect = pygame.Rect(sx - 35, sy - 60, 70, 100)
        pygame.draw.ellipse(screen, (200, 180, 160), body_rect)
        pygame.draw.ellipse(screen, (150, 130, 110), body_rect, 2)

        # 头
        head_y = sy - 100
        head_color = (255, 220, 200) if self.state == "green" else (255, 200, 190)

        if self.state == "green":
            # 背对 → 后脑勺
            pygame.draw.circle(screen, head_color, (sx, head_y), 38)
            # 头发（一撮）
            pts = [(sx - 15, head_y - 40), (sx, head_y - 50),
                   (sx + 15, head_y - 40)]
            pygame.draw.polygon(screen, (80, 40, 20), pts)
            # 后脑勺的头发线
            pygame.draw.arc(screen, (120, 80, 50),
                            (sx - 30, head_y - 35, 60, 25),
                            0, math.pi, 3)
        else:
            # 面对 → 恐怖娃娃脸
            pygame.draw.circle(screen, head_color, (sx, head_y), 38)
            # 红色边框光晕
            pygame.draw.circle(screen, (255, 0, 0, 80), (sx, head_y), 42, 3)

            # 左眼
            pygame.draw.circle(screen, (255, 255, 255), (sx - 14, head_y - 6), 10)
            # 右眼
            pygame.draw.circle(screen, (255, 255, 255), (sx + 14, head_y - 6), 10)
            # 红色瞳孔
            pygame.draw.circle(screen, (200, 0, 0), (sx - 14, head_y - 6), 5)
            pygame.draw.circle(screen, (200, 0, 0), (sx + 14, head_y - 6), 5)
            # 瞳孔高光
            pygame.draw.circle(screen, (255, 50, 50), (sx - 12, head_y - 8), 2)
            pygame.draw.circle(screen, (255, 50, 50), (sx + 12, head_y - 8), 2)
            # 嘴巴
            pygame.draw.arc(screen, (100, 0, 0),
                            (sx - 15, head_y + 8, 30, 20),
                            0, math.pi, 3)
            # 嘴里的牙齿
            for tx in [sx - 10, sx - 3, sx + 4, sx + 11]:
                pygame.draw.rect(screen, (255, 255, 255),
                                 (tx, head_y + 12, 4, 6))

        # 身体上的指示灯
        indicator_y = sy - 35
        indicator_color = (0, 230, 0) if self.state == "green" else (230, 0, 0)
        pygame.draw.circle(screen, indicator_color, (sx, indicator_y), 10)
        pygame.draw.circle(screen, (200, 200, 200), (sx, indicator_y), 10, 2)

        # 裙子底座
        skirt_rect = pygame.Rect(sx - 45, sy + 30, 90, 30)
        pygame.draw.ellipse(screen, (180, 160, 140), skirt_rect)
        pygame.draw.ellipse(screen, (120, 100, 80), skirt_rect, 2)

    def get_hitbox(self):
        return (self.x - 35, self.y - 60, 70, 100)

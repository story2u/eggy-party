"""
player.py — 玩家和 AI 角色

蛋仔派对的核心：可爱的蛋仔角色！
"""

import pygame
import pygame.freetype
import random
import math


class Player:
    """玩家控制的蛋仔"""

    WIDTH = 32
    HEIGHT = 36
    SPEED = 200          # 每秒移动像素
    JUMP_SPEED = -380    # 跳跃初速度（负=向上）
    MAX_JUMPS = 2        # 支持二段跳
    GRAVITY = 800        # 重力加速度

    def __init__(self, x, y, color=(255, 180, 50), name="蛋仔"):
        self.x = x
        self.y = y
        self.vx = 0       # 水平速度
        self.vy = 0       # 垂直速度
        self.color = color
        self.name = name
        self.width = self.WIDTH
        self.height = self.HEIGHT
        self.on_ground = False
        self.jumps_left = self.MAX_JUMPS
        self.alive = True
        self.finished = False
        self.finish_time = 0.0
        self.health = 100
        self.invincible_timer = 0  # 无敌时间（受伤后短暂无敌）
        self.score = 0

    def move(self, direction, dt):
        """左右移动"""
        self.vx = direction * self.SPEED

    def jump(self):
        """跳跃（支持二段跳）"""
        if self.jumps_left > 0:
            self.vy = self.JUMP_SPEED
            self.jumps_left -= 1
            self.on_ground = False

    def update(self, dt, platforms):
        """每帧更新位置和物理"""
        # 无敌倒计时
        if self.invincible_timer > 0:
            self.invincible_timer -= dt

        # 重力
        self.vy += self.GRAVITY * dt

        # 更新位置
        self.x += self.vx * dt
        self.y += self.vy * dt

        # 水平碰撞检测
        rect = self.get_rect()
        for p_data in platforms:
            plat_rect = pygame.Rect(*p_data[:4])
            if rect.colliderect(plat_rect):
                if self.vx > 0:
                    self.x = plat_rect.left - self.width
                elif self.vx < 0:
                    self.x = plat_rect.right
                self.vx = 0

        # 垂直碰撞检测
        self.on_ground = False
        rect = self.get_rect()
        for p_data in platforms:
            plat_rect = pygame.Rect(*p_data[:4])
            if rect.colliderect(plat_rect):
                if self.vy >= 0:
                    self.y = plat_rect.top - self.height
                    self.vy = 0
                    self.on_ground = True
                    self.jumps_left = self.MAX_JUMPS
                elif self.vy < 0:
                    self.y = plat_rect.bottom
                    self.vy = 0

        # 掉落死亡
        if self.y > 800:
            self.alive = False

    def get_rect(self):
        """获取碰撞矩形"""
        return pygame.Rect(self.x, self.y, self.width, self.height)

    def draw(self, screen, camera_x):
        """画蛋仔"""
        screen_x = self.x - camera_x
        screen_y = self.y

        # 无敌闪烁效果
        if self.invincible_timer > 0 and int(self.invincible_timer * 10) % 2 == 0:
            return

        # 身体（椭圆，蛋形）
        body_rect = pygame.Rect(
            screen_x + 2, screen_y + 4, self.width - 4, self.height - 4
        )
        pygame.draw.ellipse(screen, self.color, body_rect)
        # 边框
        pygame.draw.ellipse(screen, (180, 120, 30), body_rect, 2)

        # 眼睛（两个小白圆）
        eye_y = screen_y + 12
        pygame.draw.circle(screen, (255, 255, 255), (screen_x + 9, eye_y), 5)
        pygame.draw.circle(screen, (255, 255, 255), (screen_x + 23, eye_y), 5)
        # 瞳孔
        pygame.draw.circle(screen, (30, 30, 30), (screen_x + 10, eye_y + 1), 2)
        pygame.draw.circle(screen, (30, 30, 30), (screen_x + 24, eye_y + 1), 2)

        # 腮红
        pygame.draw.circle(screen, (255, 150, 150), (screen_x + 5, eye_y + 5), 3)
        pygame.draw.circle(screen, (255, 150, 150), (screen_x + 27, eye_y + 5), 3)

        # 嘴巴（小弧线）
        mouth_x = screen_x + 16
        mouth_y = screen_y + 22
        pygame.draw.arc(
            screen, (100, 60, 20),
            (mouth_x - 4, mouth_y - 2, 8, 5),
            0, math.pi, 2
        )

        # 血条（受伤时显示）
        if self.health < 100:
            bar_width = 30
            bar_height = 4
            bar_x = screen_x + 1
            bar_y = screen_y - 6
            # 背景
            pygame.draw.rect(screen, (60, 60, 60), (bar_x, bar_y, bar_width, bar_height))
            # 血量
            hp_width = int(bar_width * self.health / 100)
            hp_color = (0, 200, 0) if self.health > 50 else (200, 200, 0) if self.health > 25 else (200, 0, 0)
            pygame.draw.rect(screen, hp_color, (bar_x, bar_y, hp_width, bar_height))

        # 淘汰标记（💀）
        if not self.alive:
            font = pygame.freetype.SysFont("notosanscjk", 32)
            death = font.render("💀", (200, 0, 0)[0])
            screen.blit(death, (screen_x + 2, screen_y - 10))


class AIPlayer(Player):
    """AI 控制的蛋仔对手"""

    COLORS = [
        (255, 100, 100),  # 红色
        (100, 180, 255),  # 蓝色
        (100, 255, 120),  # 绿色
        (255, 150, 220),  # 粉色
        (200, 150, 255),  # 紫色
    ]

    def __init__(self, x, y, color=None, name="AI蛋仔", level=None,
                 speed_variation=1.0):
        if color is None:
            color = random.choice(self.COLORS)
        super().__init__(x, y, color)
        self.name = name
        self.jump_cooldown = 0
        self.move_direction = 1  # 1=右, -1=左
        self.stuck_timer = 0
        self.last_x = x
        self.SPEED = int(self.SPEED * speed_variation)
        self.finish_x = (level.finish_x if level else 1000)

    def ai_update(self, dt, platforms, obstacles, finish_x):
        """AI 决策：朝终点移动，避障，跳跃"""
        if not self.alive or self.finished:
            return

        # 跳跃冷却
        if self.jump_cooldown > 0:
            self.jump_cooldown -= dt

        # 基本方向：朝终点走
        if self.x < finish_x:
            self.move_direction = 1
        else:
            self.move_direction = -1

        # 检测前方障碍物，决定是否跳跃
        self._avoid_obstacles(dt, platforms, obstacles)

        # 检测卡住（同一位置停留太久）
        if abs(self.x - self.last_x) < 5:
            self.stuck_timer += dt
            if self.stuck_timer > 0.5:
                self.jump()  # 卡住了就跳
        else:
            self.stuck_timer = 0
        self.last_x = self.x

        # 移动
        self.move(self.move_direction, dt)

        # 物理更新
        self.update(dt, platforms)

    def _avoid_obstacles(self, dt, platforms, obstacles):
        """检测前方危险并躲避"""
        look_ahead = 60  # 向前看的距离

        for obs in obstacles:
            ox, oy = obs.x, obs.y
            # 用 get_hitbox 获取障碍物大小
            hb = obs.get_hitbox()
            if len(hb) == 3:
                ow, oh = hb[2] * 2, hb[2] * 2  # 是圆（中心+半径），取直径
            else:
                ow, oh = hb[2], hb[3]

            # 前方有障碍物
            if (abs(self.y - oy) < 80 and
                abs(self.x + self.move_direction * look_ahead - ox) < 80):
                if self.jump_cooldown <= 0 and self.on_ground:
                    self.jump()
                    self.jump_cooldown = 0.3
                    break

        # 前方有坑就跳
        if self.on_ground:
            front_x = self.x + self.move_direction * 40
            front_y = self.y + self.height + 10
            has_ground = False
            for plat in platforms:
                px2, py2, pw2, ph2 = plat
                if pygame.Rect(px2, py2, pw2, ph2).collidepoint(front_x, front_y):
                    has_ground = True
                    break
            if not has_ground and self.jump_cooldown <= 0:
                self.jump()
                self.jump_cooldown = 0.3

    def draw_name(self, screen, camera_x):
        """画 AI 名字"""
        if self.invincible_timer > 0:
            return
        font = pygame.freetype.SysFont("notosanscjk", 18)
        text = font.render(self.name[:4], (255, 255, 255)[0])
        screen.blit(
            text,
            (self.x - camera_x + self.width // 2 - text.get_width() // 2,
             self.y - 16)
        )
[0]
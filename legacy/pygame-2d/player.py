"""
player.py — 玩家和 AI 角色

蛋仔派对的核心：可爱的蛋仔角色！
"""

import pygame
import pygame.freetype
import random
import math
from font_utils import get_font


class Player:
    """蛋仔角色 — 会滚、会弹、有惯性"""

    WIDTH = 32
    HEIGHT = 36
    RADIUS = 16        
    MAX_SPEED = 280    
    ACCEL = 1200       
    FRICTION = 500     
    JUMP_SPEED = -380  
    MAX_JUMPS = 2      
    GRAVITY = 800      

    def __init__(self, x, y, color=(255, 180, 50), name="蛋仔"):
        self.x = x
        self.y = y
        self.vx = 0
        self.vy = 0
        self.color = color
        self.name = name
        self.input_direction = 0
        self.rotation = 0.0
        self.width = self.WIDTH
        self.height = self.HEIGHT
        self.on_ground = False
        self.jumps_left = self.MAX_JUMPS
        self.alive = True
        self.finished = False
        self.finish_time = 0.0
        self.health = 100
        self.invincible_timer = 0
        self.score = 0

    def move(self, direction, dt):
        """加速度移动 - 蛋仔有惯性，不会瞬间起停"""
        self.input_direction = direction
        self.vx += direction * self.ACCEL * dt
        self.vx = max(-self.MAX_SPEED, min(self.MAX_SPEED, self.vx))
        # 滚动角度：转动距离 / 半径
        self.rotation += self.vx * dt / self.RADIUS

    def jump(self):
        """跳跃（支持二段跳）"""
        if self.jumps_left > 0:
            self.vy = self.JUMP_SPEED
            self.jumps_left -= 1
            self.on_ground = False

    def update(self, dt, platforms):
        """每帧物理：重力 + 摩擦 + 碰撞"""
        if self.invincible_timer > 0:
            self.invincible_timer -= dt

        self.vy += self.GRAVITY * dt

        # ── 地面摩擦：蛋仔滚着滚着会慢下来 ──
        if self.on_ground and self.input_direction == 0:
            fric = -self.FRICTION if self.vx > 0 else self.FRICTION if self.vx < 0 else 0
            self.vx += fric * dt
            if abs(self.vx) < 8:
                self.vx = 0
            self.rotation += self.vx * dt / self.RADIUS

        # 水平 + 碰撞
        self.x += self.vx * dt
        rect = self.get_rect()
        for p_data in platforms:
            plat_rect = pygame.Rect(*p_data[:4])
            if rect.colliderect(plat_rect):
                if self.vx > 0:
                    self.x = plat_rect.left - self.width
                elif self.vx < 0:
                    self.x = plat_rect.right
                self.vx = 0

        # 垂直 + 碰撞
        self.y += self.vy * dt
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

        if self.y > 800:
            self.alive = False

    def get_rect(self):
        """获取碰撞矩形"""
        return pygame.Rect(self.x, self.y, self.width, self.height)

    def resolve_player_collision(self, other):
        """蛋仔互相碰撞 —— 弹开！这是蛋仔派对的核心乐趣"""
        if not self.alive or not other.alive:
            return
        rect1 = self.get_rect()
        rect2 = other.get_rect()
        if not rect1.colliderect(rect2):
            return

        cx1 = self.x + self.width / 2
        cy1 = self.y + self.height / 2
        cx2 = other.x + other.width / 2
        cy2 = other.y + other.height / 2

        dx = cx1 - cx2
        dy = cy1 - cy2
        if dx == 0 and dy == 0:
            dx = 1

        dist = (dx*dx + dy*dy) ** 0.5
        nx = dx / dist
        ny = dy / dist

        # 推开重叠
        overlap = (self.width + other.width) / 2 - dist
        if overlap > 0:
            self.x += nx * overlap * 0.55
            self.y += ny * overlap * 0.55
            other.x -= nx * overlap * 0.55
            other.y -= ny * overlap * 0.55

        # 速度交换（弹力）
        push = 150
        self.vx += nx * push
        self.vy += ny * push * 0.5
        other.vx -= nx * push
        other.vy -= ny * push * 0.5

    def draw(self, screen, camera_x):
        """画会滚的蛋仔"""
        sx = self.x - camera_x
        sy = self.y

        if self.invincible_timer > 0 and int(self.invincible_timer * 10) % 2 == 0:
            return

        # ── 滚动旋转效果：把蛋仔画到临时 surface 上再旋转 ──
        pad = 6
        surf = pygame.Surface((self.width + pad * 2, self.height + pad * 2),
                              pygame.SRCALPHA)
        cx = surf.get_width() // 2
        cy = surf.get_height() // 2

        # 身体
        body_rect = pygame.Rect(cx - self.width//2 + 2, cy - self.height//2 + 4,
                                self.width - 4, self.height - 4)
        pygame.draw.ellipse(surf, self.color, body_rect)
        pygame.draw.ellipse(surf, (180, 120, 30), body_rect, 2)

        # 眼睛
        eye_y = cy - 6
        pygame.draw.circle(surf, (255, 255, 255), (cx - 7, eye_y), 5)
        pygame.draw.circle(surf, (255, 255, 255), (cx + 7, eye_y), 5)
        pygame.draw.circle(surf, (30, 30, 30), (cx - 6, eye_y + 1), 2)
        pygame.draw.circle(surf, (30, 30, 30), (cx + 8, eye_y + 1), 2)

        # 腮红
        pygame.draw.circle(surf, (255, 150, 150), (cx - 11, eye_y + 5), 3)
        pygame.draw.circle(surf, (255, 150, 150), (cx + 11, eye_y + 5), 3)

        # 嘴巴
        mouth_y = cy + 4
        pygame.draw.arc(surf, (100, 60, 20),
                        (cx - 4, mouth_y - 2, 8, 5), 0, math.pi, 2)

        # 旋转
        degrees = math.degrees(self.rotation) % 360
        rotated = pygame.transform.rotate(surf, -degrees)
        rx = int(sx - pad - (rotated.get_width() - (self.width + pad * 2)) / 2)
        ry = int(sy - pad - (rotated.get_height() - (self.height + pad * 2)) / 2)
        screen.blit(rotated, (rx, ry))

        # 血条（不旋转，直接画在屏幕上）
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
            font = get_font(32)
            death = font.render("淘汰", (200, 0, 0))[0]
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
        self.MAX_SPEED = int(self.MAX_SPEED * speed_variation)
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
        font = get_font(18)
        text = font.render(self.name[:4], (255, 255, 255))[0]
        screen.blit(
            text,
            (self.x - camera_x + self.width // 2 - text.get_width() // 2,
             self.y - 16)
        )

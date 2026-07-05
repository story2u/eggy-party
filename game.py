"""
game.py — 游戏核心
主循环、渲染、碰撞检测、排名系统
"""
import pygame
import pygame.freetype
import sys
from player import Player, AIPlayer
from level import ALL_LEVELS

# 颜色常量
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 60, 60)
GREEN = (60, 255, 60)
YELLOW = (255, 255, 0)
BLUE = (60, 120, 255)
GRAY = (100, 100, 100)
ORANGE = (255, 150, 50)
PINK = (255, 150, 200)
PURPLE = (180, 100, 255)


class Game:
    """游戏主类"""

    SCREEN_W = 1024
    SCREEN_H = 600
    FPS = 60

    def __init__(self):
        pygame.init()
        pygame.display.set_caption("🥚 蛋仔派对 Demo")
        self.screen = pygame.display.set_mode((self.SCREEN_W, self.SCREEN_H))
        self.clock = pygame.time.Clock()
        self.font_big = pygame.freetype.SysFont("notosanscjk", 48)
        self.font_mid = pygame.freetype.SysFont("notosanscjk", 32)
        self.font_small = pygame.freetype.SysFont("notosanscjk", 22)

        self.state = "MENU"       # MENU | PLAYING | FINISHED
        self.current_level_idx = 0
        self.level = None
        self.players = []         # 所有玩家（玩家 + AI）
        self.human_player = None
        self.camera_x = 0
        self.race_time = 0
        self.finished_order = []  # 到达终点的顺序
        self.winner = None
        # 一二三木头人状态
        self.doll = None
        self.frozen_positions = {}
        self.last_doll_state = "green"

    # ──────────────────────────────────────
    #  关卡加载
    # ──────────────────────────────────────
    def load_level(self, idx):
        """加载指定关卡"""
        if idx >= len(ALL_LEVELS):
            self.state = "FINISHED"
            return

        self.level = ALL_LEVELS[idx]
        self.current_level_idx = idx
        self.finished_order = []
        self.race_time = 0
        self.winner = None

        # 创建人类玩家
        self.human_player = Player(
            self.level.spawn_x, self.level.spawn_y,
            color=PINK, name="你"
        )
        self.players = [self.human_player]

        # 创建 AI 对手
        ai_colors = [BLUE, ORANGE, (255, 255, 100), (100, 255, 200)]
        ai_names = ["蛋小蓝", "蛋小橙", "蛋小黄", "蛋小绿"]

        for i, (sx, sy) in enumerate(self.level.ai_spawns):
            ai = AIPlayer(
                sx, sy,
                color=ai_colors[i % len(ai_colors)],
                name=ai_names[i % len(ai_names)],
                level=self.level,
                speed_variation=0.8 + (i * 0.15)
            )
            self.players.append(ai)

        self.camera_x = 0
        # 重置木头人状态
        self.doll = None
        self.frozen_positions = {}
        self.last_doll_state = "green"

    # ──────────────────────────────────────
    #  主循环
    # ──────────────────────────────────────
    def run(self):
        """启动游戏"""
        while True:
            dt = self.clock.tick(self.FPS) / 1000.0  # 秒

            self._handle_events()

            if self.state == "MENU":
                self._update_menu(dt)
                self._draw_menu()
            elif self.state == "PLAYING":
                self._update_playing(dt)
                self._draw_playing()
            elif self.state == "FINISHED":
                self._update_menu(dt)
                self._draw_finished()

            pygame.display.flip()

    # ──────────────────────────────────────
    #  事件处理
    # ──────────────────────────────────────
    def _handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    pygame.quit()
                    sys.exit()

                if event.key == pygame.K_r:
                    self.state = "PLAYING"
                    self.load_level(self.current_level_idx)

                if event.key == pygame.K_RETURN or event.key == pygame.K_SPACE:
                    if self.state == "MENU":
                        self.state = "PLAYING"
                        self.load_level(0)
                    elif self.state == "FINISHED":
                        self.state = "MENU"

    # ──────────────────────────────────────
    #  菜单更新
    # ──────────────────────────────────────
    def _update_menu(self, dt):
        pass  # 菜单是静态的

    # ──────────────────────────────────────
    #  游戏更新
    # ──────────────────────────────────────
    def _update_playing(self, dt):
        self.race_time += dt

        # 获取玩家输入 → 直接控制人类玩家的速度
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            self.human_player.vx = -self.human_player.SPEED
        elif keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            self.human_player.vx = self.human_player.SPEED
        else:
            self.human_player.vx = 0

        if keys[pygame.K_UP] or keys[pygame.K_w] or keys[pygame.K_SPACE]:
            self.human_player.jump()

        # 更新所有玩家
        for p in self.players:
            if p.finished or (not p.alive and self._get_doll() is not None):
                continue

            if p == self.human_player:
                # 人类玩家：物理更新
                p.update(dt, self.level.platforms)
            else:
                # AI 玩家：AI 决策 + 物理更新
                p.ai_update(dt, self.level.platforms,
                            self.level.obstacles, self.level.finish_x)

            # 检查是否到达终点
            if self._check_finish(p):
                p.finished = True
                p.finish_time = self.race_time
                self.finished_order.append(p)

        # 更新障碍物
        for obs in self.level.obstacles:
            obs.update(dt)

        # ──────────────────────────────
        #  一二三木头人逻辑！
        # ──────────────────────────────
        self._update_freeze(dt)

        # 更新镜头
        self._update_camera()

        # 检查是否所有玩家完成或淘汰
        all_done = all(p.finished or not p.alive for p in self.players)
        if all_done:
            # 延迟一下进入下一关
            if not hasattr(self, '_finish_delay'):
                self._finish_delay = 1.5
            self._finish_delay -= dt
            if self._finish_delay <= 0:
                del self._finish_delay
                self.current_level_idx += 1
                self.load_level(self.current_level_idx)

    # ──────────────────────────────────────
    #  到达终点检测
    # ──────────────────────────────────────
    def _check_finish(self, player):
        """检查玩家是否到达终点"""
        fx, fy = self.level.finish_x, self.level.finish_y
        # 终点是一个旗杆区域
        return (abs(player.x - fx) < 30 and
                abs(player.y - fy) < 200)

    # ──────────────────────────────────────
    #  镜头跟随
    # ──────────────────────────────────────
    def _update_camera(self):
        """镜头跟随人类玩家"""
        if self.human_player:
            target_x = self.human_player.x - self.SCREEN_W // 3
            target_x = max(0, target_x)
            # 平滑跟随
            self.camera_x += (target_x - self.camera_x) * 0.1

    # ──────────────────────────────────────
    #  一二三木头人：冻结检测
    # ──────────────────────────────────────
    def _get_doll(self):
        """找到关卡中的 DollGuardian"""
        if self.doll is None:
            for obs in self.level.obstacles:
                if hasattr(obs, 'state') and hasattr(obs, 'green_time'):
                    self.doll = obs
                    break
        return self.doll

    def _update_freeze(self, dt):
        """木头人逻辑：红绿灯切换时锁定/淘汰"""
        doll = self._get_doll()
        if not doll:
            return

        if doll.state == "red" and self.last_doll_state == "green":
            # 刚转头 → 记录所有人的位置
            self.frozen_positions = {}
            for p in self.players:
                if p.alive and not p.finished:
                    self.frozen_positions[id(p)] = (p.x, p.y)

        elif doll.state == "red":
            THRESHOLD = 8  # 像素，允许微小晃动
            for p in self.players:
                if not p.alive or p.finished:
                    continue
                fx, fy = self.frozen_positions.get(id(p), (p.x, p.y))
                if abs(p.x - fx) > THRESHOLD or abs(p.y - fy) > THRESHOLD:
                    p.alive = False  # 淘汰！
                    p.vx = 0
                    p.vy = 0

        self.last_doll_state = doll.state

    # ═══════════════════════════════════
    #  渲染
    # ═══════════════════════════════════

    # ──────────────────────────────────────
    #  菜单画面
    # ──────────────────────────────────────
    def _draw_menu(self):
        self.screen.fill((20, 20, 50))

        # 标题
        title = self.font_big.render("🥚 蛋仔派对 Demo", YELLOW)[0]
        title_rect = title.get_rect(center=(self.SCREEN_W // 2, 150))
        self.screen.blit(title, title_rect)

        # 副标题
        subtitle = self.font_mid.render("2D 平台跳跃 · 竞速闯关", WHITE)[0]
        sub_rect = subtitle.get_rect(center=(self.SCREEN_W // 2, 210))
        self.screen.blit(subtitle, sub_rect)

        # 开始提示
        start_text = self.font_big.render("按 ENTER 开始游戏", GREEN)[0]
        start_rect = start_text.get_rect(center=(self.SCREEN_W // 2, 320))
        self.screen.blit(start_text, start_rect)

        # 操作说明
        controls = [
            "操作说明：",
            "← → 或 A D：移动",
            "↑ 或 W 或 空格：跳跃（可二段跳）",
            "R：重新开始  |  ESC：退出",
            "",
            "关卡：🌿草原 → ⚙️工厂 → 🔥乱斗 → 🧟木头人",
        ]
        for i, text in enumerate(controls):
            c = self.font_small.render(text, GRAY)[0]
            self.screen.blit(c, (self.SCREEN_W // 2 - 150, 380 + i * 30))

    # ──────────────────────────────────────
    #  游戏画面
    # ──────────────────────────────────────
    def _draw_playing(self):
        # 背景
        self.screen.fill(self.level.bg_color)

        # 画终点线（旗帜区域）
        self._draw_finish_line()

        # 画平台
        for plat in self.level.platforms:
            x, y, w, h = plat
            sx = x - self.camera_x
            if sx + w < -50 or sx > self.SCREEN_W + 50:
                continue

            # 平台主体
            if h > 30:  # 地面
                pygame.draw.rect(self.screen, (100, 180, 100),
                                 (sx, y, w, h))
                pygame.draw.rect(self.screen, (60, 140, 60),
                                 (sx, y, w, h), 2)
                # 草丛装饰
                for gx in range(int(sx), int(sx + w), 24):
                    pygame.draw.rect(self.screen, (80, 200, 80),
                                     (gx, y - 6, 12, 12))
            else:  # 浮空平台
                pygame.draw.rect(self.screen, (180, 140, 80),
                                 (sx, y, w, h), border_radius=4)
                pygame.draw.rect(self.screen, (140, 100, 50),
                                 (sx, y, w, h), 2, border_radius=4)

        # 画障碍物
        for obs in self.level.obstacles:
            obs.draw(self.screen, self.camera_x)

        # 木头人灯光提示（画在障碍物之后、玩家之前）
        self._draw_freeze_indicator()

        # 画玩家（按 Y 排序）
        sorted_players = sorted(self.players,
                                key=lambda p: (p.finished, p.y))
        for p in sorted_players:
            p.draw(self.screen, self.camera_x)

        # 画 UI
        self._draw_hud()

    # ──────────────────────────────────────
    #  终点线
    # ──────────────────────────────────────
    def _draw_finish_line(self):
        fx = self.level.finish_x - self.camera_x
        fy = self.level.finish_y

        # 旗杆
        pygame.draw.rect(self.screen, (180, 180, 180),
                         (fx - 3, fy - 120, 6, 120))
        # 旗帜
        flag_points = [(fx + 3, fy - 120), (fx + 3, fy - 90),
                       (fx + 35, fy - 105)]
        pygame.draw.polygon(self.screen, GREEN, flag_points)
        pygame.draw.polygon(self.screen, WHITE, flag_points, 2)

        # "终点"文字
        finish_text = self.font_small.render("🏁 终点", YELLOW)[0]
        self.screen.blit(finish_text, (fx - 20, fy - 145))

    # ──────────────────────────────────────
    #  木头人灯光画面提示
    # ──────────────────────────────────────
    def _draw_freeze_indicator(self):
        """画巨大的 GO / STOP 提示"""
        doll = self._get_doll()
        if not doll:
            return

        # 屏幕中央的大字
        if doll.state == "green":
            text = "🟢  GO!"
            color = (0, 255, 0, 180)
        else:
            text = "🔴  STOP!"
            color = (255, 0, 0, 220)

        big = pygame.freetype.SysFont("notosanscjk", 96)
        surf = big.render(text, color[:3])[0]
        surf.set_alpha(color[3])
        rect = surf.get_rect(center=(self.SCREEN_W // 2, 300))

        # 背景半透明方块
        bg = pygame.Surface((surf.get_width() + 40, surf.get_height() + 20),
                            pygame.SRCALPHA)
        bg.fill((0, 0, 0, 180))
        bg_rect = bg.get_rect(center=(self.SCREEN_W // 2, 300))
        self.screen.blit(bg, bg_rect)
        self.screen.blit(surf, rect)

    # ──────────────────────────────────────
    #  HUD（游戏信息）
    # ──────────────────────────────────────
    def _draw_hud(self):
        # 半透明背景条
        hud_bg = pygame.Surface((self.SCREEN_W, 50), pygame.SRCALPHA)
        hud_bg.fill((0, 0, 0, 150))
        self.screen.blit(hud_bg, (0, 0))

        # 关卡名
        level_text = self.font_mid.render(self.level.name, WHITE)[0]
        self.screen.blit(level_text, (15, 10))

        # 计时器
        minutes = int(self.race_time // 60)
        seconds = int(self.race_time % 60)
        ms = int((self.race_time % 1) * 100)
        time_str = f"⏱ {minutes:02d}:{seconds:02d}.{ms:02d}"
        time_text = self.font_mid.render(time_str, WHITE)[0]
        self.screen.blit(time_text, (self.SCREEN_W // 2 - 80, 10))

        # 右侧排名预览
        rank_x = self.SCREEN_W - 250
        rank_title = self.font_small.render("完成排名：", GRAY)[0]
        self.screen.blit(rank_title, (rank_x, 5))

        for i, p in enumerate(self.finished_order):
            rank_text = self.font_small.render(
                f"#{i+1} {p.name}", p.color
            )[0]
            self.screen.blit(rank_text, (rank_x, 25))

        # 剩余玩家数
        alive = sum(1 for p in self.players if p.alive and not p.finished)
        eliminated = sum(1 for p in self.players if not p.alive)
        remain_text = self.font_small.render(
            f"存活: {alive}/{len(self.players)}"
            + (f" | 淘汰: {eliminated}" if eliminated > 0 else ""),
            YELLOW
        )[0]
        self.screen.blit(remain_text, (self.SCREEN_W - 120, 5))

        # 木头人模式说明
        doll = self._get_doll()
        if doll:
            hint = self.font_small.render(
                "🟢 绿灯跑  🔴 红灯停！",
                (200, 200, 200)
            )[0]
            self.screen.blit(hint, (self.SCREEN_W // 2 - 80, 30))

    # ──────────────────────────────────────
    #  通关画面
    # ──────────────────────────────────────
    def _draw_finished(self):
        self.screen.fill((20, 20, 50))

        # 庆祝标题
        title = self.font_big.render("🎉 全部通关！ 🎉", YELLOW)[0]
        title_rect = title.get_rect(center=(self.SCREEN_W // 2, 150))
        self.screen.blit(title, title_rect)

        congrats = self.font_mid.render(
            "你成功完成了所有关卡！", WHITE
        )[0]
        cong_rect = congrats.get_rect(center=(self.SCREEN_W // 2, 220))
        self.screen.blit(congrats, cong_rect)

        restart = self.font_mid.render("按 ENTER 返回主菜单", GREEN)[0]
        rest_rect = restart.get_rect(center=(self.SCREEN_W // 2, 310))
        self.screen.blit(restart, restart)
[0]
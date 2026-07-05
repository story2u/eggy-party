import os
import unittest

os.environ.setdefault("SDL_VIDEODRIVER", "dummy")

import pygame

from game import Game
from level import ALL_LEVELS


class GameFlowTest(unittest.TestCase):
    def setUp(self):
        pygame.init()
        self.game = Game()

    def tearDown(self):
        pygame.quit()

    def test_load_level_creates_human_player_and_ai_opponents(self):
        """加载关卡应把静态关卡数据变成可运行的玩家和 AI 实例。"""
        self.game.load_level(0)

        self.assertEqual(self.game.level, ALL_LEVELS[0])
        self.assertIsNotNone(self.game.human_player)
        self.assertEqual(self.game.human_player.name, "你")
        self.assertEqual(len(self.game.players), 1 + len(ALL_LEVELS[0].ai_spawns))
        self.assertEqual(self.game.camera_x, 0)

    def test_finish_detection_accepts_player_near_finish_flag(self):
        """终点是一个旗杆区域，不要求玩家坐标完全等于终点坐标。"""
        self.game.load_level(0)
        player = self.game.human_player
        player.x = self.game.level.finish_x + 10
        player.y = self.game.level.finish_y + 100

        self.assertTrue(self.game._check_finish(player))

    def test_finish_detection_rejects_player_far_from_finish_flag(self):
        """距离终点太远的玩家不能被提前计入完成排名。"""
        self.game.load_level(0)
        player = self.game.human_player
        player.x = self.game.level.finish_x - 200
        player.y = self.game.level.finish_y

        self.assertFalse(self.game._check_finish(player))

    def test_camera_follows_human_player_without_negative_scroll(self):
        """摄像机跟随玩家，但不会滚到关卡起点左侧。"""
        self.game.load_level(0)
        self.game.human_player.x = 50
        self.game._update_camera()
        self.assertEqual(self.game.camera_x, 0)

        self.game.human_player.x = 900
        self.game._update_camera()
        self.assertGreater(self.game.camera_x, 0)

    def test_freeze_rule_eliminates_player_who_moves_during_red_light(self):
        """木头人红灯时会先记录位置，再淘汰移动超过阈值的玩家。"""
        self.game.load_level(3)
        player = self.game.human_player
        doll = self.game._get_doll()
        doll.state = "red"
        self.game.last_doll_state = "green"

        self.game._update_freeze(0.1)
        player.x += 20
        self.game._update_freeze(0.1)

        self.assertFalse(player.alive)

    def test_key_screens_render_without_runtime_errors(self):
        """菜单、游戏内和通关页应能在无显示环境下完成基础渲染。"""
        self.game._draw_menu()
        self.game.load_level(0)
        self.game._draw_playing()
        self.game.state = "FINISHED"
        self.game._draw_finished()


if __name__ == "__main__":
    unittest.main()


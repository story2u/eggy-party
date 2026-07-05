import unittest

from level import ALL_LEVELS


class LevelDataTest(unittest.TestCase):
    def test_all_levels_are_registered_in_play_order(self):
        """关卡列表就是游戏推进顺序，新增关卡必须显式注册。"""
        self.assertGreaterEqual(len(ALL_LEVELS), 4)
        self.assertEqual(ALL_LEVELS[0].name, "第一关：新手草原")
        self.assertEqual(ALL_LEVELS[-1].name, "第四关：一二三木头人")

    def test_each_level_has_required_playable_geometry(self):
        """每个关卡都必须有出生点、平台、终点和可辨识名称。"""
        for level in ALL_LEVELS:
            with self.subTest(level=level.name):
                self.assertTrue(level.name)
                self.assertGreater(len(level.platforms), 0)
                self.assertIsInstance(level.spawn_x, (int, float))
                self.assertIsInstance(level.spawn_y, (int, float))
                self.assertGreater(level.finish_x, level.spawn_x)

    def test_ai_spawn_points_are_coordinate_pairs(self):
        """AI 出生点保持简单坐标对，方便 Game.load_level 直接创建对手。"""
        for level in ALL_LEVELS:
            with self.subTest(level=level.name):
                for spawn in level.ai_spawns:
                    self.assertEqual(len(spawn), 2)
                    self.assertTrue(all(isinstance(v, (int, float)) for v in spawn))


if __name__ == "__main__":
    unittest.main()


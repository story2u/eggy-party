import unittest

from player import AIPlayer, Player


class PlayerMovementTest(unittest.TestCase):
    def test_move_sets_velocity_from_direction_and_speed(self):
        """移动输入只决定水平速度，真实位移留给每帧 update 处理。"""
        player = Player(0, 0)

        player.move(1, 0.5)

        self.assertEqual(player.vx, player.SPEED)
        self.assertEqual(player.x, 0)

    def test_player_has_exactly_two_jumps_before_landing(self):
        """蛋仔支持二段跳，第三次空中跳跃不能继续刷新上升速度。"""
        player = Player(0, 0)

        player.jump()
        first_vy = player.vy
        player.jump()
        second_vy = player.vy
        player.vy = -123
        player.jump()

        self.assertEqual(first_vy, player.JUMP_SPEED)
        self.assertEqual(second_vy, player.JUMP_SPEED)
        self.assertEqual(player.jumps_left, 0)
        self.assertEqual(player.vy, -123)

    def test_landing_on_platform_resets_jump_count(self):
        """落到平台后玩家应站在平台顶面，并重新获得二段跳次数。"""
        player = Player(10, 460)
        player.jumps_left = 0
        platforms = [(0, 500, 200, 30)]

        player.update(0.1, platforms)

        self.assertTrue(player.on_ground)
        self.assertEqual(player.y, 500 - player.height)
        self.assertEqual(player.vy, 0)
        self.assertEqual(player.jumps_left, player.MAX_JUMPS)

    def test_falling_below_world_marks_player_dead(self):
        """掉出关卡下边界代表失败，玩家应被标记为不可存活。"""
        player = Player(0, 801)

        player.update(0, [])

        self.assertFalse(player.alive)


class AIPlayerTest(unittest.TestCase):
    def test_ai_moves_toward_finish_line(self):
        """AI 的默认目标是朝终点横向推进。"""
        ai = AIPlayer(0, 464)
        platforms = [(0, 500, 1000, 30)]

        ai.ai_update(0.1, platforms, [], finish_x=500)

        self.assertEqual(ai.move_direction, 1)
        self.assertGreater(ai.x, 0)

    def test_ai_jumps_when_ground_ahead_is_missing(self):
        """AI 看到前方断崖时应尝试跳跃，而不是直接走下去。"""
        ai = AIPlayer(20, 464)
        ai.on_ground = True
        platforms = [(0, 500, 30, 30)]

        ai._avoid_obstacles(0.1, platforms, [])

        self.assertEqual(ai.jumps_left, ai.MAX_JUMPS - 1)
        self.assertEqual(ai.vy, ai.JUMP_SPEED)


if __name__ == "__main__":
    unittest.main()


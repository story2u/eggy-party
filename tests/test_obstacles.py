import math
import unittest

from obstacles import DollGuardian, MovingPlatform, Spike, SpinningHammer


class ObstacleBehaviorTest(unittest.TestCase):
    def test_spinning_hammer_head_position_uses_angle_and_arm_length(self):
        """旋转锤的危险点由 pivot、角度和臂长决定，供绘制和碰撞共用。"""
        hammer = SpinningHammer(100, 200, speed=2.0, arm_length=50)
        hammer.angle = 0

        self.assertEqual(hammer.get_head_pos(), (150, 200))
        self.assertEqual(hammer.get_hitbox(), (150, 200, hammer.HEAD_RADIUS))

    def test_spinning_hammer_update_advances_angle_by_speed_times_dt(self):
        """障碍动画必须使用 dt，保证不同帧率下速度一致。"""
        hammer = SpinningHammer(0, 0, speed=3.0)
        hammer.angle = 1.0

        hammer.update(0.5)

        self.assertAlmostEqual(hammer.angle, 2.5)

    def test_spike_hitbox_matches_configured_width(self):
        """尖刺宽度可按关卡配置，碰撞区域要跟配置一致。"""
        spike = Spike(10, 20, width=64)

        self.assertEqual(spike.get_hitbox(), (10, 20, 64, spike.HEIGHT))

    def test_moving_platform_uses_sine_motion_from_start_position(self):
        """移动平台围绕初始点往返运动，不应永久漂移。"""
        platform = MovingPlatform(100, 200, dx=1, dy=0, move_range=40)

        platform.update(math.pi / 4)

        self.assertAlmostEqual(platform.x, 140)
        self.assertEqual(platform.y, 200)
        self.assertEqual(platform.get_hitbox(), (platform.x, platform.y, 100, 16))

    def test_doll_guardian_cycles_green_to_red_and_back(self):
        """木头人娃娃按绿灯/红灯周期切换，驱动淘汰规则。"""
        doll = DollGuardian(0, 0, green_time=1.0, red_time=0.5)

        doll.update(1.0)
        self.assertEqual(doll.state, "red")
        self.assertEqual(doll.cycle_time, 0.5)

        doll.update(0.5)
        self.assertEqual(doll.state, "green")
        self.assertEqual(doll.cycle_time, 1.0)


if __name__ == "__main__":
    unittest.main()


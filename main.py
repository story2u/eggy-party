"""
main.py — 蛋仔派对 Demo 入口
运行这个文件来启动游戏！
"""
import pygame
import sys
from game import Game


def main():
    # 初始化 Pygame
    pygame.init()
    pygame.display.set_caption("蛋仔派对 Demo - Eggy Party")

    # 创建游戏实例
    game = Game()

    # 运行游戏
    game.run()

    # 退出
    pygame.quit()
    sys.exit()


if __name__ == "__main__":
    main()

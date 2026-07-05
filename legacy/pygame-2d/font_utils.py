"""Font helpers for readable Chinese text in Pygame."""

from pathlib import Path

import pygame.freetype


FONT_FILES = [
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Medium.ttc",
    "/usr/share/fonts/truetype/droid/DroidSansFallbackFull.ttf",
    "/usr/share/fonts/truetype/arphic/uming.ttc",
    "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc",
]

FONT_NAMES = [
    "Noto Sans CJK SC",
    "Noto Sans CJK",
    "WenQuanYi Zen Hei",
    "Droid Sans Fallback",
    "SimHei",
    "Microsoft YaHei",
]


def get_font(size):
    """Return a font that can render Chinese text when available."""
    if not pygame.freetype.get_init():
        pygame.freetype.init()

    for font_file in FONT_FILES:
        if Path(font_file).exists():
            return pygame.freetype.Font(font_file, size)

    for font_name in FONT_NAMES:
        font = pygame.freetype.SysFont(font_name, size)
        if font and font.name != "FreeSans":
            return font

    return pygame.freetype.SysFont(None, size)

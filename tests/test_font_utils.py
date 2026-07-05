import unittest

from font_utils import get_font


class FontUtilsTest(unittest.TestCase):
    def test_get_font_initializes_freetype_and_renders_chinese_text(self):
        """中文 UI 文案必须通过统一字体 helper 渲染，避免回退到不可读字体。"""
        font = get_font(24)

        surface = font.render("中文", (255, 255, 255))[0]

        self.assertGreater(surface.get_width(), 0)
        self.assertGreater(surface.get_height(), 0)


if __name__ == "__main__":
    unittest.main()


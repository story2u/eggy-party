#!/bin/bash
# 蛋仔派对 Demo 启动脚本
cd "$(dirname "$0")"
# 自动检测 Wayland 或 X11
if [ "$XDG_SESSION_TYPE" = "wayland" ]; then
    export SDL_VIDEODRIVER=wayland
fi
python3 main.py

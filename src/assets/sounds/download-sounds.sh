#!/bin/bash

# 创建sounds目录
mkdir -p /Users/hooksvue/Desktop/createhello\ world/react\ hooks.\ vite\ Groundhopping/my-react-app/src/assets/sounds

cd /Users/hooksvue/Desktop/createhello\ world/react\ hooks.\ vite\ Groundhopping/my-react-app/src/assets/sounds

# 下载音效文件
curl -o hit.mp3 "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3"
curl -o bgm.mp3 "https://assets.mixkit.co/active_storage/sfx/123/123-preview.mp3"
curl -o gameover.mp3 "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3"

echo "音效文件下载完成！"

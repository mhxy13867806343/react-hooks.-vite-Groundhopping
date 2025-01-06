# 打地鼠游戏 (Whack-a-Mole)

一个使用 React + TypeScript + Vite 构建的现代打地鼠游戏。

[在线游玩](https://github.com/mhxy13867806343/react-hooks.-vite-Groundhopping)

## 游戏特点

- 可配置的游戏时间（10秒-120秒）
- 动态地鼠数量（1-9只）
- 支持空格键暂停/继续
- 实时进度条显示
- 最高分记录
- 流畅的动画效果
- 响应式设计

## 技术栈

- React 18
- TypeScript
- Vite
- Emotion (样式解决方案)
- Modern CSS Features

## 快速开始

1. 克隆项目
```bash
git clone https://github.com/mhxy13867806343/react-hooks.-vite-Groundhopping.git
cd react-hooks.-vite-Groundhopping
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

## 游戏规则

1. 游戏开始时可以配置：
   - 总游戏时间（10秒-120秒）
   - 最大地鼠数量（1-9只）
   
2. 游戏过程：
   - 点击出现的地鼠得分
   - 地鼠数量会随时间增加
   - 地鼠出现速度会逐渐加快
   
3. 控制功能：
   - 空格键：暂停/继续游戏
   - 点击地鼠：得分
   - 暂停时显示当前分数和剩余时间

## 游戏配置

- 时间和地鼠数量联动：
  - 60秒 → 5只地鼠
  - 120秒 → 9只地鼠
  - 时间和数量之间线性对应

## 开发功能

- [x] 基础打地鼠功能
- [x] 计分系统
- [x] 暂停功能
- [x] 进度条显示
- [x] 配置面板
- [x] 响应式设计
- [ ] 音效系统
- [ ] 难度选择
- [ ] 排行榜系统

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 作者

[mhxy13867806343](https://github.com/mhxy13867806343)

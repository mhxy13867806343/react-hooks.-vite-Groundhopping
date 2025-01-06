import { GameConfig } from '../types/game';

export const MAX_TIME = 120; // 最大时间 2分钟
export const MIN_TIME = 30;  // 最小时间 30秒
export const MAX_MOLES = 7;  // 最大同时出现的地鼠数量
export const MIN_MOLES = 3;  // 最小同时出现的地鼠数量

export const defaultConfig: GameConfig = {
  totalTime: 60,
  maxMoles: 5,
  initialSpeed: 1000,
  minSpeed: 400,
  language: 'zh'
};

import { useState, useEffect } from 'react';

interface GameConfig {
  totalTime: number;
  maxMoles: number;
  initialSpeed: number;
  minSpeed: number;
  language: string;
}

const STORAGE_KEY = 'whack_a_mole_settings';

export const useGameSettings = (defaultSettings: GameConfig) => {
  // 从 localStorage 获取设置，如果没有则使用默认设置
  const [settings, setSettings] = useState<GameConfig>(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // 确保所有必需的字段都存在
        return {
          totalTime: Number(parsed.totalTime) || defaultSettings.totalTime,
          maxMoles: Number(parsed.maxMoles) || defaultSettings.maxMoles,
          initialSpeed: Number(parsed.initialSpeed) || defaultSettings.initialSpeed,
          minSpeed: Number(parsed.minSpeed) || defaultSettings.minSpeed,
          language: parsed.language || defaultSettings.language,
        };
      } catch (e) {
        console.error('Failed to parse settings:', e);
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // 保存设置到 localStorage
  const saveSettings = (newSettings: GameConfig) => {
    try {
      // 确保所有值都是正确的类型
      const settingsToSave = {
        ...newSettings,
        totalTime: Number(newSettings.totalTime),
        maxMoles: Number(newSettings.maxMoles),
        initialSpeed: Number(newSettings.initialSpeed),
        minSpeed: Number(newSettings.minSpeed),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToSave));
      setSettings(settingsToSave);
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  };

  return { settings, saveSettings };
};

import { useState, useEffect } from 'react';
import { GameConfig } from '../types/game';
import { defaultConfig } from '../constants/game';

const STORAGE_KEY = 'whack_a_mole_settings';

export const useGameSettings = () => {
  // 从本地存储加载设置，如果没有则使用默认设置
  const loadSettings = (): GameConfig => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        console.error('Failed to parse saved settings:', e);
      }
    }
    return defaultConfig;
  };

  const [settings, setSettings] = useState<GameConfig>(loadSettings);

  // 保存设置到本地存储
  const saveSettings = (newSettings: GameConfig) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  };

  // 当组件挂载时加载设置
  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  return {
    settings,
    saveSettings,
  };
};

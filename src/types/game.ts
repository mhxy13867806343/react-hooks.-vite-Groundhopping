export interface GameConfig {
  totalTime: number;
  maxMoles: number;
  initialSpeed: number;
  minSpeed: number;
  language: 'zh' | 'en';
}

export interface Translations {
  title: string;
  score: string;
  highScore: string;
  timeLeft: string;
  startGame: string;
  gameInProgress: string;
  resumeGame: string;
  endGame: string;
  settings: string;
  gamePaused: string;
  currentScore: string;
  pressSpaceOrClick: string;
  confirmEnd: string;
  confirmEndDesc: string;
  cancel: string;
  confirm: string;
  gameSettings: string;
  totalTime: string;
  maxMoles: string;
  suggestedAmount: string;
  save: string;
  minutes: string;
  seconds: string;
  gameOver: string;
  newRecord: string;
  keepTrying: string;
  playAgain: string;
  language: string;
}

export type TranslationsType = {
  [key in 'zh' | 'en']: Translations;
};

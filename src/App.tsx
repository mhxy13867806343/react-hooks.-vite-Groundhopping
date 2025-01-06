import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Button as AntButton, Modal as AntModal, Select, Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useGameSettings } from './hooks/useGameSettings';

// 游戏配置接口
interface GameConfig {
  totalTime: number;
  maxMoles: number;
  initialSpeed: number;
  minSpeed: number;
  language: 'zh' | 'en';
}

const MAX_TIME = 120; // 最大时间 2分钟
const MIN_TIME = 10;  // 最小时间 10秒
const MAX_MOLES = 9;  // 最大地鼠数量
const MIN_MOLES = 1;  // 最小地鼠数量

// 计算时间和地鼠数量的关系
const calculateMolesFromTime = (seconds: number): number => {
  // 60秒对应5个地鼠，120秒对应9个地鼠，线性对应
  const maxMoles = Math.min(Math.ceil((seconds / 60) * 5), MAX_MOLES);
  return Math.max(MIN_MOLES, maxMoles);
};

const calculateTimeFromMoles = (moles: number): number => {
  // 5个地鼠对应60秒，9个地鼠对应120秒，线性对应
  const seconds = Math.ceil((moles / 5) * 60);
  return Math.min(Math.max(seconds, MIN_TIME), MAX_TIME);
};

const defaultConfig: GameConfig = {
  totalTime: 60,
  maxMoles: 5,
  initialSpeed: 1000,
  minSpeed: 400,
  language: 'zh'
};

const translations = {
  zh: {
    title: '打地鼠游戏',
    score: '分数',
    highScore: '最高分',
    timeLeft: '剩余时间',
    startGame: '开始游戏',
    gameInProgress: '游戏进行中...',
    resumeGame: '继续游戏',
    endGame: '结束游戏',
    settings: '设置',
    gamePaused: '游戏暂停',
    currentScore: '当前得分',
    pressSpaceOrClick: '按空格键或点击下方按钮继续游戏',
    confirmEnd: '确认结束游戏？',
    confirmEndDesc: '当前进度将不会保存，确定要结束当前游戏吗？',
    cancel: '取消',
    confirm: '确认结束',
    gameSettings: '游戏设置',
    totalTime: '总时间 (秒)',
    maxMoles: '最大地鼠数量',
    suggestedAmount: '建议数量',
    save: '保存',
    minutes: '分',
    seconds: '秒',
    gameOver: '游戏结束！',
    newRecord: '新纪录！🎉',
    keepTrying: '继续加油！💪',
    playAgain: '再来一局',
    language: '语言'
  },
  en: {
    title: 'Whack-a-Mole',
    score: 'Score',
    highScore: 'High Score',
    timeLeft: 'Time Left',
    startGame: 'Start Game',
    gameInProgress: 'Game in Progress...',
    resumeGame: 'Resume Game',
    endGame: 'End Game',
    settings: 'Settings',
    gamePaused: 'Game Paused',
    currentScore: 'Current Score',
    pressSpaceOrClick: 'Press Space or Click Button Below to Resume',
    confirmEnd: 'Confirm End Game?',
    confirmEndDesc: 'Current progress will not be saved. Are you sure you want to end the game?',
    cancel: 'Cancel',
    confirm: 'Confirm',
    gameSettings: 'Game Settings',
    totalTime: 'Total Time (seconds)',
    maxMoles: 'Max Moles',
    suggestedAmount: 'Suggested Amount',
    save: 'Save',
    minutes: 'min',
    seconds: 'sec',
    gameOver: 'Game Over!',
    newRecord: 'New Record! 🎉',
    keepTrying: 'Keep Going! 💪',
    playAgain: 'Play Again',
    language: 'Language'
  }
};

const GameContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background: #87ceeb;
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const GithubLink = styled.a`
  position: absolute;
  top: 20px;
  right: 20px;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.4);
    transform: translateY(-2px);
  }

  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
`;

const StyledSettingsButton = styled(AntButton)`
  position: absolute;
  top: 20px;
  right: 100px;
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
`;

const ProgressBar = styled.div<{ progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 20px 20px 0 0;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: linear-gradient(90deg, #4CAF50, #45a049);
    transition: width 0.3s linear;
  }
`;

const ConfigPanel = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  
  label {
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
  
  input {
    width: 80px;
    padding: 5px;
    border: none;
    border-radius: 5px;
    text-align: center;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 20px auto;
  max-width: 600px;
  background: #4a8505;
  padding: 20px;
  border-radius: 15px;
`;

const popUp = keyframes`
  0% { transform: translateY(100%) scale(0.5); }
  50% { transform: translateY(-10%) scale(1.1); }
  100% { transform: translateY(0) scale(1); }
`;

const dizzyAnimation = keyframes`
  0% { transform: rotate(0deg); filter: blur(0); }
  25% { transform: rotate(15deg); filter: blur(1px); }
  50% { transform: rotate(-15deg); filter: blur(2px); }
  75% { transform: rotate(15deg); filter: blur(1px); }
  100% { transform: rotate(0deg); filter: blur(0); }
`;

const whackAnimation = keyframes`
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(0.8) rotate(-20deg); }
  100% { transform: scale(1) rotate(0deg); }
`;

const HoleContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background: #5c4029;
  border-radius: 50%;
  box-shadow: inset 0 10px 20px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  overflow: hidden;
`;

const Mole = styled.div<{ active: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  bottom: 0;
  visibility: ${props => props.active ? 'visible' : 'hidden'};
  animation: ${props => props.active ? popUp : 'none'} 0.5s ease-out;
  transform-origin: bottom center;
  background: url('/ds.jpg') no-repeat center center;
  background-size: contain;

  &.whacked {
    animation: ${dizzyAnimation} 0.5s ease-out;
  }
`;

const ScoreBoard = styled.div`
  font-size: 28px;
  margin: 20px 0;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
  display: inline-block;
`;

const Button = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 20px;
  border-radius: 25px;
  cursor: pointer;
  margin: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background: #ff5252;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  animation: ${popUp} 0.3s ease-out;

  h2 {
    color: #ff6b6b;
    margin: 0 0 20px 0;
    font-size: 28px;
  }

  p {
    font-size: 24px;
    margin: 10px 0;
    color: #333;
  }

  .score {
    font-size: 48px;
    color: #ff6b6b;
    margin: 20px 0;
    font-weight: bold;
  }

  .high-score {
    font-size: 20px;
    color: #666;
    margin: 10px 0;
  }
`;

const PauseOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  h2 {
    color: white;
    font-size: 2.5rem;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  }

  p {
    color: white;
    margin-bottom: 10px;
    font-size: 1.2rem;
  }

  .score-display {
    color: #4CAF50;
    font-size: 4rem;
    font-weight: bold;
    margin: 20px 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  }

  .time-display {
    color: #ffd700;
    font-size: 2rem;
    margin-bottom: 30px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
`;

const ResumeButton = styled(Button)`
  background: #4CAF50;
  &:hover {
    background: #45a049;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

const EndGameButton = styled(Button)`
  background: #ff4757;
  &:hover {
    background: #ff6b81;
  }
`;

const ConfirmModal = styled(Modal)`
  .content {
    text-align: center;
    padding: 30px;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

    h3 {
      color: #333;
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    p {
      color: #666;
      margin-bottom: 25px;
      font-size: 1.1rem;
    }

    .button-group {
      display: flex;
      justify-content: center;
      gap: 15px;

      button {
        padding: 10px 25px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;

        &.confirm {
          background: #ff4757;
          color: white;
          &:hover {
            background: #ff6b81;
          }
        }

        &.cancel {
          background: #f1f2f6;
          color: #333;
          &:hover {
            background: #dfe4ea;
          }
        }
      }
    }
  }
`;

const App: React.FC = () => {
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [moles, setMoles] = useState<boolean[]>(Array(9).fill(false));
  const [whackedMoles, setWhackedMoles] = useState<boolean[]>(Array(9).fill(false));
  const [isPaused, setIsPaused] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { settings, saveSettings } = useGameSettings();
  const [config, setConfig] = useState<GameConfig>(settings);
  const [tempConfig, setTempConfig] = useState<GameConfig>(settings);

  // 当settings改变时更新config
  useEffect(() => {
    setConfig(settings);
    setTempConfig(settings);
  }, [settings]);

  // 处理设置的保存
  const handleSaveSettings = () => {
    saveSettings(tempConfig);
    setShowSettings(false);
  };

  // 处理设置的取消
  const handleCancelSettings = () => {
    setTempConfig(settings);
    setShowSettings(false);
  };

  // 处理设置的关闭
  const handleCloseSettings = () => {
    setTempConfig(settings);
    setShowSettings(false);
  };

  // 渲染设置模态框
  const renderSettingsModal = () => (
    <AntModal
      title={translations[config.language].gameSettings}
      open={showSettings}
      onCancel={handleCloseSettings}
      footer={[
        <AntButton key="cancel" onClick={handleCancelSettings}>
          {translations[config.language].cancel}
        </AntButton>,
        <AntButton key="save" type="primary" onClick={handleSaveSettings}>
          {translations[config.language].save}
        </AntButton>
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <div style={{ marginBottom: '8px' }}>{translations[config.language].language}</div>
          <Select
            value={tempConfig.language}
            style={{ width: '100%' }}
            onChange={(value: 'zh' | 'en') => setTempConfig(prev => ({ ...prev, language: value }))}
            options={[
              { value: 'zh', label: '中文' },
              { value: 'en', label: 'English' }
            ]}
          />
        </div>
        <div>
          <div style={{ marginBottom: '8px' }}>{translations[config.language].totalTime}</div>
          <input
            type="number"
            value={tempConfig.totalTime}
            onChange={e => {
              const value = parseInt(e.target.value) || MIN_TIME;
              setTempConfig(prev => ({
                ...prev,
                totalTime: Math.min(Math.max(value, MIN_TIME), MAX_TIME)
              }));
            }}
            min={MIN_TIME}
            max={MAX_TIME}
            style={{ width: '100%', padding: '4px 11px', borderRadius: '6px', border: '1px solid #d9d9d9' }}
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            {Math.floor(tempConfig.totalTime / 60)}{translations[tempConfig.language].minutes}
            {tempConfig.totalTime % 60}{translations[tempConfig.language].seconds}
          </div>
        </div>
        <div>
          <div style={{ marginBottom: '8px' }}>{translations[config.language].maxMoles}</div>
          <input
            type="number"
            value={tempConfig.maxMoles}
            onChange={e => {
              const value = parseInt(e.target.value) || MIN_MOLES;
              setTempConfig(prev => ({
                ...prev,
                maxMoles: Math.min(Math.max(value, MIN_MOLES), MAX_MOLES)
              }));
            }}
            min={MIN_MOLES}
            max={MAX_MOLES}
            style={{ width: '100%', padding: '4px 11px', borderRadius: '6px', border: '1px solid #d9d9d9' }}
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            {translations[tempConfig.language].suggestedAmount}: {calculateMolesFromTime(tempConfig.totalTime)}
          </div>
        </div>
      </Space>
    </AntModal>
  );

  // 处理空格键暂停
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && gameActive) {
        e.preventDefault();
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameActive]);

  // 地鼠移动逻辑
  useEffect(() => {
    let moleTimer: number;
    if (gameActive && !isPaused) {
      const progress = (config.totalTime - timeLeft) / config.totalTime;
      const speed = Math.max(config.initialSpeed - progress * (config.initialSpeed - config.minSpeed), config.minSpeed);
      
      moleTimer = setInterval(() => {
        const numberOfMoles = Math.min(
          Math.floor((config.totalTime - timeLeft) / (config.totalTime / config.maxMoles)) + 1,
          config.maxMoles
        );
        
        const newMoles: boolean[] = Array(9).fill(false);
        const availablePositions = Array.from({length: 9}, (_, i) => i)
          .filter(pos => !moles[pos]);
        
        while (newMoles.filter(Boolean).length < numberOfMoles && availablePositions.length > 0) {
          const randomIndex = Math.floor(Math.random() * availablePositions.length);
          const position = availablePositions[randomIndex];
          newMoles[position] = true;
          availablePositions.splice(randomIndex, 1);
        }
        
        setMoles(newMoles);
      }, speed) as unknown as number;
    }
    return () => clearInterval(moleTimer);
  }, [gameActive, isPaused, timeLeft, config, moles]);

  // 打地鼠逻辑
  const whackMole = (index: number) => {
    if (gameActive && !isPaused && moles[index]) {
      setScore(prev => prev + 1);
      setWhackedMoles(prev => prev.map((mole, i) => i === index ? true : mole));
      
      // 播放打击音效
      const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
      audio.play().catch(() => {});
      
      // 重置whacked动画状态
      setTimeout(() => {
        setWhackedMoles(prev => prev.map((mole, i) => i === index ? false : mole));
      }, 500);
    }
  };

  // 游戏计时器
  useEffect(() => {
    let timer: number;
    if (gameActive && !isPaused) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameActive(false);
            setHighScore(current => Math.max(current, score));
            setShowGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000) as unknown as number;
    }
    return () => clearInterval(timer);
  }, [gameActive, isPaused, score]);

  // 开始游戏
  const startGame = () => {
    setScore(0);
    setGameActive(true);
    setIsPaused(false);
    setTimeLeft(config.totalTime);
    setMoles(Array(9).fill(false));
    setWhackedMoles(Array(9).fill(false));
    setShowEndConfirm(false);
    setShowGameOver(false);
  };

  // 结束游戏
  const endGame = () => {
    setGameActive(false);
    setIsPaused(false);
    setTimeLeft(config.totalTime);
    setScore(0);
    setMoles(Array(9).fill(false));
    setWhackedMoles(Array(9).fill(false));
    setShowEndConfirm(false);
    setShowGameOver(false);
  };

  // 处理结束游戏按钮点击
  const handleEndGameClick = () => {
    if (gameActive) {
      setIsPaused(true);
      setShowEndConfirm(true);
    }
  };

  // 确认结束游戏
  const handleConfirmEndGame = () => {
    setShowEndConfirm(false);
    endGame();
  };

  // 取消结束游戏
  const handleCancelEndGame = () => {
    setShowEndConfirm(false);
    setIsPaused(false);
  };

  return (
    <GameContainer>
      <h1>
        {translations[config.language].title}
      </h1>
      
      <ScoreBoard>
        {translations[config.language].score}: {score} | {translations[config.language].highScore}: {highScore} | {translations[config.language].timeLeft}: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </ScoreBoard>

      <Button
        onClick={gameActive ? handleEndGameClick : startGame}
        disabled={gameActive && !isPaused}
        style={{ margin: '20px 0' }}
      >
        {gameActive 
          ? (isPaused ? translations[config.language].resumeGame : translations[config.language].endGame)
          : translations[config.language].startGame}
      </Button>

      <Grid>
        {Array(9).fill(null).map((_, index) => (
          <HoleContainer key={index} onClick={() => whackMole(index)}>
            <Mole 
              active={moles[index]}
              className={whackedMoles[index] ? 'whacked' : ''}
            />
          </HoleContainer>
        ))}
      </Grid>

      {/* 暂停界面 */}
      {isPaused && !showEndConfirm && (
        <PauseOverlay>
          <h2>{translations[config.language].gamePaused}</h2>
          <p>{translations[config.language].currentScore}</p>
          <div className="score-display">{score}</div>
          <p>{translations[config.language].pressSpaceOrClick}</p>
          <ButtonGroup>
            <ResumeButton onClick={() => setIsPaused(false)}>
              {translations[config.language].resumeGame}
            </ResumeButton>
            <EndGameButton onClick={handleEndGameClick}>
              {translations[config.language].endGame}
            </EndGameButton>
          </ButtonGroup>
        </PauseOverlay>
      )}

      {/* 确认结束游戏弹窗 */}
      {showEndConfirm && (
        <ConfirmModal>
          <div className="content">
            <h3>{translations[config.language].confirmEnd}</h3>
            <p>{translations[config.language].confirmEndDesc}</p>
            <div className="button-group">
              <button className="cancel" onClick={handleCancelEndGame}>
                {translations[config.language].cancel}
              </button>
              <button className="confirm" onClick={handleConfirmEndGame}>
                {translations[config.language].confirm}
              </button>
            </div>
          </div>
        </ConfirmModal>
      )}

      {/* 游戏设置弹窗 */}
      {renderSettingsModal()}

      {/* 游戏结束弹窗 */}
      {showGameOver && (
        <Modal>
          <ModalContent>
            <h2>{translations[config.language].gameOver}</h2>
            <div className="score">{score}</div>
            <div className="high-score">
              {score > highScore ? translations[config.language].newRecord : translations[config.language].keepTrying}
            </div>
            <Button onClick={startGame}>
              {translations[config.language].playAgain}
            </Button>
          </ModalContent>
        </Modal>
      )}

      <GithubLink
        href="https://github.com/your-username/whack-a-mole"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 16 16">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        GitHub
      </GithubLink>

      <StyledSettingsButton
        icon={<SettingOutlined />}
        onClick={() => setShowSettings(true)}
      >
        {translations[config.language].settings}
      </StyledSettingsButton>
    </GameContainer>
  );
};

export default App;

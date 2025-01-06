import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

// 游戏配置接口
interface GameConfig {
  totalTime: number;
  maxMoles: number;
  initialSpeed: number;
  minSpeed: number;
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
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(defaultConfig.totalTime);
  const [activeMoles, setActiveMoles] = useState<number[]>([]);
  const [highScore, setHighScore] = useState(0);
  const [whackedMole, setWhackedMole] = useState<number | null>(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [config, setConfig] = useState<GameConfig>(defaultConfig);
  const [showConfirmEndGame, setShowConfirmEndGame] = useState(false);

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

  // 处理倒计时
  useEffect(() => {
    let timer: number;
    if (gameActive && !isPaused) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameActive(false);
            setHighScore(current => Math.max(current, score));
            setShowEndModal(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000) as unknown as number;
    }
    return () => clearInterval(timer);
  }, [gameActive, isPaused, score]);

  // 处理地鼠移动
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
        
        const newMoles: number[] = [];
        const availablePositions = Array.from({length: 9}, (_, i) => i)
          .filter(pos => !activeMoles.includes(pos));
        
        while (newMoles.length < numberOfMoles && availablePositions.length > 0) {
          const randomIndex = Math.floor(Math.random() * availablePositions.length);
          const position = availablePositions[randomIndex];
          newMoles.push(position);
          availablePositions.splice(randomIndex, 1);
        }
        
        setActiveMoles(newMoles);
      }, speed) as unknown as number;
    }
    return () => clearInterval(moleTimer);
  }, [gameActive, isPaused, timeLeft, config, activeMoles]);

  const startGame = () => {
    setScore(0);
    setGameActive(true);
    setIsPaused(false);
    setTimeLeft(config.totalTime);
    setActiveMoles([]);
    setShowEndModal(false);
  };

  const handleConfigChange = (key: keyof GameConfig, value: number) => {
    if (key === 'totalTime') {
      // 时间改变，自动调整地鼠数量
      const newTime = Math.min(Math.max(value, MIN_TIME), MAX_TIME);
      const newMoles = calculateMolesFromTime(newTime);
      setConfig(prev => ({
        ...prev,
        totalTime: newTime,
        maxMoles: newMoles
      }));
    } else if (key === 'maxMoles') {
      // 地鼠数量改变，自动调整时间
      const newMoles = Math.min(Math.max(value, MIN_MOLES), MAX_MOLES);
      const newTime = calculateTimeFromMoles(newMoles);
      setConfig(prev => ({
        ...prev,
        maxMoles: newMoles,
        totalTime: newTime
      }));
    }
  };

  const whackMole = (index: number) => {
    if (gameActive && !isPaused && activeMoles.includes(index)) {
      setScore(prev => prev + 1);
      setWhackedMole(index);
      setActiveMoles(prev => prev.filter(mole => mole !== index));
      
      // 播放打击音效
      const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
      audio.play().catch(() => {});
      
      // 重置whacked动画状态
      setTimeout(() => {
        setWhackedMole(null);
      }, 500);
    }
  };

  // 计算进度条百分比
  const calculateProgress = () => {
    return ((config.totalTime - timeLeft) / config.totalTime) * 100;
  };

  const endGame = () => {
    setGameActive(false);
    setIsPaused(false);
    setTimeLeft(config.totalTime);
    setScore(0);
    setActiveMoles([]);
    setWhackedMole(-1);
  };

  const handleEndGameClick = () => {
    setShowConfirmEndGame(true);
  };

  const handleConfirmEndGame = () => {
    setShowConfirmEndGame(false);
    endGame();
  };

  const handleCancelEndGame = () => {
    setShowConfirmEndGame(false);
  };

  return (
    <GameContainer>
      <GithubLink 
        href="https://github.com/mhxy13867806343/react-hooks.-vite-Groundhopping" 
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        GitHub
      </GithubLink>

      {gameActive && <ProgressBar progress={calculateProgress()} />}
      
      <h1 style={{ color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
        打地鼠游戏
      </h1>
      
      {!gameActive && (
        <ConfigPanel>
          <label>
            总时间 (秒)
            <input 
              type="number" 
              value={config.totalTime}
              onChange={e => handleConfigChange('totalTime', parseInt(e.target.value) || MIN_TIME)}
              min={MIN_TIME}
              max={MAX_TIME}
            />
            <div style={{ fontSize: '12px', color: '#fff' }}>
              {Math.floor(config.totalTime / 60)}分{config.totalTime % 60}秒
            </div>
          </label>
          <label>
            最大地鼠数量
            <input 
              type="number" 
              value={config.maxMoles}
              onChange={e => handleConfigChange('maxMoles', parseInt(e.target.value) || MIN_MOLES)}
              min={MIN_MOLES}
              max={MAX_MOLES}
            />
            <div style={{ fontSize: '12px', color: '#fff' }}>
              建议数量: {calculateMolesFromTime(config.totalTime)}
            </div>
          </label>
        </ConfigPanel>
      )}

      <ScoreBoard>
        分数: {score} | 最高分: {highScore} | 剩余时间: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        {gameActive && <div style={{ fontSize: '18px' }}>按空格键暂停/继续</div>}
        {isPaused && <div style={{ color: '#ff6b6b' }}>已暂停</div>}
      </ScoreBoard>

      <Button
        onClick={startGame}
        disabled={gameActive && !isPaused}
        style={{ margin: '20px 0' }}
      >
        {gameActive 
          ? (isPaused ? '继续游戏' : '游戏进行中...') 
          : '开始游戏'}
      </Button>

      <Grid>
        {Array(9).fill(null).map((_, index) => (
          <HoleContainer key={index} onClick={() => whackMole(index)}>
            <Mole 
              active={activeMoles.includes(index)}
              className={whackedMole === index ? 'whacked' : ''}
            />
          </HoleContainer>
        ))}
      </Grid>

      {isPaused && gameActive && (
        <PauseOverlay>
          <h2>游戏暂停</h2>
          <p>当前得分</p>
          <div className="score-display">{score}</div>
          <div className="time-display">
            剩余时间: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          <p>按空格键或点击下方按钮继续游戏</p>
          <ButtonGroup>
            <ResumeButton onClick={() => setIsPaused(false)}>
              继续游戏
            </ResumeButton>
            <EndGameButton onClick={handleEndGameClick}>
              结束游戏
            </EndGameButton>
          </ButtonGroup>
        </PauseOverlay>
      )}

      {showConfirmEndGame && (
        <ConfirmModal>
          <div className="content">
            <h3>确认结束游戏？</h3>
            <p>当前进度将不会保存，确定要结束当前游戏吗？</p>
            <div className="button-group">
              <button className="cancel" onClick={handleCancelEndGame}>
                取消
              </button>
              <button className="confirm" onClick={handleConfirmEndGame}>
                确认结束
              </button>
            </div>
          </div>
        </ConfirmModal>
      )}

      {showEndModal && (
        <Modal>
          <ModalContent>
            <h2>游戏结束！</h2>
            <div className="score">{score}分</div>
            <div className="high-score">最高分: {highScore}</div>
            <p>{score > highScore ? '新纪录！🎉' : '继续加油！💪'}</p>
            <Button onClick={startGame}>
              再来一局
            </Button>
          </ModalContent>
        </Modal>
      )}
    </GameContainer>
  );

};

export default App;

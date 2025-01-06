import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Button as AntButton } from 'antd';

export const popUp = keyframes`
  0% { transform: translateY(100%) scale(0.5); }
  50% { transform: translateY(-10%) scale(1.1); }
  100% { transform: translateY(0) scale(1); }
`;

export const dizzyAnimation = keyframes`
  0% { transform: rotate(0deg); filter: blur(0); }
  25% { transform: rotate(15deg); filter: blur(1px); }
  50% { transform: rotate(-15deg); filter: blur(2px); }
  75% { transform: rotate(15deg); filter: blur(1px); }
  100% { transform: rotate(0deg); filter: blur(0); }
`;

export const whackAnimation = keyframes`
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(0.8) rotate(-20deg); }
  100% { transform: scale(1) rotate(0deg); }
`;

export const GameContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 20px auto;
  max-width: 600px;
`;

export const HoleContainer = styled.div`
  background: #654321;
  border-radius: 50%;
  padding-top: 100%;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  box-shadow: inset 0 -10px 15px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: scale(1.02);
  }
`;

export const Mole = styled.div<{ active: boolean }>`
  position: absolute;
  bottom: ${props => props.active ? '0' : '-100%'};
  left: 0;
  right: 0;
  height: 100%;
  background: #8B4513;
  border-radius: 50%;
  transition: bottom 0.2s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 20%;
    right: 20%;
    bottom: 20%;
    background: #A0522D;
    border-radius: 50%;
  }

  &.whacked {
    animation: ${dizzyAnimation} 0.5s ease-in-out;
  }
`;

export const StyledSettingsButton = styled(AntButton)`
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

export const ProgressBar = styled.div<{ progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 5px;
  width: ${props => props.progress}%;
  background: linear-gradient(to right, #4CAF50, #8BC34A);
  transition: width 0.3s linear;
`;

export const ScoreBoard = styled.div`
  font-size: 24px;
  margin: 20px 0;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

export const Button = styled.button`
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

export const GithubLink = styled.a`
  position: absolute;
  top: 20px;
  right: 20px;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
`;

export const Modal = styled.div`
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

export const ModalContent = styled.div`
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

export const PauseOverlay = styled.div`
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

export const ResumeButton = styled(Button)`
  background: #4CAF50;
  &:hover {
    background: #45a049;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

export const EndGameButton = styled(Button)`
  background: #ff4757;
  &:hover {
    background: #ff6b81;
  }
`;

export const ConfirmModal = styled(Modal)`
  .content {
    background: white;
    padding: 25px;
    border-radius: 15px;
    text-align: center;
    max-width: 350px;
    width: 90%;

    h3 {
      color: #ff4757;
      margin: 0 0 15px 0;
      font-size: 1.5rem;
    }

    p {
      color: #666;
      margin-bottom: 20px;
      font-size: 1rem;
      line-height: 1.5;
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

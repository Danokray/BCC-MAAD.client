import React, { useEffect, useState, createContext, useContext, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: ${theme.spacing.lg};
  right: ${theme.spacing.lg};
  z-index: 1100;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  max-width: 400px;
`;

const Toast = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.info;
      default: return theme.colors.primary;
    }
  }};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.sm};
  animation: ${props => props.isExiting ? slideOut : slideIn} 0.3s ease;
  position: relative;
  overflow: hidden;
`;

const ToastIcon = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  color: ${props => {
    switch (props.type) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.info;
      default: return theme.colors.primary;
    }
  }};
  flex-shrink: 0;
  margin-top: 2px;
`;

const ToastContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ToastTitle = styled.h4`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.textPrimary};
  margin: 0 0 ${theme.spacing.xs} 0;
`;

const ToastMessage = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.textSecondary};
  margin: 0;
  line-height: ${theme.typography.lineHeight.normal};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textMuted};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background-color: ${theme.colors.gray100};
    color: ${theme.colors.textPrimary};
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: ${props => {
    switch (props.type) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.info;
      default: return theme.colors.primary;
    }
  }};
  width: ${props => props.progress}%;
  transition: width 0.1s linear;
`;

const ToastComponent = ({ 
  id, 
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose 
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  }, [onClose, id]);

  useEffect(() => {
    if (duration === 0) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 100));
        if (newProgress <= 0) {
          handleClose();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, handleClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return 'ℹ';
    }
  };

  return (
    <Toast type={type} isExiting={isExiting}>
      <ToastIcon type={type}>{getIcon()}</ToastIcon>
      <ToastContent>
        {title && <ToastTitle>{title}</ToastTitle>}
        <ToastMessage>{message}</ToastMessage>
      </ToastContent>
      <CloseButton onClick={handleClose} aria-label="Закрыть">
        ×
      </CloseButton>
      {duration > 0 && <ProgressBar type={type} progress={progress} />}
    </Toast>
  );
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer>
        {toasts.map(toast => (
          <ToastComponent
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

// Контекст для использования тостов
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast должен использоваться внутри ToastProvider');
  }
  return context;
};

export { ToastProvider };
export default ToastComponent;

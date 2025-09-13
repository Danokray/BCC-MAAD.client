import React, { useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing.md};
`;

const ModalContainer = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.xl};
  max-width: ${props => props.maxWidth || '500px'};
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: ${theme.spacing.lg} ${theme.spacing.lg} 0;
  border-bottom: ${props => props.border ? `1px solid ${theme.colors.gray200}` : 'none'};
  margin-bottom: ${props => props.border ? theme.spacing.lg : 0};
`;

const ModalTitle = styled.h2`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

const ModalSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.textSecondary};
  margin: ${theme.spacing.xs} 0 0;
`;

const ModalBody = styled.div`
  padding: ${props => props.noPadding ? '0' : theme.spacing.lg};
`;

const ModalFooter = styled.div`
  padding: 0 ${theme.spacing.lg} ${theme.spacing.lg};
  border-top: ${props => props.border ? `1px solid ${theme.colors.gray200}` : 'none'};
  margin-top: ${props => props.border ? theme.spacing.lg : 0};
  padding-top: ${props => props.border ? theme.spacing.lg : 0};
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: flex-end;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  background: none;
  border: none;
  font-size: ${theme.typography.fontSize.xl};
  color: ${theme.colors.textMuted};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.md};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${theme.colors.gray100};
    color: ${theme.colors.textPrimary};
  }
`;

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle,
  children, 
  maxWidth,
  showCloseButton = true,
  ...props 
}) => {
  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer 
        maxWidth={maxWidth}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {showCloseButton && (
          <CloseButton onClick={onClose} aria-label="Закрыть">
            ×
          </CloseButton>
        )}
        
        {title && (
          <ModalHeader border={!!subtitle}>
            <ModalTitle>{title}</ModalTitle>
            {subtitle && <ModalSubtitle>{subtitle}</ModalSubtitle>}
          </ModalHeader>
        )}
        
        <ModalBody noPadding={!title}>
          {children}
        </ModalBody>
      </ModalContainer>
    </Overlay>
  );
};

Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Subtitle = ModalSubtitle;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;

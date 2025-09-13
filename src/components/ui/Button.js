import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.medium};
  line-height: 1;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  min-height: 44px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Primary variant */
  ${props => props.variant === 'primary' && `
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    border-color: ${theme.colors.primary};

    &:hover:not(:disabled) {
      background-color: ${theme.colors.primaryDark};
      border-color: ${theme.colors.primaryDark};
    }

    &:active:not(:disabled) {
      background-color: ${theme.colors.primaryDark};
      transform: translateY(1px);
    }
  `}

  /* Secondary variant */
  ${props => props.variant === 'secondary' && `
    background-color: ${theme.colors.white};
    color: ${theme.colors.primary};
    border-color: ${theme.colors.primary};

    &:hover:not(:disabled) {
      background-color: ${theme.colors.primary};
      color: ${theme.colors.white};
    }

    &:active:not(:disabled) {
      background-color: ${theme.colors.primaryDark};
      transform: translateY(1px);
    }
  `}

  /* Outline variant */
  ${props => props.variant === 'outline' && `
    background-color: transparent;
    color: ${theme.colors.textPrimary};
    border-color: ${theme.colors.gray300};

    &:hover:not(:disabled) {
      background-color: ${theme.colors.gray50};
      border-color: ${theme.colors.gray400};
    }

    &:active:not(:disabled) {
      background-color: ${theme.colors.gray100};
      transform: translateY(1px);
    }
  `}

  /* Ghost variant */
  ${props => props.variant === 'ghost' && `
    background-color: transparent;
    color: ${theme.colors.textPrimary};
    border-color: transparent;

    &:hover:not(:disabled) {
      background-color: ${theme.colors.gray100};
    }

    &:active:not(:disabled) {
      background-color: ${theme.colors.gray200};
    }
  `}

  /* Danger variant */
  ${props => props.variant === 'danger' && `
    background-color: ${theme.colors.error};
    color: ${theme.colors.white};
    border-color: ${theme.colors.error};

    &:hover:not(:disabled) {
      background-color: #dc2626;
      border-color: #dc2626;
    }

    &:active:not(:disabled) {
      background-color: #b91c1c;
      transform: translateY(1px);
    }
  `}

  /* Success variant */
  ${props => props.variant === 'success' && `
    background-color: ${theme.colors.success};
    color: ${theme.colors.white};
    border-color: ${theme.colors.success};

    &:hover:not(:disabled) {
      background-color: #059669;
      border-color: #059669;
    }

    &:active:not(:disabled) {
      background-color: #047857;
      transform: translateY(1px);
    }
  `}

  /* Size variants */
  ${props => props.size === 'sm' && `
    padding: ${theme.spacing.xs} ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
    min-height: 36px;
  `}

  ${props => props.size === 'lg' && `
    padding: ${theme.spacing.md} ${theme.spacing.xl};
    font-size: ${theme.typography.fontSize.lg};
    min-height: 52px;
  `}

  /* Full width */
  ${props => props.fullWidth && `
    width: 100%;
  `}

  /* Loading state */
  ${props => props.loading && `
    position: relative;
    color: transparent;

    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  `}

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  disabled = false,
  type = 'button',
  ...props 
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? '' : children}
    </StyledButton>
  );
};

export default Button;

import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: 100%;
`;

const Label = styled.label`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textPrimary};
  
  ${props => props.required && `
    &::after {
      content: ' *';
      color: ${theme.colors.error};
    }
  `}
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.base};
  font-family: ${theme.typography.fontFamily};
  color: ${theme.colors.textPrimary};
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  transition: all 0.3s ease;
  min-height: 48px;
  box-shadow: ${theme.shadows.sm};

  &::placeholder {
    color: ${theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0, 171, 117, 0.1);
  }

  &:disabled {
    background-color: ${theme.colors.surfaceElevated};
    color: ${theme.colors.textMuted};
    cursor: not-allowed;
  }

  /* Error state */
  ${props => props.error && `
    border-color: ${theme.colors.error};
    
    &:focus {
      border-color: ${theme.colors.error};
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}

  /* Size variants */
  ${props => props.size === 'sm' && `
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: ${theme.typography.fontSize.sm};
    min-height: 36px;
  `}

  ${props => props.size === 'lg' && `
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.typography.fontSize.lg};
    min-height: 52px;
  `}
`;

const ErrorMessage = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.error};
  margin-top: ${theme.spacing.xs};
`;

const HelpText = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.textSecondary};
  margin-top: ${theme.spacing.xs};
`;

const Input = ({
  label,
  error,
  helpText,
  required = false,
  size = 'md',
  ...props
}) => {
  return (
    <InputContainer>
      {label && (
        <Label required={required}>
          {label}
        </Label>
      )}
      <StyledInput
        error={error}
        size={size}
        {...props}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {helpText && !error && <HelpText>{helpText}</HelpText>}
    </InputContainer>
  );
};

export default Input;

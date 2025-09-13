import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const StyledCard = styled.div`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.gray200};
  overflow: hidden;
  transition: all 0.2s ease;

  ${props => props.hoverable && `
    cursor: pointer;
    
    &:hover {
      box-shadow: ${theme.shadows.md};
      transform: translateY(-2px);
    }
  `}

  ${props => props.padding && `
    padding: ${theme.spacing[props.padding]};
  `}

  ${props => !props.padding && `
    padding: ${theme.spacing.lg};
  `}
`;

const CardHeader = styled.div`
  padding: ${theme.spacing.lg} ${theme.spacing.lg} 0;
  border-bottom: ${props => props.border ? `1px solid ${theme.colors.gray200}` : 'none'};
  margin-bottom: ${props => props.border ? theme.spacing.lg : 0};
`;

const CardTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

const CardSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.textSecondary};
  margin: ${theme.spacing.xs} 0 0;
`;

const CardBody = styled.div`
  padding: ${props => props.noPadding ? '0' : theme.spacing.lg};
`;

const CardFooter = styled.div`
  padding: 0 ${theme.spacing.lg} ${theme.spacing.lg};
  border-top: ${props => props.border ? `1px solid ${theme.colors.gray200}` : 'none'};
  margin-top: ${props => props.border ? theme.spacing.lg : 0};
  padding-top: ${props => props.border ? theme.spacing.lg : 0};
`;

const Card = ({ 
  children, 
  hoverable = false, 
  padding = 'lg',
  ...props 
}) => {
  return (
    <StyledCard hoverable={hoverable} padding={padding} {...props}>
      {children}
    </StyledCard>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;

import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: ${theme.borderRadius['2xl']};
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  box-shadow: ${theme.shadows.glass};
  animation: slideIn 0.5s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${theme.typography.fontSize.sm};
`;

const TableHeader = styled.thead`
  background: ${theme.colors.gradients.light};
`;

const TableHeaderCell = styled.th`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  text-align: left;
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.textPrimary};
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  white-space: nowrap;

  ${props => props.sortable && `
    cursor: pointer;
    user-select: none;
    position: relative;
    
    &:hover {
      background-color: ${theme.colors.gray100};
    }
    
    &::after {
      content: '↕';
      position: absolute;
      right: ${theme.spacing.sm};
      opacity: 0.5;
      font-size: ${theme.typography.fontSize.xs};
    }
  `}
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.5);
    transform: scale(1.01);
  }

  &:last-child {
    border-bottom: none;
  }

  ${props => props.clickable && `
    cursor: pointer;
  `}
`;

const TableCell = styled.td`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  color: ${theme.colors.textPrimary};
  vertical-align: middle;

  ${props => props.align === 'center' && `
    text-align: center;
  `}

  ${props => props.align === 'right' && `
    text-align: right;
  `}

  ${props => props.numeric && `
    font-variant-numeric: tabular-nums;
    text-align: right;
  `}
`;

const EmptyState = styled.div`
  padding: ${theme.spacing['2xl']};
  text-align: center;
  color: ${theme.colors.textSecondary};
`;

const EmptyStateIcon = styled.div`
  font-size: ${theme.typography.fontSize['3xl']};
  margin-bottom: ${theme.spacing.md};
  opacity: 0.5;
`;

const EmptyStateText = styled.p`
  font-size: ${theme.typography.fontSize.base};
  margin: 0;
`;

const EmptyStateSubtext = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  margin: ${theme.spacing.sm} 0 0;
  color: ${theme.colors.textMuted};
`;

const Table = ({ children, ...props }) => {
  return (
    <TableContainer>
      <StyledTable {...props}>
        {children}
      </StyledTable>
    </TableContainer>
  );
};

Table.Header = TableHeader;
Table.HeaderCell = TableHeaderCell;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;
Table.EmptyState = EmptyState;
Table.EmptyStateIcon = EmptyStateIcon;
Table.EmptyStateText = EmptyStateText;
Table.EmptyStateSubtext = EmptyStateSubtext;

export default Table;

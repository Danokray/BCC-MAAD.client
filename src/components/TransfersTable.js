import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import Table from './ui/Table';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const TransfersTableContainer = styled.div`
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const TableTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

const TransferAmount = styled.span`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${props => props.positive ? theme.colors.success : theme.colors.error};
`;

const TransferDirection = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => props.direction === 'incoming' && `
    background-color: ${theme.colors.success}15;
    color: ${theme.colors.success};
  `}

  ${props => props.direction === 'outgoing' && `
    background-color: ${theme.colors.error}15;
    color: ${theme.colors.error};
  `}
`;

const TransferType = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  background-color: ${theme.colors.primary}15;
  color: ${theme.colors.primary};
`;

const TransfersTable = ({ transfers, isLoading, onTransferClick }) => {
  const formatCurrency = (amount, currency = 'KZT') => {
    if (typeof currency !== 'string' || currency === 'string' || currency === '') {
      currency = 'KZT';
    }
    
    const validCurrencies = ['KZT', 'USD', 'EUR', 'RUB'];
    const safeCurrency = validCurrencies.includes(currency) ? currency : 'KZT';
    const safeAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
    
    try {
      return new Intl.NumberFormat('ru-KZ', {
        style: 'currency',
        currency: safeCurrency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(safeAmount);
    } catch (error) {
      console.warn('Ошибка форматирования валюты:', error);
      return `${safeAmount} ${safeCurrency}`;
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd.MM.yyyy', { locale: ru });
  };

  const getDirectionText = (type) => {
    // Определяем направление на основе типа операции
    if (type && type.endsWith('_in')) {
      return 'Поступление';
    } else if (type && type.endsWith('_out')) {
      return 'Исходящий';
    }
    
    // Fallback для старых данных
    switch (type) {
      case 'incoming': return 'Поступление';
      case 'outgoing': return 'Исходящий';
      default: return '—';
    }
  };

  const getTypeText = (type) => {
    const typeMap = {
      salary_in: 'Зарплата',
      stipend_in: 'Стипендия',
      family_in: 'Перевод от семьи',
      cashback_in: 'Кэшбэк',
      refund_in: 'Возврат средств',
      card_in: 'Пополнение карты',
      p2p_out: 'Перевод P2P',
      card_out: 'Оплата картой',
      atm_withdrawal: 'Снятие в банкомате',
      utilities_out: 'Оплата коммунальных услуг',
      loan_payment_out: 'Платеж по кредиту',
      cc_repayment_out: 'Погашение кредитной карты',
      installment_payment_out: 'Платеж по рассрочке',
      fx_buy: 'Покупка валюты',
      fx_sell: 'Продажа валюты',
      invest_out: 'Инвестиции',
      invest_in: 'Доход от инвестиций',
      deposit_topup_out: 'Пополнение депозита',
      deposit_fx_topup_out: 'Пополнение валютного депозита',
      deposit_fx_withdraw_in: 'Снятие с валютного депозита',
      gold_buy_out: 'Покупка золота',
      gold_sell_in: 'Продажа золота'
    };
    return typeMap[type] || type || '—';
  };

  const getDirectionFromType = (type) => {
    // Определяем направление на основе типа операции
    if (type && type.endsWith('_in')) {
      return 'incoming';
    } else if (type && type.endsWith('_out')) {
      return 'outgoing';
    }
    
    // Fallback для старых данных
    return null;
  };

  if (isLoading) {
    return (
      <TransfersTableContainer>
        <div style={{ textAlign: 'center', padding: theme.spacing['2xl'] }}>
          Загрузка переводов...
        </div>
      </TransfersTableContainer>
    );
  }

  return (
    <TransfersTableContainer>
      <TableHeader>
        <TableTitle>Список переводов</TableTitle>
      </TableHeader>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Дата</Table.HeaderCell>
            <Table.HeaderCell>Тип</Table.HeaderCell>
            <Table.HeaderCell>Направление</Table.HeaderCell>
            <Table.HeaderCell>Сумма</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {transfers && transfers.length > 0 ? (
            transfers.map((transfer, index) => (
              <Table.Row 
                key={transfer.id || index} 
                clickable
                onClick={() => onTransferClick && onTransferClick(transfer)}
              >
                <Table.Cell>{formatDate(transfer.date || transfer.createdAt || new Date())}</Table.Cell>
                <Table.Cell>
                  <TransferType>
                    {getTypeText(transfer.type)}
                  </TransferType>
                </Table.Cell>
                <Table.Cell>
                  <TransferDirection direction={transfer.direction || getDirectionFromType(transfer.type)}>
                    {getDirectionText(transfer.type || transfer.direction)}
                  </TransferDirection>
                </Table.Cell>
                <Table.Cell>
                  <TransferAmount positive={transfer.amount > 0}>
                    {transfer.amount > 0 ? '+' : ''}{formatCurrency(transfer.amount, transfer.currency || 'KZT')}
                  </TransferAmount>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan="4">
                <Table.EmptyState>
                  <Table.EmptyStateIcon>💸</Table.EmptyStateIcon>
                  <Table.EmptyStateText>Переводы не найдены</Table.EmptyStateText>
                  <Table.EmptyStateSubtext>
                    Попробуйте изменить параметры поиска
                  </Table.EmptyStateSubtext>
                </Table.EmptyState>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </TransfersTableContainer>
  );
};

export default TransfersTable;

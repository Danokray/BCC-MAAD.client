import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { transactionsAPI } from '../services/api';
import { theme } from '../styles/theme';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const TransactionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing.md};
  }
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

const FiltersCard = styled(Card)`
  margin-bottom: ${theme.spacing.lg};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
  align-items: end;
`;

const FilterActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: flex-end;
  margin-top: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const TransactionsTable = styled(Card)`
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

const TransactionAmount = styled.span`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${props => props.positive ? theme.colors.success : theme.colors.error};
`;

const TransactionStatus = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => props.status === 'completed' && `
    background-color: ${theme.colors.success}15;
    color: ${theme.colors.success};
  `}

  ${props => props.status === 'pending' && `
    background-color: ${theme.colors.warning}15;
    color: ${theme.colors.warning};
  `}

  ${props => props.status === 'failed' && `
    background-color: ${theme.colors.error}15;
    color: ${theme.colors.error};
  `}
`;

const TransactionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid ${theme.colors.gray100};

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textSecondary};
`;

const DetailValue = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.textPrimary};
  text-align: right;
  max-width: 60%;
  word-break: break-word;
`;

const AddTransactionForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  });
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadTransactions();
  }, [filters]);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await transactionsAPI.getTransactions(filters);
      setTransactions(response.transactions || []);
    } catch (error) {
      console.error('Ошибка загрузки транзакций:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: ''
    });
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await transactionsAPI.createTransaction(newTransaction);
      setShowAddModal(false);
      setNewTransaction({
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
      });
      loadTransactions();
    } catch (error) {
      console.error('Ошибка добавления транзакции:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-KZ', {
      style: 'currency',
      currency: 'KZT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd.MM.yyyy', { locale: ru });
  };

  const formatDateTime = (dateString) => {
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: ru });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Завершена';
      case 'pending': return 'В обработке';
      case 'failed': return 'Ошибка';
      default: return 'Неизвестно';
    }
  };

  return (
    <TransactionsContainer>
      <PageHeader>
        <PageTitle>Транзакции</PageTitle>
        <Button 
          variant="primary" 
          onClick={() => setShowAddModal(true)}
        >
          Добавить транзакцию
        </Button>
      </PageHeader>

      <FiltersCard>
        <h3 style={{ margin: `0 0 ${theme.spacing.lg} 0` }}>Фильтры</h3>
        <FiltersGrid>
          <Input
            label="Поиск"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Поиск по описанию..."
          />
          <Input
            label="Категория"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            placeholder="Категория транзакции"
          />
          <Input
            label="Дата от"
            name="dateFrom"
            type="date"
            value={filters.dateFrom}
            onChange={handleFilterChange}
          />
          <Input
            label="Дата до"
            name="dateTo"
            type="date"
            value={filters.dateTo}
            onChange={handleFilterChange}
          />
          <Input
            label="Сумма от"
            name="amountMin"
            type="number"
            value={filters.amountMin}
            onChange={handleFilterChange}
            placeholder="0"
          />
          <Input
            label="Сумма до"
            name="amountMax"
            type="number"
            value={filters.amountMax}
            onChange={handleFilterChange}
            placeholder="1000000"
          />
        </FiltersGrid>
        <FilterActions>
          <Button variant="outline" onClick={clearFilters}>
            Очистить
          </Button>
          <Button variant="primary" onClick={loadTransactions}>
            Применить
          </Button>
        </FilterActions>
      </FiltersCard>

      <TransactionsTable>
        <TableHeader>
          <TableTitle>Список транзакций</TableTitle>
        </TableHeader>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: theme.spacing['2xl'] }}>
            Загрузка транзакций...
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Дата</Table.HeaderCell>
                <Table.HeaderCell>Описание</Table.HeaderCell>
                <Table.HeaderCell>Категория</Table.HeaderCell>
                <Table.HeaderCell align="right">Сумма</Table.HeaderCell>
                <Table.HeaderCell>Статус</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <Table.Row 
                    key={index} 
                    clickable
                    onClick={() => handleTransactionClick(transaction)}
                  >
                    <Table.Cell>{formatDate(transaction.date)}</Table.Cell>
                    <Table.Cell>{transaction.description || 'Транзакция'}</Table.Cell>
                    <Table.Cell>{transaction.category || '—'}</Table.Cell>
                    <Table.Cell align="right" numeric>
                      <TransactionAmount positive={transaction.amount > 0}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </TransactionAmount>
                    </Table.Cell>
                    <Table.Cell>
                      <TransactionStatus status={transaction.status || 'completed'}>
                        {getStatusText(transaction.status || 'completed')}
                      </TransactionStatus>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan="5">
                    <Table.EmptyState>
                      <Table.EmptyStateIcon>📋</Table.EmptyStateIcon>
                      <Table.EmptyStateText>Транзакции не найдены</Table.EmptyStateText>
                      <Table.EmptyStateSubtext>
                        Попробуйте изменить параметры поиска
                      </Table.EmptyStateSubtext>
                    </Table.EmptyState>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        )}
      </TransactionsTable>

      {/* Модальное окно деталей транзакции */}
      <Modal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        title="Детали транзакции"
        maxWidth="500px"
      >
        {selectedTransaction && (
          <TransactionDetails>
            <DetailRow>
              <DetailLabel>Дата и время:</DetailLabel>
              <DetailValue>{formatDateTime(selectedTransaction.date)}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Описание:</DetailLabel>
              <DetailValue>{selectedTransaction.description || '—'}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Категория:</DetailLabel>
              <DetailValue>{selectedTransaction.category || '—'}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Сумма:</DetailLabel>
              <DetailValue>
                <TransactionAmount positive={selectedTransaction.amount > 0}>
                  {selectedTransaction.amount > 0 ? '+' : ''}{formatCurrency(selectedTransaction.amount)}
                </TransactionAmount>
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Статус:</DetailLabel>
              <DetailValue>
                <TransactionStatus status={selectedTransaction.status || 'completed'}>
                  {getStatusText(selectedTransaction.status || 'completed')}
                </TransactionStatus>
              </DetailValue>
            </DetailRow>
            {selectedTransaction.reference && (
              <DetailRow>
                <DetailLabel>Номер операции:</DetailLabel>
                <DetailValue>{selectedTransaction.reference}</DetailValue>
              </DetailRow>
            )}
          </TransactionDetails>
        )}
      </Modal>

      {/* Модальное окно добавления транзакции */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Добавить транзакцию"
        maxWidth="500px"
      >
        <AddTransactionForm onSubmit={handleAddTransaction}>
          <FormRow>
            <Input
              label="Сумма"
              name="amount"
              type="number"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction(prev => ({
                ...prev,
                amount: e.target.value
              }))}
              placeholder="0"
              required
            />
            <Input
              label="Дата"
              name="date"
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction(prev => ({
                ...prev,
                date: e.target.value
              }))}
              required
            />
          </FormRow>
          <Input
            label="Описание"
            name="description"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction(prev => ({
              ...prev,
              description: e.target.value
            }))}
            placeholder="Описание транзакции"
            required
          />
          <Input
            label="Категория"
            name="category"
            value={newTransaction.category}
            onChange={(e) => setNewTransaction(prev => ({
              ...prev,
              category: e.target.value
            }))}
            placeholder="Категория транзакции"
          />
          <Modal.Footer border>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowAddModal(false)}
            >
              Отмена
            </Button>
            <Button type="submit" variant="primary">
              Добавить
            </Button>
          </Modal.Footer>
        </AddTransactionForm>
      </Modal>
    </TransactionsContainer>
  );
};

export default TransactionsPage;

import React, { useState, useEffect, useCallback } from 'react';
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

  ${props => props.status === 'cancelled' && `
    background-color: ${theme.colors.gray400}15;
    color: ${theme.colors.gray600};
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.lg};
  padding: ${theme.spacing.md} 0;
`;

const PaginationButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.borderRadius.lg};
  background-color: ${props => props.active ? theme.colors.primary : theme.colors.white};
  color: ${props => props.active ? theme.colors.white : theme.colors.textPrimary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 40px;

  &:hover {
    background-color: ${props => props.active ? theme.colors.primary : theme.colors.gray50};
    border-color: ${theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SmallPaginationButton = styled.button`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.white};
  color: ${theme.colors.textPrimary};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 32px;
  height: 32px;

  &:hover {
    background-color: ${theme.colors.gray50};
    border-color: ${theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaginationDots = styled.span`
  padding: ${theme.spacing.sm} ${theme.spacing.xs};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.sm};
  user-select: none;
`;

const PaginationInfo = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.textSecondary};
  margin: 0 ${theme.spacing.md};
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
    category: '',
    amount: '',
    currency: 'KZT',
    clientCode: ''
  });
  
  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Загружаем транзакции из API...');
      const response = await transactionsAPI.getTransactions();
      console.log('📊 Полный ответ API:', response);
      
      let transactionsData = Array.isArray(response) ? response : response.transactions || [];
      console.log('📋 Полученные данные:', transactionsData);
      
      if (transactionsData.length > 0) {
        console.log('📋 Первая транзакция (для анализа):', transactionsData[0]);
        console.log('📋 Поля первой транзакции:', Object.keys(transactionsData[0]));
      }
      
      // Нормализуем данные
      transactionsData = transactionsData.map(transaction => ({
        ...transaction,
        currency: (transaction.currency && 
                  transaction.currency !== 'string' && 
                  typeof transaction.currency === 'string' &&
                  ['KZT', 'USD', 'EUR', 'RUB'].includes(transaction.currency)) 
          ? transaction.currency 
          : 'KZT',
        status: transaction.status || 'completed',
        clientCode: transaction.clientCode || transaction.client_code || '—',
        amount: typeof transaction.amount === 'number' ? transaction.amount : parseFloat(transaction.amount) || 0
      }));
      
      console.log('✅ Финальные данные транзакций:', transactionsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('❌ Ошибка загрузки транзакций:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

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
      await transactionsAPI.addTransaction(newTransaction);
      setShowAddModal(false);
      setNewTransaction({
        category: '',
        amount: '',
        currency: 'KZT',
        clientCode: ''
      });
      loadTransactions();
    } catch (error) {
      console.error('Ошибка создания транзакции:', error);
    }
  };

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

  const formatDateTime = (dateString) => {
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: ru });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Завершена';
      case 'success': return 'Завершена';
      case 'pending': return 'В обработке';
      case 'processing': return 'В обработке';
      case 'failed': return 'Ошибка';
      case 'error': return 'Ошибка';
      case 'cancelled': return 'Отменена';
      case 'canceled': return 'Отменена';
      default: return 'Завершена';
    }
  };

  const getCategoryText = (category) => {
    const categories = {
      food: 'Питание',
      transport: 'Транспорт',
      shopping: 'Покупки',
      entertainment: 'Развлечения',
      utilities: 'Коммунальные услуги',
      healthcare: 'Здравоохранение',
      education: 'Образование',
      salary: 'Зарплата',
      other: 'Другое'
    };
    return categories[category] || category || '—';
  };

  const getDescription = (transaction) => {
    if (transaction.amount > 0) {
      return 'Зарплата';
    } else {
      const categoryDescriptions = {
        food: 'Покупка в супермаркете',
        transport: 'Оплата проезда',
        shopping: 'Покупка товаров',
        entertainment: 'Развлечения',
        utilities: 'Коммунальные услуги',
        healthcare: 'Медицинские услуги',
        education: 'Образование',
        other: 'Прочие расходы'
      };
      return categoryDescriptions[transaction.category] || 'Транзакция';
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(transaction => 
        getDescription(transaction).toLowerCase().includes(searchLower) ||
        getCategoryText(transaction.category).toLowerCase().includes(searchLower) ||
        transaction.clientCode.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(transaction => transaction.category === filters.category);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date || transaction.createdAt || new Date());
        return transactionDate >= new Date(filters.dateFrom);
      });
    }

    if (filters.dateTo) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date || transaction.createdAt || new Date());
        return transactionDate <= new Date(filters.dateTo + 'T23:59:59');
      });
    }

    if (filters.amountMin) {
      filtered = filtered.filter(transaction => Math.abs(transaction.amount) >= parseFloat(filters.amountMin));
    }

    if (filters.amountMax) {
      filtered = filtered.filter(transaction => Math.abs(transaction.amount) <= parseFloat(filters.amountMax));
    }

    return filtered;
  };

  const filteredTransactions = applyFilters();

  // Пагинация
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Сброс пагинации при изменении фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Функция для генерации умной пагинации
  const generatePaginationPages = () => {
    const pages = [];
    const maxVisiblePages = 3; // Показываем максимум 3 страницы вокруг текущей
    
    if (totalPages <= 7) {
      // Если страниц мало, показываем все
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Всегда показываем первую страницу
      pages.push(1);
      
      if (currentPage <= 4) {
        // Если мы в начале (страницы 1-4)
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Если мы в конце (последние 4 страницы)
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Если мы в середине
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const categories = [
    { value: 'food', label: 'Питание' },
    { value: 'transport', label: 'Транспорт' },
    { value: 'shopping', label: 'Покупки' },
    { value: 'entertainment', label: 'Развлечения' },
    { value: 'utilities', label: 'Коммунальные услуги' },
    { value: 'healthcare', label: 'Здравоохранение' },
    { value: 'education', label: 'Образование' },
    { value: 'salary', label: 'Зарплата' },
    { value: 'other', label: 'Другое' }
  ];

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
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.xs
            }}>
              Категория
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              style={{
                width: '100%',
                padding: theme.spacing.sm,
                border: `1px solid ${theme.colors.gray300}`,
                borderRadius: theme.borderRadius.lg,
                fontSize: theme.typography.fontSize.base,
                fontFamily: theme.typography.fontFamily,
                backgroundColor: theme.colors.white,
                minHeight: '44px'
              }}
            >
              <option value="">Все категории</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
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
              {currentTransactions.length > 0 ? (
                currentTransactions.map((transaction, index) => (
                  <Table.Row 
                    key={transaction.id || index} 
                    clickable
                    onClick={() => handleTransactionClick(transaction)}
                  >
                    <Table.Cell>{formatDate(transaction.date || transaction.createdAt || new Date())}</Table.Cell>
                    <Table.Cell>{getDescription(transaction)}</Table.Cell>
                    <Table.Cell>{getCategoryText(transaction.category)}</Table.Cell>
                    <Table.Cell align="right" numeric>
                      <TransactionAmount positive={transaction.amount > 0}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount, transaction.currency || 'KZT')}
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
                      <Table.EmptyStateIcon>💳</Table.EmptyStateIcon>
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
        
        {/* Пагинация */}
        {filteredTransactions.length > itemsPerPage && (
          <PaginationContainer>
            {/* Маленькие кнопки назад/вперед */}
            <SmallPaginationButton 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
              title="Предыдущая страница"
            >
              ←
            </SmallPaginationButton>
            
            {/* Основные кнопки страниц */}
            {generatePaginationPages().map((page, index) => (
              page === '...' ? (
                <PaginationDots key={`dots-${index}`}>...</PaginationDots>
              ) : (
                <PaginationButton
                  key={page}
                  active={currentPage === page}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </PaginationButton>
              )
            ))}
            
            {/* Маленькие кнопки назад/вперед */}
            <SmallPaginationButton 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
              title="Следующая страница"
            >
              →
            </SmallPaginationButton>
            
            <PaginationInfo>
              Показано {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} из {filteredTransactions.length}
            </PaginationInfo>
          </PaginationContainer>
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
              <DetailValue>{formatDateTime(selectedTransaction.date || selectedTransaction.createdAt || new Date())}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Описание:</DetailLabel>
              <DetailValue>{getDescription(selectedTransaction)}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Категория:</DetailLabel>
              <DetailValue>{getCategoryText(selectedTransaction.category)}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Код клиента:</DetailLabel>
              <DetailValue>{selectedTransaction.clientCode || '—'}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Сумма:</DetailLabel>
              <DetailValue>
                <TransactionAmount positive={selectedTransaction.amount > 0}>
                  {selectedTransaction.amount > 0 ? '+' : ''}{formatCurrency(selectedTransaction.amount, selectedTransaction.currency || 'KZT')}
                </TransactionAmount>
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Валюта:</DetailLabel>
              <DetailValue>{selectedTransaction.currency && selectedTransaction.currency !== 'string' ? selectedTransaction.currency : 'KZT'}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Статус:</DetailLabel>
              <DetailValue>
                <TransactionStatus status={selectedTransaction.status || 'completed'}>
                  {getStatusText(selectedTransaction.status || 'completed')}
                </TransactionStatus>
              </DetailValue>
            </DetailRow>
            {selectedTransaction.id && (
              <DetailRow>
                <DetailLabel>ID транзакции:</DetailLabel>
                <DetailValue>{selectedTransaction.id}</DetailValue>
              </DetailRow>
            )}
          </TransactionDetails>
        )}
      </Modal>

      {/* Модальное окно создания транзакции */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Добавить транзакцию"
        maxWidth="500px"
      >
        <AddTransactionForm onSubmit={handleAddTransaction}>
          <FormRow>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.textPrimary,
                marginBottom: theme.spacing.xs
              }}>
                Категория *
              </label>
              <select
                name="category"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction(prev => ({
                  ...prev,
                  category: e.target.value
                }))}
                style={{
                  width: '100%',
                  padding: theme.spacing.sm,
                  border: `1px solid ${theme.colors.gray300}`,
                  borderRadius: theme.borderRadius.lg,
                  fontSize: theme.typography.fontSize.base,
                  fontFamily: theme.typography.fontFamily,
                  backgroundColor: theme.colors.white,
                  minHeight: '44px'
                }}
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Сумма *"
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
          </FormRow>
          
          <FormRow>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.textPrimary,
                marginBottom: theme.spacing.xs
              }}>
                Валюта *
              </label>
              <select
                name="currency"
                value={newTransaction.currency}
                onChange={(e) => setNewTransaction(prev => ({
                  ...prev,
                  currency: e.target.value
                }))}
                style={{
                  width: '100%',
                  padding: theme.spacing.sm,
                  border: `1px solid ${theme.colors.gray300}`,
                  borderRadius: theme.borderRadius.lg,
                  fontSize: theme.typography.fontSize.base,
                  fontFamily: theme.typography.fontFamily,
                  backgroundColor: theme.colors.white,
                  minHeight: '44px'
                }}
                required
              >
                <option value="KZT">KZT (Тенге)</option>
                <option value="USD">USD (Доллар)</option>
                <option value="EUR">EUR (Евро)</option>
                <option value="RUB">RUB (Рубль)</option>
              </select>
            </div>
            <Input
              label="Код клиента *"
              name="clientCode"
              value={newTransaction.clientCode}
              onChange={(e) => setNewTransaction(prev => ({
                ...prev,
                clientCode: e.target.value
              }))}
              placeholder="Введите код клиента"
              required
            />
          </FormRow>
          
          <Modal.Footer border>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowAddModal(false)}
            >
              Отмена
            </Button>
            <Button type="submit" variant="primary">
              Добавить транзакцию
            </Button>
          </Modal.Footer>
        </AddTransactionForm>
      </Modal>
    </TransactionsContainer>
  );
};

export default TransactionsPage;
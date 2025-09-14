import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { transfersAPI } from '../services/api';
import { theme } from '../styles/theme';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import TransfersTable from '../components/TransfersTable';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const TransfersContainer = styled.div`
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

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: ${theme.spacing.sm};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.sm};
  }
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

const TransfersTableCard = styled(Card)`
  overflow: hidden;
`;

const ErrorMessage = styled.div`
  background-color: ${theme.colors.error}15;
  border: 1px solid ${theme.colors.error}30;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.error};
  font-size: ${theme.typography.fontSize.sm};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const TransferDetails = styled.div`
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

// Стили для пагинации
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.lg};
  padding: ${theme.spacing.md} 0;
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.xs};
    padding: ${theme.spacing.sm} 0;
  }
`;

const PaginationButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.gray300};
  background: ${props => props.active ? theme.colors.primary : theme.colors.white};
  color: ${props => props.active ? theme.colors.white : theme.colors.textPrimary};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: ${props => props.active ? theme.colors.primary : theme.colors.gray50};
    border-color: ${props => props.active ? theme.colors.primary : theme.colors.gray400};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    min-width: 36px;
    height: 36px;
    font-size: ${theme.typography.fontSize.xs};
  }
`;

const SmallPaginationButton = styled(PaginationButton)`
  padding: ${theme.spacing.sm};
  min-width: 40px;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xs};
    min-width: 36px;
  }
`;

const PaginationDots = styled.span`
  padding: ${theme.spacing.sm} ${theme.spacing.xs};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;

  @media (max-width: ${theme.breakpoints.sm}) {
    min-width: 36px;
    height: 36px;
    font-size: ${theme.typography.fontSize.xs};
  }
`;

const PaginationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.textSecondary};
  margin-top: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.fontSize.xs};
    flex-direction: column;
    gap: ${theme.spacing.xs};
    text-align: center;
  }
`;


const TransfersPage = () => {
  const [transfers, setTransfers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    direction: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  });
  
  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadTransfers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔄 Загружаем переводы из API...');
      const response = await transfersAPI.getTransfers();
      console.log('📊 Полный ответ API:', response);
      
      let transfersData = Array.isArray(response) ? response : response.transfers || [];
      console.log('📋 Полученные данные:', transfersData);
      
      if (transfersData.length > 0) {
        console.log('📋 Первый перевод (для анализа):', transfersData[0]);
        console.log('📋 Поля первого перевода:', Object.keys(transfersData[0]));
      }
      
      // Нормализуем данные
      transfersData = transfersData.map(transfer => ({
        ...transfer,
        currency: (transfer.currency && 
                  transfer.currency !== 'string' && 
                  typeof transfer.currency === 'string' &&
                  ['KZT', 'USD', 'EUR', 'RUB'].includes(transfer.currency)) 
          ? transfer.currency 
          : 'KZT',
        clientCode: transfer.clientCode || transfer.client_code || '—',
        amount: typeof transfer.amount === 'number' ? transfer.amount : parseFloat(transfer.amount) || 0,
        direction: transfer.direction || (transfer.amount > 0 ? 'incoming' : 'outgoing'),
        type: transfer.type || 'internal'
      }));
      
      console.log('✅ Финальные данные переводов:', transfersData);
      setTransfers(transfersData);
    } catch (error) {
      console.error('❌ Ошибка загрузки переводов:', error);
      setError(error.message || 'Ошибка загрузки переводов');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransfers();
  }, [loadTransfers]);

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
      type: '',
      direction: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: ''
    });
  };

  const handleTransferClick = (transfer) => {
    setSelectedTransfer(transfer);
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

  const formatDateTime = (dateString) => {
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: ru });
  };



  const applyFilters = () => {
    let filtered = [...transfers];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(transfer => 
        transfer.clientCode.toLowerCase().includes(searchLower) ||
        getTypeText(transfer.type).toLowerCase().includes(searchLower) ||
        getDirectionText(transfer.direction).toLowerCase().includes(searchLower)
      );
    }

    if (filters.type) {
      filtered = filtered.filter(transfer => transfer.type === filters.type);
    }

    if (filters.direction) {
      filtered = filtered.filter(transfer => {
        // Определяем направление на основе типа операции
        const transferDirection = transfer.type && transfer.type.endsWith('_in') ? 'incoming' : 
                                 transfer.type && transfer.type.endsWith('_out') ? 'outgoing' : 
                                 transfer.direction;
        return transferDirection === filters.direction;
      });
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(transfer => {
        const transferDate = new Date(transfer.date || transfer.createdAt || new Date());
        return transferDate >= new Date(filters.dateFrom);
      });
    }

    if (filters.dateTo) {
      filtered = filtered.filter(transfer => {
        const transferDate = new Date(transfer.date || transfer.createdAt || new Date());
        return transferDate <= new Date(filters.dateTo + 'T23:59:59');
      });
    }

    if (filters.amountMin) {
      filtered = filtered.filter(transfer => Math.abs(transfer.amount) >= parseFloat(filters.amountMin));
    }

    if (filters.amountMax) {
      filtered = filtered.filter(transfer => Math.abs(transfer.amount) <= parseFloat(filters.amountMax));
    }

    return filtered;
  };

  const filteredTransfers = applyFilters();

  // Пагинация
  const totalPages = Math.ceil(filteredTransfers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransfers = filteredTransfers.slice(startIndex, endIndex);

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

  const types = [
    { value: 'salary_in', label: 'Зарплата' },
    { value: 'stipend_in', label: 'Стипендия' },
    { value: 'family_in', label: 'Перевод от семьи' },
    { value: 'cashback_in', label: 'Кэшбэк' },
    { value: 'refund_in', label: 'Возврат средств' },
    { value: 'card_in', label: 'Пополнение карты' },
    { value: 'p2p_out', label: 'Перевод P2P' },
    { value: 'card_out', label: 'Оплата картой' },
    { value: 'atm_withdrawal', label: 'Снятие в банкомате' },
    { value: 'utilities_out', label: 'Оплата коммунальных услуг' },
    { value: 'loan_payment_out', label: 'Платеж по кредиту' },
    { value: 'cc_repayment_out', label: 'Погашение кредитной карты' },
    { value: 'installment_payment_out', label: 'Платеж по рассрочке' },
    { value: 'fx_buy', label: 'Покупка валюты' },
    { value: 'fx_sell', label: 'Продажа валюты' },
    { value: 'invest_out', label: 'Инвестиции' },
    { value: 'invest_in', label: 'Доход от инвестиций' },
    { value: 'deposit_topup_out', label: 'Пополнение депозита' },
    { value: 'deposit_fx_topup_out', label: 'Пополнение валютного депозита' },
    { value: 'deposit_fx_withdraw_in', label: 'Снятие с валютного депозита' },
    { value: 'gold_buy_out', label: 'Покупка золота' },
    { value: 'gold_sell_in', label: 'Продажа золота' }
  ];

  const directions = [
    { value: 'incoming', label: 'Поступление' },
    { value: 'outgoing', label: 'Исходящий' }
  ];

  return (
    <TransfersContainer>
      <PageHeader>
        <PageTitle>Переводы</PageTitle>
      </PageHeader>

      {error && (
        <ErrorMessage>
          <span>⚠️</span>
          {error}
        </ErrorMessage>
      )}

      <FiltersCard>
        <h3 style={{ margin: `0 0 ${theme.spacing.lg} 0` }}>Фильтры</h3>
        <FiltersGrid>
          <Input
            label="Поиск"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Поиск по коду клиента..."
          />
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.xs
            }}>
              Тип
            </label>
            <select
              name="type"
              value={filters.type}
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
              <option value="">Все типы</option>
              {types.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.xs
            }}>
              Направление
            </label>
            <select
              name="direction"
              value={filters.direction}
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
              <option value="">Все направления</option>
              {directions.map(direction => (
                <option key={direction.value} value={direction.value}>
                  {direction.label}
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
          <Button variant="primary" onClick={loadTransfers}>
            Применить
          </Button>
        </FilterActions>
      </FiltersCard>

      <TransfersTableCard>
        <TransfersTable 
          transfers={currentTransfers}
          isLoading={isLoading}
          onTransferClick={handleTransferClick}
        />
        
        {/* Пагинация */}
        {filteredTransfers.length > itemsPerPage && (
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
            
          </PaginationContainer>
        )}
        
        {/* Информация о пагинации */}
        {filteredTransfers.length > 0 && (
          <PaginationInfo>
            <span>
              Показано {startIndex + 1}-{Math.min(endIndex, filteredTransfers.length)} из {filteredTransfers.length} переводов
            </span>
            <span>
              Страница {currentPage} из {totalPages}
            </span>
          </PaginationInfo>
        )}
      </TransfersTableCard>

      {/* Модальное окно деталей перевода */}
      <Modal
        isOpen={!!selectedTransfer}
        onClose={() => setSelectedTransfer(null)}
        title="Детали перевода"
        maxWidth="500px"
      >
        {selectedTransfer && (
          <TransferDetails>
            <DetailRow>
              <DetailLabel>ID:</DetailLabel>
              <DetailValue>{selectedTransfer.id || '—'}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Дата и время:</DetailLabel>
              <DetailValue>{formatDateTime(selectedTransfer.date || selectedTransfer.createdAt || new Date())}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Тип:</DetailLabel>
              <DetailValue>
                <TransferType>
                  {getTypeText(selectedTransfer.type)}
                </TransferType>
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Направление:</DetailLabel>
              <DetailValue>
                <TransferDirection direction={selectedTransfer.direction}>
                  {getDirectionText(selectedTransfer.direction)}
                </TransferDirection>
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Код клиента:</DetailLabel>
              <DetailValue>{selectedTransfer.clientCode || '—'}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Сумма:</DetailLabel>
              <DetailValue>
                <TransferAmount positive={selectedTransfer.amount > 0}>
                  {selectedTransfer.amount > 0 ? '+' : ''}{formatCurrency(selectedTransfer.amount, selectedTransfer.currency || 'KZT')}
                </TransferAmount>
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Валюта:</DetailLabel>
              <DetailValue>{selectedTransfer.currency && selectedTransfer.currency !== 'string' ? selectedTransfer.currency : 'KZT'}</DetailValue>
            </DetailRow>
          </TransferDetails>
        )}
      </Modal>
    </TransfersContainer>
  );
};

export default TransfersPage;
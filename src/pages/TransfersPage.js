import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { transfersAPI } from '../services/api';
import { theme } from '../styles/theme';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
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

const TransfersTable = styled(Card)`
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
  color: ${props => props.type === 'outgoing' ? theme.colors.error : theme.colors.success};
`;

const TransferStatus = styled.span`
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

const AddTransferForm = styled.form`
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

const TransferTypeSelector = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`;

const TypeButton = styled.button`
  flex: 1;
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.gray300};
  border-radius: ${theme.borderRadius.lg};
  background-color: ${theme.colors.white};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.active && `
    border-color: ${theme.colors.primary};
    background-color: ${theme.colors.primary}10;
    color: ${theme.colors.primary};
  `}

  &:hover {
    border-color: ${theme.colors.primary};
  }
`;

const TransfersPage = () => {
  const [transfers, setTransfers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  });
  const [newTransfer, setNewTransfer] = useState({
    type: 'outgoing',
    amount: '',
    recipient: '',
    recipient_account: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const loadTransfers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await transfersAPI.getTransfers(filters);
      setTransfers(response.transfers || []);
    } catch (error) {
      console.error('Ошибка загрузки переводов:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

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
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: ''
    });
  };

  const handleTransferClick = (transfer) => {
    setSelectedTransfer(transfer);
  };

  const handleAddTransfer = async (e) => {
    e.preventDefault();
    try {
      await transfersAPI.createTransfer(newTransfer);
      setShowAddModal(false);
      setNewTransfer({
        type: 'outgoing',
        amount: '',
        recipient: '',
        recipient_account: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      loadTransfers();
    } catch (error) {
      console.error('Ошибка создания перевода:', error);
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
      case 'completed': return 'Завершен';
      case 'pending': return 'В обработке';
      case 'failed': return 'Ошибка';
      case 'cancelled': return 'Отменен';
      default: return 'Неизвестно';
    }
  };

  const getTransferTypeText = (type) => {
    return type === 'outgoing' ? 'Исходящий' : 'Входящий';
  };

  return (
    <TransfersContainer>
      <PageHeader>
        <PageTitle>Переводы</PageTitle>
        <Button 
          variant="primary" 
          onClick={() => setShowAddModal(true)}
        >
          Создать перевод
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
            placeholder="Поиск по получателю..."
          />
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.xs
            }}>
              Тип перевода
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
              <option value="outgoing">Исходящие</option>
              <option value="incoming">Входящие</option>
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

      <TransfersTable>
        <TableHeader>
          <TableTitle>Список переводов</TableTitle>
        </TableHeader>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: theme.spacing['2xl'] }}>
            Загрузка переводов...
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Дата</Table.HeaderCell>
                <Table.HeaderCell>Тип</Table.HeaderCell>
                <Table.HeaderCell>Получатель</Table.HeaderCell>
                <Table.HeaderCell>Описание</Table.HeaderCell>
                <Table.HeaderCell align="right">Сумма</Table.HeaderCell>
                <Table.HeaderCell>Статус</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {transfers.length > 0 ? (
                transfers.map((transfer, index) => (
                  <Table.Row 
                    key={index} 
                    clickable
                    onClick={() => handleTransferClick(transfer)}
                  >
                    <Table.Cell>{formatDate(transfer.date)}</Table.Cell>
                    <Table.Cell>{getTransferTypeText(transfer.type)}</Table.Cell>
                    <Table.Cell>{transfer.recipient || '—'}</Table.Cell>
                    <Table.Cell>{transfer.description || '—'}</Table.Cell>
                    <Table.Cell align="right" numeric>
                      <TransferAmount type={transfer.type}>
                        {transfer.type === 'outgoing' ? '-' : '+'}{formatCurrency(transfer.amount)}
                      </TransferAmount>
                    </Table.Cell>
                    <Table.Cell>
                      <TransferStatus status={transfer.status || 'completed'}>
                        {getStatusText(transfer.status || 'completed')}
                      </TransferStatus>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan="6">
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
        )}
      </TransfersTable>

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
              <DetailLabel>Дата и время:</DetailLabel>
              <DetailValue>{formatDateTime(selectedTransfer.date)}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Тип перевода:</DetailLabel>
              <DetailValue>{getTransferTypeText(selectedTransfer.type)}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Получатель:</DetailLabel>
              <DetailValue>{selectedTransfer.recipient || '—'}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Счет получателя:</DetailLabel>
              <DetailValue>{selectedTransfer.recipient_account || '—'}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Описание:</DetailLabel>
              <DetailValue>{selectedTransfer.description || '—'}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Сумма:</DetailLabel>
              <DetailValue>
                <TransferAmount type={selectedTransfer.type}>
                  {selectedTransfer.type === 'outgoing' ? '-' : '+'}{formatCurrency(selectedTransfer.amount)}
                </TransferAmount>
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Статус:</DetailLabel>
              <DetailValue>
                <TransferStatus status={selectedTransfer.status || 'completed'}>
                  {getStatusText(selectedTransfer.status || 'completed')}
                </TransferStatus>
              </DetailValue>
            </DetailRow>
            {selectedTransfer.reference && (
              <DetailRow>
                <DetailLabel>Номер операции:</DetailLabel>
                <DetailValue>{selectedTransfer.reference}</DetailValue>
              </DetailRow>
            )}
          </TransferDetails>
        )}
      </Modal>

      {/* Модальное окно создания перевода */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Создать перевод"
        maxWidth="500px"
      >
        <AddTransferForm onSubmit={handleAddTransfer}>
          <TransferTypeSelector>
            <TypeButton
              type="button"
              active={newTransfer.type === 'outgoing'}
              onClick={() => setNewTransfer(prev => ({ ...prev, type: 'outgoing' }))}
            >
              Исходящий
            </TypeButton>
            <TypeButton
              type="button"
              active={newTransfer.type === 'incoming'}
              onClick={() => setNewTransfer(prev => ({ ...prev, type: 'incoming' }))}
            >
              Входящий
            </TypeButton>
          </TransferTypeSelector>

          <FormRow>
            <Input
              label="Сумма"
              name="amount"
              type="number"
              value={newTransfer.amount}
              onChange={(e) => setNewTransfer(prev => ({
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
              value={newTransfer.date}
              onChange={(e) => setNewTransfer(prev => ({
                ...prev,
                date: e.target.value
              }))}
              required
            />
          </FormRow>
          
          <Input
            label="Получатель"
            name="recipient"
            value={newTransfer.recipient}
            onChange={(e) => setNewTransfer(prev => ({
              ...prev,
              recipient: e.target.value
            }))}
            placeholder="Имя получателя"
            required
          />
          
          <Input
            label="Счет получателя"
            name="recipient_account"
            value={newTransfer.recipient_account}
            onChange={(e) => setNewTransfer(prev => ({
              ...prev,
              recipient_account: e.target.value
            }))}
            placeholder="Номер счета или карты"
            required
          />
          
          <Input
            label="Описание"
            name="description"
            value={newTransfer.description}
            onChange={(e) => setNewTransfer(prev => ({
              ...prev,
              description: e.target.value
            }))}
            placeholder="Назначение перевода"
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
              Создать перевод
            </Button>
          </Modal.Footer>
        </AddTransferForm>
      </Modal>
    </TransfersContainer>
  );
};

export default TransfersPage;

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { clientAPI, transactionsAPI, pushAPI } from '../services/api';
import { theme } from '../styles/theme';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const WelcomeSection = styled.div`
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

const WelcomeText = styled.div`
  h1 {
    font-size: ${theme.typography.fontSize['3xl']};
    font-weight: ${theme.typography.fontWeight.bold};
    color: ${theme.colors.textPrimary};
    margin: 0 0 ${theme.spacing.xs} 0;
  }

  p {
    font-size: ${theme.typography.fontSize.lg};
    color: ${theme.colors.textSecondary};
    margin: 0;
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    width: 100%;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

const StatCard = styled(Card)`
  text-align: center;
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${theme.colors.gradients.primary};
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${theme.shadows['2xl']}, ${theme.shadows.glow};
    background: rgba(255, 255, 255, 0.95);
  }
`;

const StatIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing.md};
  font-size: ${theme.typography.fontSize['2xl']};
  color: ${theme.colors.white};
  box-shadow: ${theme.shadows.md}, ${theme.shadows.glow};
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: ${theme.shadows.lg}, ${theme.shadows.glowDark};
  }
`;

const StatValue = styled.div`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const RecentTransactions = styled(Card)`
  h3 {
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.textPrimary};
    margin: 0 0 ${theme.spacing.lg} 0;
  }
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md} 0;
  border-bottom: 1px solid ${theme.colors.gray100};

  &:last-child {
    border-bottom: none;
  }
`;

const TransactionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const TransactionDescription = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textPrimary};
`;

const TransactionDate = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.textSecondary};
`;

const TransactionAmount = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${props => props.positive ? theme.colors.success : theme.colors.error};
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const PushNotification = styled(Card)`
  background: linear-gradient(135deg, ${theme.colors.primary}05 0%, ${theme.colors.primaryLight}05 100%);
  border: 1px solid ${theme.colors.primary}20;
`;

const PushHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
`;

const PushTitle = styled.h4`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.primary};
  margin: 0;
`;

const PushContent = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.textSecondary};
  margin: 0 0 ${theme.spacing.md} 0;
  line-height: ${theme.typography.lineHeight.relaxed};
`;

const RecommendationCard = styled(Card)`
  background: linear-gradient(135deg, ${theme.colors.secondary}05 0%, ${theme.colors.warning}05 100%);
  border: 1px solid ${theme.colors.secondary}20;
`;

const RecommendationTitle = styled.h4`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.secondary};
  margin: 0 0 ${theme.spacing.md} 0;
`;

const RecommendationText = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.textSecondary};
  margin: 0 0 ${theme.spacing.md} 0;
  line-height: ${theme.typography.lineHeight.relaxed};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing['2xl']} 0;
  color: ${theme.colors.textSecondary};
`;

const EmptyStateIcon = styled.div`
  font-size: ${theme.typography.fontSize['3xl']};
  margin-bottom: ${theme.spacing.md};
  opacity: 0.5;
`;

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [latestPush, setLatestPush] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Загружаем данные параллельно
        const [profileData, balanceData, transactionsData, pushData] = await Promise.all([
          clientAPI.getProfile(),
          clientAPI.getBalance(),
          transactionsAPI.getTransactions({ limit: 5 }),
          pushAPI.getLatestPush()
        ]);

        setProfile(profileData);
        setBalance(balanceData);
        setRecentTransactions(transactionsData.transactions || []);
        setLatestPush(pushData);

        // Загружаем рекомендации если есть код клиента
        if (user?.client_code) {
          try {
            const recommendationData = await pushAPI.getRecommendation(user.client_code);
            setRecommendation(recommendationData);
          } catch (error) {
            console.log('Рекомендации недоступны');
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const handleGeneratePush = async () => {
    try {
      const newPush = await pushAPI.generatePush();
      setLatestPush(newPush);
    } catch (error) {
      console.error('Ошибка генерации пуша:', error);
    }
  };

  const handleTopUp = () => {
    // Переход на страницу пополнения (можно создать отдельную страницу или модальное окно)
    alert('Функция пополнения будет доступна в следующей версии');
  };

  const handleTransfer = () => {
    // Переход на страницу переводов
    navigate('/transfers');
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

  if (isLoading) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: theme.spacing['2xl'] }}>
          Загрузка данных...
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeText>
          <h1>Добро пожаловать, {user?.name || user?.client_code}!</h1>
          <p>Управляйте своими финансами с Bank Center Credit</p>
        </WelcomeText>
        <QuickActions>
          <Button variant="primary" size="sm" onClick={handleTopUp}>
            Пополнить
          </Button>
          <Button variant="outline" size="sm" onClick={handleTransfer}>
            Перевести
          </Button>
        </QuickActions>
      </WelcomeSection>

      <StatsGrid>
        <StatCard>
          <StatIcon>💰</StatIcon>
          <StatValue>{formatCurrency(balance?.current_balance || 0)}</StatValue>
          <StatLabel>Текущий баланс</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>📊</StatIcon>
          <StatValue>{formatCurrency(profile?.average_balance || 0)}</StatValue>
          <StatLabel>Средний баланс</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>📈</StatIcon>
          <StatValue>{recentTransactions.length}</StatValue>
          <StatLabel>Транзакций за месяц</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>👤</StatIcon>
          <StatValue>{profile?.age || '—'}</StatValue>
          <StatLabel>Возраст</StatLabel>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <RecentTransactions>
          <h3>Последние транзакции</h3>
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction, index) => (
              <TransactionItem key={index}>
                <TransactionInfo>
                  <TransactionDescription>
                    {transaction.description || transaction.category || 'Транзакция'}
                  </TransactionDescription>
                  <TransactionDate>
                    {formatDate(transaction.date)}
                  </TransactionDate>
                </TransactionInfo>
                <TransactionAmount positive={transaction.amount > 0}>
                  {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                </TransactionAmount>
              </TransactionItem>
            ))
          ) : (
            <EmptyState>
              <EmptyStateIcon>📋</EmptyStateIcon>
              <p>Нет транзакций</p>
            </EmptyState>
          )}
        </RecentTransactions>

        <Sidebar>
          {latestPush && (
            <PushNotification>
              <PushHeader>
                <PushTitle>Последнее уведомление</PushTitle>
              </PushHeader>
              <PushContent>{latestPush.message}</PushContent>
              <Button 
                variant="outline" 
                size="sm" 
                fullWidth
                onClick={handleGeneratePush}
              >
                Сгенерировать новое
              </Button>
            </PushNotification>
          )}

          {recommendation && (
            <RecommendationCard>
              <RecommendationTitle>Рекомендация для вас</RecommendationTitle>
              <RecommendationText>
                {recommendation.push_text}
              </RecommendationText>
              <Button variant="secondary" size="sm" fullWidth>
                Узнать больше
              </Button>
            </RecommendationCard>
          )}
        </Sidebar>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default DashboardPage;

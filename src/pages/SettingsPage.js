import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { clientAPI, pushAPI } from '../services/api';
import { useToast } from '../components/ui/Toast';
import { theme } from '../styles/theme';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const PageHeader = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const ProfileCard = styled(Card)`
  h3 {
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.textPrimary};
    margin: 0 0 ${theme.spacing.lg} 0;
  }
`;


const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid ${theme.colors.gray100};

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textSecondary};
`;

const InfoValue = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.textPrimary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const NotificationsCard = styled(Card)`
  h3 {
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.textPrimary};
    margin: 0 0 ${theme.spacing.lg} 0;
  }
`;

const NotificationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md} 0;
  border-bottom: 1px solid ${theme.colors.gray100};

  &:last-child {
    border-bottom: none;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const ToggleStatus = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  color: ${props => props.enabled ? theme.colors.success : theme.colors.textMuted};
  font-weight: ${theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const NotificationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const NotificationTitle = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textPrimary};
`;

const NotificationDescription = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.textSecondary};
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
  }

  &:checked + span:before {
    transform: translateX(24px);
  }

  &:disabled + span {
    opacity: 0.8;
    cursor: not-allowed;
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.disabled ? theme.colors.gray300 : theme.colors.gray300};
  transition: 0.2s;
  border-radius: 24px;
  opacity: ${props => props.disabled ? 0.8 : 1};
  border: 1px solid ${props => props.disabled ? theme.colors.gray400 : 'transparent'};

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.2s;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

const SecurityCard = styled(Card)`
  h3 {
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.textPrimary};
    margin: 0 0 ${theme.spacing.lg} 0;
  }
`;

const SecurityActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const SecurityAction = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.lg};
  background-color: ${theme.colors.gray50};
`;

const SecurityInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const SecurityTitle = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textPrimary};
`;

const SecurityDescription = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.textSecondary};
`;

const DangerZone = styled(Card)`
  border: 1px solid ${theme.colors.error}30;
  background-color: ${theme.colors.error}05;
  
  h3 {
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.error};
    margin: 0 0 ${theme.spacing.lg} 0;
  }
`;

const DangerActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const DangerAction = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.error}30;
  border-radius: ${theme.borderRadius.lg};
  background-color: ${theme.colors.white};
`;

const DangerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const DangerTitle = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textPrimary};
`;

const DangerDescription = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.textSecondary};
`;

const ChangePasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    security: true
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [updatingNotifications, setUpdatingNotifications] = useState(false);

  useEffect(() => {
    const loadSettingsData = async () => {
      try {
        setIsLoading(true);
        
        // Загружаем данные профиля, баланса и настроек уведомлений параллельно
        const [profileData, balanceData, notificationSettingsData] = await Promise.allSettled([
          clientAPI.getProfile(),
          clientAPI.getBalance(),
          clientAPI.getNotificationSettings().catch(() => null) // Игнорируем ошибки, если API недоступно
        ]);

        // Обрабатываем данные профиля
        if (profileData.status === 'fulfilled') {
          console.log('✅ Профиль загружен в настройках:', profileData.value);
          setProfile(profileData.value);
        } else {
          console.error('❌ Ошибка загрузки профиля в настройках:', profileData.reason);
        }

        // Обрабатываем данные баланса
        if (balanceData.status === 'fulfilled') {
          console.log('✅ Баланс загружен в настройках:', balanceData.value);
          setBalance(balanceData.value);
        } else {
          console.error('❌ Ошибка загрузки баланса в настройках:', balanceData.reason);
        }

        // Обрабатываем настройки уведомлений
        if (notificationSettingsData.status === 'fulfilled' && notificationSettingsData.value) {
          console.log('✅ Настройки уведомлений загружены:', notificationSettingsData.value);
          setNotifications(notificationSettingsData.value);
        } else {
          console.log('ℹ️ Настройки уведомлений недоступны, используются значения по умолчанию');
        }
      } catch (error) {
        console.error('Ошибка загрузки данных настроек:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettingsData();
  }, []);

  const handleNotificationToggle = async (type) => {
    // Предотвращаем множественные клики во время обновления
    if (updatingNotifications) return;
    
    const newNotifications = {
      ...notifications,
      [type]: !notifications[type]
    };
    
    // Сразу обновляем состояние UI
    setNotifications(newNotifications);
    setUpdatingNotifications(true);
    
    // Показываем уведомление о изменении настройки
    const settingNames = {
      push: 'Push-уведомления',
      email: 'Email-уведомления',
      sms: 'SMS-уведомления',
      security: 'Уведомления безопасности'
    };
    
    addToast({
      type: 'info',
      title: 'Настройка изменена',
      message: `${settingNames[type]} ${newNotifications[type] ? 'включены' : 'отключены'}`,
      duration: 3000
    });
    
    // Сохраняем настройки в бэкенд (когда API будет доступно)
    try {
      await clientAPI.updateNotificationSettings(newNotifications);
      console.log('✅ Настройки уведомлений сохранены:', newNotifications);
      addToast({
        type: 'success',
        title: 'Настройки сохранены',
        message: 'Настройки уведомлений успешно обновлены',
        duration: 3000
      });
    } catch (error) {
      console.log('ℹ️ API настроек уведомлений недоступно, настройки сохранены локально');
      // НЕ возвращаем предыдущее состояние - оставляем новое состояние
      addToast({
        type: 'warning',
        title: 'Настройки сохранены локально',
        message: 'Настройки применены, но не синхронизированы с сервером',
        duration: 4000
      });
    } finally {
      setUpdatingNotifications(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Валидация
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast({
        type: 'error',
        title: 'Ошибка валидации',
        message: 'Новые пароли не совпадают',
        duration: 5000
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      addToast({
        type: 'error',
        title: 'Ошибка валидации',
        message: 'Новый пароль должен содержать минимум 6 символов',
        duration: 5000
      });
      return;
    }
    
    try {
      await clientAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      console.log('✅ Пароль успешно изменен');
      addToast({
        type: 'success',
        title: 'Пароль изменен',
        message: 'Пароль успешно обновлен',
        duration: 5000
      });
      
      setShowChangePasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('❌ Ошибка смены пароля:', error);
      addToast({
        type: 'error',
        title: 'Ошибка смены пароля',
        message: error.message || 'Произошла ошибка при смене пароля',
        duration: 6000
      });
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleDemoToasts = () => {
    // Демонстрация разных типов Toast уведомлений
    addToast({
      type: 'success',
      title: 'Успех!',
      message: 'Операция выполнена успешно',
      duration: 4000
    });
    
    setTimeout(() => {
      addToast({
        type: 'info',
        title: 'Информация',
        message: 'Это информационное сообщение',
        duration: 4000
      });
    }, 500);
    
    setTimeout(() => {
      addToast({
        type: 'warning',
        title: 'Предупреждение',
        message: 'Обратите внимание на это предупреждение',
        duration: 4000
      });
    }, 1000);
    
    setTimeout(() => {
      addToast({
        type: 'error',
        title: 'Ошибка',
        message: 'Произошла ошибка при выполнении операции',
        duration: 4000
      });
    }, 1500);
    
    setTimeout(() => {
      addToast({
        type: 'recommendation',
        title: 'Персональная рекомендация',
        message: 'Айгерим, в сентябре у вас 5 поездок на такси на 50 000 ₸. С тревел-картой вернули бы 2 000 ₸ кешбэком. Хотите оформить?',
        duration: 8000
      });
    }, 2000);
  };

  const handleDownloadData = async () => {
    try {
      addToast({
        type: 'info',
        title: 'Скачивание данных',
        message: 'Подготовка файла для скачивания...',
        duration: 3000
      });
      
      const csvData = await pushAPI.downloadPushes();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bcc_data.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      addToast({
        type: 'success',
        title: 'Файл скачан',
        message: 'Данные успешно экспортированы в CSV файл',
        duration: 5000
      });
    } catch (error) {
      console.error('Ошибка скачивания данных:', error);
      addToast({
        type: 'error',
        title: 'Ошибка скачивания',
        message: error.message || 'Произошла ошибка при скачивании данных',
        duration: 6000
      });
    }
  };

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);
      console.log('🔄 Запуск анализа клиента...');
      
      // Показываем уведомление о начале анализа
      addToast({
        type: 'info',
        title: 'Анализ запущен',
        message: 'Выполняется анализ данных клиента...',
        duration: 3000
      });
      
      const result = await clientAPI.analyze();
      console.log('✅ Результат анализа:', result);
      
      // Извлекаем текст push_notification из ответа
      let notificationText = 'Анализ данных клиента успешно завершен!';
      
      if (result) {
        // Если результат - это строка (push_notification)
        if (typeof result === 'string') {
          notificationText = result;
        }
        // Если результат - это объект с полем push_notification
        else if (result.push_notification) {
          notificationText = result.push_notification;
        }
        // Если результат - это объект с другими полями
        else if (typeof result === 'object') {
          notificationText = JSON.stringify(result, null, 2);
        }
      }
      
      // Показываем успешное уведомление с результатом
      addToast({
        type: 'recommendation',
        title: 'Персональная рекомендация',
        message: notificationText,
        duration: 12000 // Увеличиваем время для чтения длинного текста
      });
      
    } catch (error) {
      console.error('❌ Ошибка анализа:', error);
      
      // Показываем уведомление об ошибке
      addToast({
        type: 'error',
        title: 'Ошибка анализа',
        message: error.message || 'Произошла ошибка при выполнении анализа',
        duration: 8000
      });
      
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <SettingsContainer>
        <div style={{ textAlign: 'center', padding: theme.spacing['2xl'] }}>
          Загрузка настроек...
        </div>
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer>
      <PageHeader>
        <PageTitle>Настройки</PageTitle>
      </PageHeader>

      <SettingsGrid>
        <ProfileCard>
          <h3>Профиль</h3>
          <ProfileInfo>
            <InfoRow>
              <InfoLabel>Имя:</InfoLabel>
              <InfoValue>{profile?.name || user?.name || '—'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Код клиента:</InfoLabel>
              <InfoValue>{profile?.clientCode || user?.client_code || '—'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Статус:</InfoLabel>
              <InfoValue>{profile?.status || user?.status || '—'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Город:</InfoLabel>
              <InfoValue>{profile?.city || user?.city || '—'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Возраст:</InfoLabel>
              <InfoValue>{profile?.age || '—'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Текущий баланс:</InfoLabel>
              <InfoValue>
                {balance?.balance 
                  ? new Intl.NumberFormat('ru-KZ', {
                      style: 'currency',
                      currency: 'KZT',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(balance.balance)
                  : '—'
                }
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Средний баланс:</InfoLabel>
              <InfoValue>
                {profile?.avgMonthlyBalanceKzt 
                  ? new Intl.NumberFormat('ru-KZ', {
                      style: 'currency',
                      currency: 'KZT',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(profile.avgMonthlyBalanceKzt)
                  : '—'
                }
              </InfoValue>
            </InfoRow>
          </ProfileInfo>
        </ProfileCard>

        <NotificationsCard>
          <h3>Уведомления</h3>
          <NotificationItem>
            <NotificationInfo>
              <NotificationTitle>Push-уведомления</NotificationTitle>
              <NotificationDescription>
                Получать уведомления в браузере
              </NotificationDescription>
            </NotificationInfo>
            <ToggleContainer>
              <ToggleSwitch>
                <ToggleInput
                  type="checkbox"
                  checked={notifications.push}
                  onChange={() => handleNotificationToggle('push')}
                  disabled={updatingNotifications}
                />
                <ToggleSlider disabled={updatingNotifications} />
              </ToggleSwitch>
              <ToggleStatus enabled={notifications.push}>
                {notifications.push ? 'ВКЛ' : 'ВЫКЛ'}
              </ToggleStatus>
            </ToggleContainer>
          </NotificationItem>

          <NotificationItem>
            <NotificationInfo>
              <NotificationTitle>Email-уведомления</NotificationTitle>
              <NotificationDescription>
                Получать уведомления на email
              </NotificationDescription>
            </NotificationInfo>
            <ToggleContainer>
              <ToggleSwitch>
                <ToggleInput
                  type="checkbox"
                  checked={notifications.email}
                  onChange={() => handleNotificationToggle('email')}
                  disabled={updatingNotifications}
                />
                <ToggleSlider disabled={updatingNotifications} />
              </ToggleSwitch>
              <ToggleStatus enabled={notifications.email}>
                {notifications.email ? 'ВКЛ' : 'ВЫКЛ'}
              </ToggleStatus>
            </ToggleContainer>
          </NotificationItem>

          <NotificationItem>
            <NotificationInfo>
              <NotificationTitle>SMS-уведомления</NotificationTitle>
              <NotificationDescription>
                Получать уведомления по SMS
              </NotificationDescription>
            </NotificationInfo>
            <ToggleContainer>
              <ToggleSwitch>
                <ToggleInput
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={() => handleNotificationToggle('sms')}
                  disabled={updatingNotifications}
                />
                <ToggleSlider disabled={updatingNotifications} />
              </ToggleSwitch>
              <ToggleStatus enabled={notifications.sms}>
                {notifications.sms ? 'ВКЛ' : 'ВЫКЛ'}
              </ToggleStatus>
            </ToggleContainer>
          </NotificationItem>

          <NotificationItem>
            <NotificationInfo>
              <NotificationTitle>Безопасность</NotificationTitle>
              <NotificationDescription>
                Уведомления о входе в систему
              </NotificationDescription>
            </NotificationInfo>
            <ToggleContainer>
              <ToggleSwitch>
                <ToggleInput
                  type="checkbox"
                  checked={notifications.security}
                  onChange={() => handleNotificationToggle('security')}
                  disabled={updatingNotifications}
                />
                <ToggleSlider disabled={updatingNotifications} />
              </ToggleSwitch>
              <ToggleStatus enabled={notifications.security}>
                {notifications.security ? 'ВКЛ' : 'ВЫКЛ'}
              </ToggleStatus>
            </ToggleContainer>
          </NotificationItem>

          <NotificationItem>
            <NotificationInfo>
              <NotificationTitle>Анализ клиента</NotificationTitle>
              <NotificationDescription>
                Запустить анализ данных клиента
              </NotificationDescription>
            </NotificationInfo>
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Анализ...' : 'Анализировать'}
            </Button>
          </NotificationItem>
        </NotificationsCard>

        <SecurityCard>
          <h3>Безопасность</h3>
          <SecurityActions>
            <SecurityAction>
              <SecurityInfo>
                <SecurityTitle>Сменить пароль</SecurityTitle>
                <SecurityDescription>
                  Обновите пароль для повышения безопасности
                </SecurityDescription>
              </SecurityInfo>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowChangePasswordModal(true)}
              >
                Изменить
              </Button>
            </SecurityAction>

            <SecurityAction>
              <SecurityInfo>
                <SecurityTitle>Скачать данные</SecurityTitle>
                <SecurityDescription>
                  Экспорт ваших данных в CSV формате
                </SecurityDescription>
              </SecurityInfo>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadData}
              >
                Скачать
              </Button>
            </SecurityAction>

            <SecurityAction>
              <SecurityInfo>
                <SecurityTitle>Демо уведомлений</SecurityTitle>
                <SecurityDescription>
                  Показать примеры Toast уведомлений
                </SecurityDescription>
              </SecurityInfo>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDemoToasts}
              >
                Демо
              </Button>
            </SecurityAction>
          </SecurityActions>
        </SecurityCard>

        <DangerZone>
          <h3>Опасная зона</h3>
          <DangerActions>
            <DangerAction>
              <DangerInfo>
                <DangerTitle>Выйти из системы</DangerTitle>
                <DangerDescription>
                  Завершить текущую сессию
                </DangerDescription>
              </DangerInfo>
              <Button 
                variant="danger" 
                size="sm"
                onClick={() => setShowLogoutModal(true)}
              >
                Выйти
              </Button>
            </DangerAction>
          </DangerActions>
        </DangerZone>
      </SettingsGrid>

      {/* Модальное окно смены пароля */}
      <Modal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        title="Сменить пароль"
        maxWidth="500px"
      >
        <ChangePasswordForm onSubmit={handleChangePassword}>
          <Input
            label="Текущий пароль"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            placeholder="Введите текущий пароль"
            required
          />
          <Input
            label="Новый пароль"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            placeholder="Введите новый пароль"
            required
          />
          <Input
            label="Подтвердите новый пароль"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Повторите новый пароль"
            required
          />
          <Modal.Footer border>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowChangePasswordModal(false)}
            >
              Отмена
            </Button>
            <Button type="submit" variant="primary">
              Сменить пароль
            </Button>
          </Modal.Footer>
        </ChangePasswordForm>
      </Modal>

      {/* Модальное окно выхода */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Выход из системы"
        maxWidth="400px"
      >
        <div style={{ textAlign: 'center', padding: theme.spacing.lg }}>
          <p style={{ margin: `0 0 ${theme.spacing.lg} 0`, color: theme.colors.textSecondary }}>
            Вы уверены, что хотите выйти из системы?
          </p>
          <Modal.Footer border>
            <Button 
              variant="outline" 
              onClick={() => setShowLogoutModal(false)}
            >
              Отмена
            </Button>
            <Button 
              variant="danger" 
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </SettingsContainer>
  );
};

export default SettingsPage;

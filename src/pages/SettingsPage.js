import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { clientAPI, pushAPI } from '../services/api';
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
  }

  &:checked + span:before {
    transform: translateX(24px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${theme.colors.gray300};
  transition: 0.2s;
  border-radius: 24px;

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
    const newNotifications = {
      ...notifications,
      [type]: !notifications[type]
    };
    
    setNotifications(newNotifications);
    
    // Сохраняем настройки в бэкенд (когда API будет доступно)
    try {
      await clientAPI.updateNotificationSettings(newNotifications);
      console.log('✅ Настройки уведомлений сохранены:', newNotifications);
    } catch (error) {
      console.log('ℹ️ API настроек уведомлений недоступно, настройки сохранены локально');
      // В случае ошибки возвращаем предыдущее состояние
      setNotifications(notifications);
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
      alert('Новые пароли не совпадают');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('Новый пароль должен содержать минимум 6 символов');
      return;
    }
    
    try {
      await clientAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      console.log('✅ Пароль успешно изменен');
      alert('Пароль успешно изменен');
      
      setShowChangePasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('❌ Ошибка смены пароля:', error);
      alert('Ошибка смены пароля: ' + error.message);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleDownloadData = async () => {
    try {
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
    } catch (error) {
      console.error('Ошибка скачивания данных:', error);
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
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={notifications.push}
                onChange={() => handleNotificationToggle('push')}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </NotificationItem>

          <NotificationItem>
            <NotificationInfo>
              <NotificationTitle>Email-уведомления</NotificationTitle>
              <NotificationDescription>
                Получать уведомления на email
              </NotificationDescription>
            </NotificationInfo>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={notifications.email}
                onChange={() => handleNotificationToggle('email')}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </NotificationItem>

          <NotificationItem>
            <NotificationInfo>
              <NotificationTitle>SMS-уведомления</NotificationTitle>
              <NotificationDescription>
                Получать уведомления по SMS
              </NotificationDescription>
            </NotificationInfo>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={notifications.sms}
                onChange={() => handleNotificationToggle('sms')}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </NotificationItem>

          <NotificationItem>
            <NotificationInfo>
              <NotificationTitle>Безопасность</NotificationTitle>
              <NotificationDescription>
                Уведомления о входе в систему
              </NotificationDescription>
            </NotificationInfo>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={notifications.security}
                onChange={() => handleNotificationToggle('security')}
              />
              <ToggleSlider />
            </ToggleSwitch>
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../styles/theme';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%);
  padding: ${theme.spacing.lg};
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 500px;
  box-shadow: ${theme.shadows.xl};
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing['2xl']};
  display: flex;
  justify-content: center;
`;

const LogoIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%);
  border-radius: ${theme.borderRadius['2xl']};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.white};
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${theme.typography.fontSize['3xl']};
  margin: 0 auto ${theme.spacing.lg};
`;

const BankName = styled.h1`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin: 0 0 ${theme.spacing.xs} 0;
`;

const BankSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.textSecondary};
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const FormTitle = styled.h2`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.textPrimary};
  margin: 0 0 ${theme.spacing.lg} 0;
  text-align: center;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${theme.colors.error}15;
  border: 1px solid ${theme.colors.error}30;
  color: ${theme.colors.error};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.sm};
  text-align: center;
`;


const SwitchMode = styled.div`
  text-align: center;
  margin-top: ${theme.spacing.lg};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.gray200};
`;

const SwitchText = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.textSecondary};
  margin: 0 0 ${theme.spacing.sm} 0;
`;

const SwitchLink = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: ${theme.colors.primaryDark};
  }
`;

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    client_code: '',
    password: '',
    confirmPassword: '',
    name: '',
    status: 'standard',
    city: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Редирект если уже авторизован
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Очистка ошибок при изменении полей
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData, clearError, error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очистка ошибки для конкретного поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.client_code.trim()) {
      newErrors.client_code = 'Введите код клиента';
    } else if (formData.client_code.length < 3) {
      newErrors.client_code = 'Код клиента должен содержать минимум 3 символа';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Введите имя';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Введите город';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await register({
        client_code: formData.client_code,
        password: formData.password,
        name: formData.name,
        status: formData.status,
        city: formData.city
      });
      
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      // Ошибка уже обработана в контексте
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  if (isSuccess) {
    return (
      <RegisterContainer>
        <RegisterCard>
          <LogoSection>
            <LogoIcon>✓</LogoIcon>
            <BankName>Регистрация успешна!</BankName>
            <BankSubtitle>Перенаправляем в личный кабинет...</BankSubtitle>
          </LogoSection>
        </RegisterCard>
      </RegisterContainer>
    );
  }

  return (
    <RegisterContainer>
      <RegisterCard>
        <LogoSection>
          <img src="/bcc.png" alt="BCC Logo" style={{ width: '70%' }} />
        </LogoSection>

        <FormTitle>Создать аккаунт</FormTitle>

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        <Form onSubmit={handleSubmit}>
          <FormRow>
            <Input
              label="Код клиента"
              name="client_code"
              type="text"
              value={formData.client_code}
              onChange={handleInputChange}
              error={errors.client_code}
              placeholder="Введите код клиента"
              required
            />

            <Input
              label="Имя"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              placeholder="Введите ваше имя"
              required
            />
          </FormRow>

          <FormRow>
            <Input
              label="Пароль"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              placeholder="Введите пароль"
              required
            />

            <Input
              label="Подтвердите пароль"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              placeholder="Повторите пароль"
              required
            />
          </FormRow>

          <FormRow>
            <Input
              label="Город"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleInputChange}
              error={errors.city}
              placeholder="Введите город"
              required
            />

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.textPrimary,
                marginBottom: theme.spacing.xs
              }}>
                Статус *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
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
                <option value="student">Студент</option>
                <option value="salary">Зарплатный клиент</option>
                <option value="premium">Премиальный клиент</option>
                <option value="standard">Стандартный клиент</option>
              </select>
            </div>
          </FormRow>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </Form>

        <SwitchMode>
          <SwitchText>Уже есть аккаунт?</SwitchText>
          <SwitchLink onClick={handleSwitchToLogin}>
            Войти в систему
          </SwitchLink>
        </SwitchMode>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default RegisterPage;

import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../styles/theme';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${theme.colors.border};
  box-shadow: ${theme.shadows.glass};
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${theme.colors.gradients.glass};
    z-index: -1;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  text-decoration: none;
  color: ${theme.colors.textPrimary};
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`;

const BankName = styled.h1`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin: 0;
  line-height: 1.2;
`;

const BankSubtitle = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.typography.fontWeight.normal};
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: ${theme.colors.textSecondary};
  text-decoration: none;
  font-weight: ${theme.typography.fontWeight.medium};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius['2xl']};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  z-index: 1;
  border: 1px solid transparent;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${theme.colors.gradients.primary};
    opacity: 0;
    transition: all 0.3s ease;
    border-radius: inherit;
    z-index: -1;
  }

  span {
    position: relative;
    z-index: 2;
    transition: all 0.3s ease;
  }

  &:hover {
    color: ${theme.colors.white};
    transform: translateY(-3px);
    border-color: ${theme.colors.primary};
    box-shadow: ${theme.shadows.glow};
    
    &::before {
      opacity: 1;
    }
    
    span {
      transform: scale(1.05);
    }
  }

  ${props => props.active && `
    color: ${theme.colors.white};
    background: ${theme.colors.gradients.primary};
    border-color: ${theme.colors.primary};
    box-shadow: ${theme.shadows.neon};
    
    &::before {
      opacity: 1;
    }
    
    span {
      transform: scale(1.05);
    }
  `}
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: ${theme.breakpoints.sm}) {
    display: none;
  }
`;

const UserName = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textPrimary};
`;

const UserStatus = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.textSecondary};
`;

const LogoutButton = styled.button`
  background: none;
  border: 1px solid ${theme.colors.gray300};
  color: ${theme.colors.textSecondary};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${theme.colors.gray50};
    border-color: ${theme.colors.gray400};
    color: ${theme.colors.textPrimary};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${theme.colors.textPrimary};
  font-size: ${theme.typography.fontSize.xl};
  cursor: pointer;
  padding: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.md}) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${theme.colors.border};
  box-shadow: ${theme.shadows.lg};
  z-index: 99;

  @media (max-width: ${theme.breakpoints.md}) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const MobileMenuContent = styled.div`
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const MobileNavLink = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? theme.colors.primary : theme.colors.textPrimary};
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${props => props.active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium};
  text-align: left;
  padding: ${theme.spacing.md} 0;
  cursor: pointer;
  border-bottom: 1px solid ${theme.colors.border};
  transition: all 0.3s ease;

  &:hover {
    color: ${theme.colors.primary};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Главная', path: '/dashboard' },
    { id: 'transactions', label: 'Транзакции', path: '/transactions' },
    { id: 'transfers', label: 'Переводы', path: '/transfers' },
    { id: 'settings', label: 'Настройки', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path === '/transactions') return 'transactions';
    if (path === '/transfers') return 'transfers';
    if (path === '/settings') return 'settings';
    return 'dashboard';
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo onClick={() => navigate('/dashboard')}>
          <img src="/bcc.png" alt="BCC Logo" style={{ width: '70%' }} />
        </Logo>

        {user && (
          <>
            <Navigation>
              {navigationItems.map(item => (
                <NavLink
                  key={item.id}
                  href="#"
                  active={getCurrentPage() === item.id}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
                >
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </Navigation>

            <UserSection>
              <UserInfo>
                <UserName>{user.name || user.client_code}</UserName>
                <UserStatus>{user.status || 'Клиент'}</UserStatus>
              </UserInfo>
              <LogoutButton onClick={handleLogout}>
                Выйти
              </LogoutButton>
              <MobileMenuButton onClick={toggleMobileMenu}>
                ☰
              </MobileMenuButton>
            </UserSection>
          </>
        )}
      </HeaderContent>
      
      <MobileMenu isOpen={isMobileMenuOpen}>
        <MobileMenuContent>
          {navigationItems.map(item => (
            <MobileNavLink
              key={item.id}
              active={getCurrentPage() === item.id}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }}
            >
              {item.label}
            </MobileNavLink>
          ))}
        </MobileMenuContent>
      </MobileMenu>
    </HeaderContainer>
  );
};

export default Header;

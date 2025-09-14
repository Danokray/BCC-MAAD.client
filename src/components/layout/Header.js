import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../styles/theme';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(248, 250, 252, 0.95) 50%, 
    rgba(241, 245, 249, 0.95) 100%
  );
  backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, 
      rgba(59, 130, 246, 0.03) 0%, 
      rgba(147, 51, 234, 0.03) 50%, 
      rgba(236, 72, 153, 0.03) 100%
    );
    z-index: -1;
  }
  
  &:hover {
    box-shadow: 
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05),
      0 0 0 1px rgba(255, 255, 255, 0.1);
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
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.xl};
  
  &:hover {
    transform: translateY(-2px);
    background: rgba(59, 130, 246, 0.05);
  }
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%);
  border-radius: ${theme.borderRadius.lg};
  box-shadow: 
    0 4px 6px -1px rgba(59, 130, 246, 0.3),
    0 2px 4px -1px rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
  
  img {
    filter: brightness(0) invert(1);
    transition: all 0.3s ease;
  }
  
  ${Logo}:hover & {
    transform: scale(1.05);
    box-shadow: 
      0 8px 12px -2px rgba(59, 130, 246, 0.4),
      0 4px 6px -1px rgba(59, 130, 246, 0.3);
  }
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const BankName = styled.h1`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.025em;
`;

const BankSubtitle = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.typography.fontWeight.medium};
  letter-spacing: 0.025em;
  text-transform: uppercase;
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
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.xl};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  z-index: 1;
  border: 1px solid transparent;
  font-size: ${theme.typography.fontSize.sm};
  letter-spacing: 0.025em;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(59, 130, 246, 0.1) 0%, 
      rgba(147, 51, 234, 0.1) 50%, 
      rgba(236, 72, 153, 0.1) 100%
    );
    opacity: 0;
    transition: all 0.3s ease;
    border-radius: inherit;
    z-index: -1;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%);
    transition: all 0.3s ease;
    transform: translateX(-50%);
    border-radius: 1px;
  }

  span {
    position: relative;
    z-index: 2;
    transition: all 0.3s ease;
  }

  &:hover {
    color: ${theme.colors.primary};
    transform: translateY(-2px);
    border-color: rgba(59, 130, 246, 0.2);
    box-shadow: 
      0 4px 6px -1px rgba(59, 130, 246, 0.1),
      0 2px 4px -1px rgba(59, 130, 246, 0.06);
    
    &::before {
      opacity: 1;
    }
    
    &::after {
      width: 80%;
    }
    
    span {
      transform: scale(1.02);
    }
  }

  ${props => props.active && `
    color: ${theme.colors.primary};
    background: linear-gradient(135deg, 
      rgba(59, 130, 246, 0.08) 0%, 
      rgba(147, 51, 234, 0.08) 50%, 
      rgba(236, 72, 153, 0.08) 100%
    );
    border-color: rgba(59, 130, 246, 0.3);
    box-shadow: 
      0 4px 6px -1px rgba(59, 130, 246, 0.15),
      0 2px 4px -1px rgba(59, 130, 246, 0.1);
    font-weight: ${theme.typography.fontWeight.semibold};
    
    &::before {
      opacity: 1;
    }
    
    &::after {
      width: 100%;
    }
    
    span {
      transform: scale(1.02);
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
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
  background: rgba(59, 130, 246, 0.03);
  border: 1px solid rgba(59, 130, 246, 0.1);
  transition: all 0.3s ease;

  @media (max-width: ${theme.breakpoints.sm}) {
    display: none;
  }
  
  &:hover {
    background: rgba(59, 130, 246, 0.05);
    border-color: rgba(59, 130, 246, 0.2);
    transform: translateY(-1px);
  }
`;

const UserName = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.textPrimary};
  letter-spacing: 0.025em;
`;

const UserStatus = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const LogoutButton = styled.button`
  background: linear-gradient(135deg, 
    rgba(239, 68, 68, 0.1) 0%, 
    rgba(220, 38, 38, 0.1) 100%
  );
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: ${theme.colors.error};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(239, 68, 68, 0.1) 0%, 
      rgba(220, 38, 38, 0.1) 100%
    );
    opacity: 0;
    transition: all 0.3s ease;
  }

  &:hover {
    background: linear-gradient(135deg, 
      rgba(239, 68, 68, 0.15) 0%, 
      rgba(220, 38, 38, 0.15) 100%
    );
    border-color: rgba(239, 68, 68, 0.4);
    color: ${theme.colors.error};
    transform: translateY(-2px);
    box-shadow: 
      0 4px 6px -1px rgba(239, 68, 68, 0.1),
      0 2px 4px -1px rgba(239, 68, 68, 0.06);
    
    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.1) 0%, 
    rgba(147, 51, 234, 0.1) 100%
  );
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: ${theme.colors.primary};
  font-size: ${theme.typography.fontSize.lg};
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.lg};
  transition: all 0.3s ease;

  @media (max-width: ${theme.breakpoints.md}) {
    display: block;
  }
  
  &:hover {
    background: linear-gradient(135deg, 
      rgba(59, 130, 246, 0.15) 0%, 
      rgba(147, 51, 234, 0.15) 100%
    );
    border-color: rgba(59, 130, 246, 0.3);
    transform: scale(1.05);
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(248, 250, 252, 0.98) 100%
  );
  backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 99;
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: ${theme.breakpoints.md}) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const MobileMenuContent = styled.div`
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const MobileNavLink = styled.button`
  background: ${props => props.active ? 
    'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)' : 
    'transparent'
  };
  border: 1px solid ${props => props.active ? 
    'rgba(59, 130, 246, 0.2)' : 
    'transparent'
  };
  color: ${props => props.active ? theme.colors.primary : theme.colors.textPrimary};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${props => props.active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium};
  text-align: left;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  cursor: pointer;
  border-radius: ${theme.borderRadius.lg};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(59, 130, 246, 0.05) 0%, 
      rgba(147, 51, 234, 0.05) 100%
    );
    opacity: 0;
    transition: all 0.3s ease;
  }

  &:hover {
    background: linear-gradient(135deg, 
      rgba(59, 130, 246, 0.08) 0%, 
      rgba(147, 51, 234, 0.08) 100%
    );
    border-color: rgba(59, 130, 246, 0.2);
    color: ${theme.colors.primary};
    transform: translateX(4px);
    
    &::before {
      opacity: 1;
    }
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
          <LogoIcon>
            <img src="/bcc.png" alt="BCC Logo" style={{ width: '70%' }} />
          </LogoIcon>
          <LogoText>
            <BankName>Bank Center Credit</BankName>
            <BankSubtitle>Digital Banking</BankSubtitle>
          </LogoText>
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

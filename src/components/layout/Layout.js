import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import Header from './Header';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  animation: fadeIn 0.6s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm};
  }
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;

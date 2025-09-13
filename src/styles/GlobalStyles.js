import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.fontSize.base};
    font-weight: ${theme.typography.fontWeight.normal};
    line-height: ${theme.typography.lineHeight.normal};
    color: ${theme.colors.textPrimary};
    background: ${theme.colors.gradients.background};
    background-attachment: fixed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: relative;
    overflow-x: hidden;
    
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 80%, rgba(0, 171, 117, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(245, 158, 11, 0.05) 0%, transparent 50%);
      pointer-events: none;
      z-index: -1;
    }
    
    &::after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        linear-gradient(45deg, transparent 30%, rgba(0, 171, 117, 0.02) 50%, transparent 70%),
        linear-gradient(-45deg, transparent 30%, rgba(34, 197, 94, 0.02) 50%, transparent 70%);
      pointer-events: none;
      z-index: -1;
    }
  }

  #root {
    min-height: 100vh;
    position: relative;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${theme.typography.fontWeight.semibold};
    line-height: ${theme.typography.lineHeight.tight};
    color: ${theme.colors.textPrimary};
  }

  h1 {
    font-size: ${theme.typography.fontSize['3xl']};
  }

  h2 {
    font-size: ${theme.typography.fontSize['2xl']};
  }

  h3 {
    font-size: ${theme.typography.fontSize.xl};
  }

  h4 {
    font-size: ${theme.typography.fontSize.lg};
  }

  h5 {
    font-size: ${theme.typography.fontSize.base};
  }

  h6 {
    font-size: ${theme.typography.fontSize.sm};
  }

  p {
    margin-bottom: ${theme.spacing.md};
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${theme.colors.primaryDark};
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.2s ease;
  }

  input, textarea, select {
    font-family: inherit;
    outline: none;
  }

  /* Утилитарные классы */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    .container {
      padding: 0 ${theme.spacing.sm};
    }
  }
`;

export default GlobalStyles;

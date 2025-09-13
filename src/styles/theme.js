// Современная темная тема для банковского приложения
export const theme = {
  colors: {
    // Основная палитра - зеленый BCC
    primary: 'rgb(0, 171, 117)',      // Основной зеленый BCC
    primaryLight: 'rgb(34, 197, 94)', // Светлый зеленый
    primaryDark: 'rgb(0, 120, 80)',   // Темный зеленый
    secondary: '#f59e0b',             // Золотой акцент
    accent: '#06b6d4',                // Циан
    
    // Статусные цвета
    success: '#10b981',        // Изумрудный
    error: '#ef4444',          // Красный
    warning: '#f59e0b',        // Янтарный
    info: '#3b82f6',           // Синий
    
    // Градиенты
    gradients: {
      primary: 'linear-gradient(135deg, rgb(0, 171, 117) 0%, rgb(34, 197, 94) 100%)',
      primaryDark: 'linear-gradient(135deg, rgb(0, 120, 80) 0%, rgb(0, 171, 117) 100%)',
      secondary: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      light: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    },
    
    // Темная палитра
    white: '#ffffff',
    black: '#000000',
    
    // Темные оттенки
    dark900: '#0a0a0a',
    dark800: '#1a1a1a',
    dark700: '#2a2a2a',
    dark600: '#3a3a3a',
    dark500: '#4a4a4a',
    dark400: '#6a6a6a',
    dark300: '#8a8a8a',
    dark200: '#aaaaaa',
    dark100: '#cccccc',
    
    // Семантические цвета для светлой темы
    background: '#ffffff',
    surface: '#ffffff',
    surfaceElevated: '#f8fafc',
    surfaceHover: '#f1f5f9',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    border: '#e5e7eb',
    divider: '#f3f4f6',
  },
  
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    }
  },
  
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    glow: '0 0 20px rgba(0, 171, 117, 0.3)',
    glowDark: '0 0 30px rgba(0, 171, 117, 0.4)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    neon: '0 0 5px rgba(0, 171, 117, 0.5), 0 0 10px rgba(0, 171, 117, 0.3), 0 0 15px rgba(0, 171, 117, 0.2)',
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }
};

export default theme;

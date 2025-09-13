
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import GlobalStyles from './styles/GlobalStyles';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import TransfersPage from './pages/TransfersPage';
import SettingsPage from './pages/SettingsPage';

// Компонент для защищенных маршрутов
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Загрузка...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Компонент для публичных маршрутов (только для неавторизованных)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Загрузка...
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};


// Главный компонент приложения с навигацией
const AppContent = () => {
  return (
    <Router>
      <Routes>
        {/* Публичные маршруты */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />

        {/* Защищенные маршруты */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transactions" 
          element={
            <ProtectedRoute>
              <Layout>
                <TransactionsPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transfers" 
          element={
            <ProtectedRoute>
              <Layout>
                <TransfersPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Layout>
                <SettingsPage />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Редирект с корневого пути */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 страница */}
        <Route 
          path="*" 
          element={
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              textAlign: 'center',
              padding: '2rem'
            }}>
              <h1 style={{ fontSize: '4rem', margin: '0 0 1rem 0', color: 'rgb(0, 171, 117)' }}>404</h1>
              <h2 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: '#374151' }}>
                Страница не найдена
              </h2>
              <p style={{ color: '#6b7280', margin: '0 0 2rem 0' }}>
                Запрашиваемая страница не существует
              </p>
              <button
                onClick={() => window.location.href = '/dashboard'}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'rgb(0, 171, 117)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'rgb(0, 120, 80)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'rgb(0, 171, 117)'}
              >
                Вернуться на главную
              </button>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
};

// Главный компонент приложения
const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <GlobalStyles />
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;

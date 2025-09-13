import axios from 'axios';
import { 
  mockAuthAPI, 
  mockClientAPI, 
  mockTransactionsAPI, 
  mockTransfersAPI, 
  mockPushAPI 
} from './mockApi';

// Базовый URL для API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Флаг для использования мок API
const USE_MOCK_API = !process.env.REACT_APP_API_URL || process.env.REACT_APP_API_URL.includes('localhost:3001');

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена авторизации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ответов
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен истек или недействителен
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API методы для авторизации
export const authAPI = {
  // Регистрация нового клиента
  register: async (userData) => {
    if (USE_MOCK_API) {
      return await mockAuthAPI.register(userData);
    }
    
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Вход в систему
  login: async (credentials) => {
    let result;
    
    if (USE_MOCK_API) {
      result = await mockAuthAPI.login(credentials);
    } else {
      const response = await api.post('/auth/login', credentials);
      result = response.data;
    }
    
    const { token, user } = result;
    
    // Сохраняем токен и данные пользователя
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return result;
  },

  // Получение данных текущего пользователя
  getCurrentUser: async () => {
    if (USE_MOCK_API) {
      return await mockAuthAPI.getCurrentUser();
    }
    
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Выход из системы
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};

// API методы для клиентского кабинета
export const clientAPI = {
  // Получение профиля клиента
  getProfile: async () => {
    if (USE_MOCK_API) {
      return await mockClientAPI.getProfile();
    }
    
    const response = await api.get('/client/profile');
    return response.data;
  },

  // Получение баланса
  getBalance: async () => {
    if (USE_MOCK_API) {
      return await mockClientAPI.getBalance();
    }
    
    const response = await api.get('/client/balance');
    return response.data;
  }
};

// API методы для транзакций
export const transactionsAPI = {
  // Получение списка транзакций
  getTransactions: async (params = {}) => {
    if (USE_MOCK_API) {
      return await mockTransactionsAPI.getTransactions(params);
    }
    
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  // Добавление новой транзакции
  createTransaction: async (transactionData) => {
    if (USE_MOCK_API) {
      return await mockTransactionsAPI.createTransaction(transactionData);
    }
    
    const response = await api.post('/transactions', transactionData);
    return response.data;
  }
};

// API методы для переводов
export const transfersAPI = {
  // Получение списка переводов
  getTransfers: async (params = {}) => {
    if (USE_MOCK_API) {
      return await mockTransfersAPI.getTransfers(params);
    }
    
    const response = await api.get('/transfers', { params });
    return response.data;
  },

  // Создание нового перевода
  createTransfer: async (transferData) => {
    if (USE_MOCK_API) {
      return await mockTransfersAPI.createTransfer(transferData);
    }
    
    const response = await api.post('/transfers', transferData);
    return response.data;
  }
};

// API методы для пуш-уведомлений
export const pushAPI = {
  // Получение последнего пуша
  getLatestPush: async () => {
    if (USE_MOCK_API) {
      return await mockPushAPI.getLatestPush();
    }
    
    const response = await api.get('/push/latest');
    return response.data;
  },

  // Генерация нового пуша
  generatePush: async () => {
    if (USE_MOCK_API) {
      return await mockPushAPI.generatePush();
    }
    
    const response = await api.post('/push/generate');
    return response.data;
  },

  // Получение рекомендаций для клиента
  getRecommendation: async (clientCode) => {
    if (USE_MOCK_API) {
      return await mockPushAPI.getRecommendation(clientCode);
    }
    
    const response = await api.get(`/recommendation/${clientCode}`);
    return response.data;
  },

  // Скачивание CSV файла
  downloadPushes: async () => {
    if (USE_MOCK_API) {
      return await mockPushAPI.downloadPushes();
    }
    
    const response = await api.get('/pushes/download', {
      responseType: 'blob'
    });
    return response.data;
  }
};

export default api;

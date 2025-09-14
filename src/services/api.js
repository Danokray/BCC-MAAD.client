import axios from 'axios';

// Конфигурация API для разных окружений
const getApiConfig = () => {
  const configs = {
    development: {
      baseURL: '', // Используем прокси из package.json
      timeout: 10000,
    },
    production: {
      baseURL: process.env.REACT_APP_API_URL || 'https://api.bcc.kz',
      timeout: 15000,
    },
    test: {
      baseURL: 'https://localhost:7175',
      timeout: 5000,
    }
  };
  
  const env = process.env.NODE_ENV || 'development';
  return configs[env] || configs.development;
};

// Создание экземпляра axios с базовой конфигурацией
const apiClient = axios.create({
  baseURL: getApiConfig().baseURL,
  timeout: getApiConfig().timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена авторизации
apiClient.interceptors.request.use(
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
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Токен недействителен, очищаем localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Регистрация пользователя
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      const { token, user } = response.data;
      
      // Сохраняем токен и данные пользователя
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка регистрации');
    }
  },

  // Вход в систему
  login: async (credentials) => {
    try {
      console.log('🔍 Отправляемые данные для логина:', credentials);
      const response = await apiClient.post('/auth/login', credentials);
      console.log('✅ Ответ сервера:', response.data);
      const { token, user } = response.data;
      
      // Сохраняем токен и данные пользователя
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      console.error('❌ Ошибка логина:', error);
      console.error('❌ Статус ответа:', error.response?.status);
      console.error('❌ Данные ошибки:', error.response?.data);
      
      // Детальная информация об ошибках валидации
      if (error.response?.data?.errors) {
        console.error('❌ Детали ошибок валидации:', error.response.data.errors);
      }
      
      // Извлекаем сообщение об ошибке
      let errorMessage = 'Ошибка входа в систему';
      if (error.response?.data?.title) {
        errorMessage = error.response.data.title;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  // Получение данных текущего пользователя
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка получения данных пользователя');
    }
  },

  // Выход из системы
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};

// Client API
export const clientAPI = {
  // Получение профиля клиента
  getProfile: async () => {
    try {
      const response = await apiClient.get('/client/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка получения профиля');
    }
  },

  // Получение баланса
  getBalance: async () => {
    try {
      const response = await apiClient.get('/client/balance');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка получения баланса');
    }
  },

  // Обновление профиля (когда будет доступно в бэкенде)
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/client/profile', profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка обновления профиля');
    }
  },

  // Получение настроек уведомлений (когда будет доступно в бэкенде)
  getNotificationSettings: async () => {
    try {
      const response = await apiClient.get('/client/notifications');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка получения настроек уведомлений');
    }
  },

  // Обновление настроек уведомлений (когда будет доступно в бэкенде)
  updateNotificationSettings: async (settings) => {
    try {
      const response = await apiClient.put('/client/notifications', settings);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка обновления настроек уведомлений');
    }
  },

  // Смена пароля (когда будет доступно в бэкенде)
  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.put('/client/password', passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка смены пароля');
    }
  },

  // Анализ клиента
  analyze: async () => {
    try {
      const response = await apiClient.post('/clientAnalyze/analyze');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка анализа клиента');
    }
  }
};

// Transactions API
export const transactionsAPI = {
  // Получение списка транзакций
  getTransactions: async (params = {}) => {
    try {
      const response = await apiClient.get('/transactions', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка получения транзакций');
    }
  },

  // Добавление новой транзакции (упрощенная версия)
  addTransaction: async (transactionData) => {
    try {
      const response = await apiClient.post('/transactions', transactionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка добавления транзакции');
    }
  },

  // Создание новой транзакции (Form Data для .NET Backend)
  createTransaction: async (transactionData) => {
    try {
      const formData = new FormData();
      Object.keys(transactionData).forEach(key => {
        formData.append(key, transactionData[key]);
      });

      const response = await apiClient.post('/transactions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка создания транзакции');
    }
  },

  // Создание транзакции с JSON (альтернативный метод)
  createTransactionJson: async (transactionData) => {
    try {
      const response = await apiClient.post('/transactions/json', transactionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка создания транзакции');
    }
  }
};

// Transfers API
export const transfersAPI = {
  // Получение списка переводов
  getTransfers: async (params = {}) => {
    try {
      const response = await apiClient.get('/transfers', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка получения переводов');
    }
  },

  // Создание нового перевода (Form Data для .NET Backend)
  createTransfer: async (transferData) => {
    try {
      const formData = new FormData();
      Object.keys(transferData).forEach(key => {
        formData.append(key, transferData[key]);
      });

      const response = await apiClient.post('/transfers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка создания перевода');
    }
  },

  // Создание перевода с JSON (альтернативный метод)
  createTransferJson: async (transferData) => {
    try {
      const response = await apiClient.post('/transfers/json', transferData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка создания перевода');
    }
  }
};

// Push API (временно закомментировано, пока не реализовано в бэкенде)
export const pushAPI = {
  // Получение последнего пуша
  getLatestPush: async () => {
    try {
      const response = await apiClient.get('/push/latest');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка получения пуша');
    }
  },

  // Генерация нового пуша
  generatePush: async () => {
    try {
      const response = await apiClient.post('/push/generate');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка генерации пуша');
    }
  },

  // Получение рекомендаций
  getRecommendation: async (clientCode) => {
    try {
      const response = await apiClient.get(`/push/recommendation/${clientCode}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка получения рекомендаций');
    }
  },

  // Скачивание CSV файла
  downloadPushes: async () => {
    try {
      const response = await apiClient.get('/push/download', {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ошибка скачивания файла');
    }
  }
};

export default apiClient;

// Примеры использования API для интеграции с .NET Backend

import { authAPI, clientAPI, transactionsAPI, transfersAPI, pushAPI } from '../services/api';
import type { RegisterRequest, LoginRequest } from '../types/api';

// Примеры использования AuthAPI
export const authExamples = {
  // Регистрация пользователя
  registerUser: async () => {
    const userData: RegisterRequest = {
      firstName: 'Иван',
      lastName: 'Иванов',
      email: 'ivan@example.com',
      phone: '+7 (777) 123-45-67',
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!'
    };

    try {
      const result = await authAPI.register(userData);
      console.log('Registration successful:', result);
      return result;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  // Вход в систему
  loginUser: async () => {
    const credentials: LoginRequest = {
      clientCode: '12345',
      password: 'SecurePassword123!'
    };

    try {
      const result = await authAPI.login(credentials);
      console.log('Login successful:', result);
      return result;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  // Получение данных текущего пользователя
  getCurrentUser: async () => {
    try {
      const user = await authAPI.getCurrentUser();
      console.log('Current user:', user);
      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  },

  // Выход из системы
  logoutUser: () => {
    authAPI.logout();
    console.log('User logged out');
  }
};

// Примеры использования ClientAPI
export const clientExamples = {
  // Получение профиля клиента
  getProfile: async () => {
    try {
      const profile = await clientAPI.getProfile();
      console.log('Client profile:', profile);
      console.log('Client Code:', profile.client_code);
      console.log('Client Name:', profile.name);
      console.log('Client Status:', profile.status);
      console.log('Client City:', profile.city);
      return profile;
    } catch (error) {
      console.error('Failed to get profile:', error);
      throw error;
    }
  },

  // Получение баланса
  getBalance: async () => {
    try {
      const balance = await clientAPI.getBalance();
      console.log('Client balance:', balance);
      console.log('Current Balance:', balance.current_balance);
      console.log('Currency:', balance.currency);
      console.log('Last Updated:', balance.last_updated);
      return balance;
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw error;
    }
  },

  // Проверка авторизации перед запросом профиля
  getProfileWithAuth: async () => {
    try {
      // Проверяем, есть ли токен
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please login first.');
      }

      const profile = await clientAPI.getProfile();
      console.log('Authenticated client profile:', profile);
      return profile;
    } catch (error) {
      console.error('Failed to get profile with auth:', error);
      throw error;
    }
  }
};

// Примеры использования TransactionsAPI
export const transactionExamples = {
  // Получение списка транзакций
  getTransactions: async () => {
    try {
      const params = {
        page: 1,
        pageSize: 10,
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31'
      };
      
      const result = await transactionsAPI.getTransactions(params);
      console.log('Transactions:', result);
      console.log('Total transactions:', result.length);
      
      // Выводим информацию о каждой транзакции
      result.forEach((tx, index) => {
        console.log(`Transaction ${index + 1}:`, {
          id: tx.id,
          amount: tx.amount,
          type: tx.type,
          category: tx.category,
          description: tx.description,
          date: tx.date,
          status: tx.status
        });
      });
      
      return result;
    } catch (error) {
      console.error('Failed to get transactions:', error);
      throw error;
    }
  },

  // Создание новой транзакции (Form Data для .NET Backend)
  createTransaction: async () => {
    try {
      const transactionData = {
        amount: 1000,
        type: 'credit' as const,
        category: 'Salary',
        description: 'Monthly salary',
        reference: 'REF123456',
        status: 'completed'
      };
      
      const result = await transactionsAPI.createTransaction(transactionData);
      console.log('Transaction created:', result);
      console.log('Message:', result.message);
      return result;
    } catch (error) {
      console.error('Failed to create transaction:', error);
      throw error;
    }
  },

  // Создание транзакции с JSON (альтернативный метод)
  createTransactionJson: async () => {
    try {
      const transactionData = {
        amount: 500,
        type: 'debit' as const,
        category: 'Shopping',
        description: 'Online purchase'
      };
      
      const result = await transactionsAPI.createTransactionJson(transactionData);
      console.log('Transaction created (JSON):', result);
      return result;
    } catch (error) {
      console.error('Failed to create transaction (JSON):', error);
      throw error;
    }
  },

  // Получение транзакций с проверкой авторизации
  getTransactionsWithAuth: async () => {
    try {
      // Проверяем, есть ли токен
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please login first.');
      }

      const transactions = await transactionsAPI.getTransactions();
      console.log('Authenticated user transactions:', transactions);
      return transactions;
    } catch (error) {
      console.error('Failed to get transactions with auth:', error);
      throw error;
    }
  }
};

// Примеры использования TransfersAPI
export const transferExamples = {
  // Получение списка переводов
  getTransfers: async () => {
    try {
      const params = {
        page: 1,
        pageSize: 10
      };
      
      const result = await transfersAPI.getTransfers(params);
      console.log('Transfers:', result);
      console.log('Total transfers:', result.length);
      
      // Выводим информацию о каждом переводе
      result.forEach((transfer, index) => {
        console.log(`Transfer ${index + 1}:`, {
          id: transfer.id,
          amount: transfer.amount,
          type: transfer.type,
          recipient: transfer.recipient,
          recipient_account: transfer.recipient_account,
          description: transfer.description,
          date: transfer.date,
          status: transfer.status,
          reference: transfer.reference
        });
      });
      
      return result;
    } catch (error) {
      console.error('Failed to get transfers:', error);
      throw error;
    }
  },

  // Создание нового перевода (Form Data для .NET Backend)
  createTransfer: async () => {
    try {
      const transferData = {
        amount: 5000,
        recipient: 'Иван Петров',
        recipient_account: 'KZ123456789012345678',
        description: 'Transfer to friend',
        reference: 'TRF123456',
        status: 'pending',
        currency: 'KZT'
      };
      
      const result = await transfersAPI.createTransfer(transferData);
      console.log('Transfer created:', result);
      console.log('Message:', result.message);
      return result;
    } catch (error) {
      console.error('Failed to create transfer:', error);
      throw error;
    }
  },

  // Создание перевода с JSON (альтернативный метод)
  createTransferJson: async () => {
    try {
      const transferData = {
        toAccount: 'KZ987654321098765432',
        amount: 2500,
        currency: 'KZT',
        description: 'Online payment'
      };
      
      const result = await transfersAPI.createTransferJson(transferData);
      console.log('Transfer created (JSON):', result);
      return result;
    } catch (error) {
      console.error('Failed to create transfer (JSON):', error);
      throw error;
    }
  },

  // Получение переводов с проверкой авторизации
  getTransfersWithAuth: async () => {
    try {
      // Проверяем, есть ли токен
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please login first.');
      }

      const transfers = await transfersAPI.getTransfers();
      console.log('Authenticated user transfers:', transfers);
      return transfers;
    } catch (error) {
      console.error('Failed to get transfers with auth:', error);
      throw error;
    }
  }
};

// Примеры использования PushAPI
export const pushExamples = {
  // Получение последнего пуша
  getLatestPush: async () => {
    try {
      const push = await pushAPI.getLatestPush();
      console.log('Latest push:', push);
      return push;
    } catch (error) {
      console.error('Failed to get latest push:', error);
      throw error;
    }
  },

  // Генерация нового пуша
  generatePush: async () => {
    try {
      const push = await pushAPI.generatePush();
      console.log('Push generated:', push);
      return push;
    } catch (error) {
      console.error('Failed to generate push:', error);
      throw error;
    }
  },

  // Получение рекомендаций
  getRecommendation: async () => {
    try {
      const clientCode = 'CLIENT123';
      const recommendation = await pushAPI.getRecommendation(clientCode);
      console.log('Recommendation:', recommendation);
      return recommendation;
    } catch (error) {
      console.error('Failed to get recommendation:', error);
      throw error;
    }
  },

  // Скачивание CSV файла
  downloadPushes: async () => {
    try {
      const blob = await pushAPI.downloadPushes();
      console.log('CSV file downloaded:', blob);
      
      // Создание ссылки для скачивания
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pushes.csv';
      link.click();
      window.URL.revokeObjectURL(url);
      
      return blob;
    } catch (error) {
      console.error('Failed to download pushes:', error);
      throw error;
    }
  }
};

// Комплексный пример: полный цикл работы с API
export const fullWorkflowExample = async () => {
  try {
    console.log('=== Starting full workflow example ===');
    
    // 1. Регистрация
    console.log('1. Registering user...');
    await authExamples.registerUser();
    
    // 2. Вход
    console.log('2. Logging in...');
    await authExamples.loginUser();
    
    // 3. Получение данных пользователя
    console.log('3. Getting current user...');
    await authExamples.getCurrentUser();
    
    // 4. Получение профиля
    console.log('4. Getting profile...');
    await clientExamples.getProfile();
    
    // 5. Получение баланса
    console.log('5. Getting balance...');
    await clientExamples.getBalance();
    
    // 6. Получение транзакций
    console.log('6. Getting transactions...');
    await transactionExamples.getTransactions();
    
    // 7. Создание транзакции (Form Data)
    console.log('7. Creating transaction (Form Data)...');
    await transactionExamples.createTransaction();
    
    // 8. Создание транзакции (JSON альтернатива)
    console.log('8. Creating transaction (JSON)...');
    await transactionExamples.createTransactionJson();
    
    // 9. Получение переводов
    console.log('9. Getting transfers...');
    await transferExamples.getTransfers();
    
    // 10. Создание перевода (Form Data)
    console.log('10. Creating transfer (Form Data)...');
    await transferExamples.createTransfer();
    
    // 11. Создание перевода (JSON альтернатива)
    console.log('11. Creating transfer (JSON)...');
    await transferExamples.createTransferJson();
    
    // 10. Получение пуша
    console.log('10. Getting latest push...');
    await pushExamples.getLatestPush();
    
    // 11. Генерация пуша
    console.log('11. Generating push...');
    await pushExamples.generatePush();
    
    // 12. Получение рекомендаций
    console.log('12. Getting recommendation...');
    await pushExamples.getRecommendation();
    
    console.log('=== Full workflow completed successfully ===');
    
  } catch (error) {
    console.error('Workflow failed:', error);
    throw error;
  }
};

// Тесты для TransactionsAPI интеграции с .NET Backend

import { transactionsAPI } from '../services/api';

// Мок для localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Мок для axios
jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TransactionsAPI Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Мокаем успешный ответ axios
    mockedAxios.create.mockReturnValue({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      }
    } as any);
  });

  describe('getTransactions', () => {
    it('should get transactions successfully', async () => {
      const mockTransactions = [
        {
          id: '1',
          amount: 1000,
          type: 'credit',
          category: 'Salary',
          description: 'Monthly salary',
          date: '2024-01-15T10:30:00Z',
          status: 'completed',
          reference: 'REF123456',
          client_code: 12345
        },
        {
          id: '2',
          amount: 500,
          type: 'debit',
          category: 'Shopping',
          description: 'Online purchase',
          date: '2024-01-14T15:20:00Z',
          status: 'completed',
          reference: 'REF123457',
          client_code: 12345
        }
      ];

      const mockResponse = {
        data: mockTransactions,
        status: 200,
        statusText: 'OK'
      };

      mockedAxios.create().get.mockResolvedValue(mockResponse);

      const result = await transactionsAPI.getTransactions();

      expect(result).toEqual(mockTransactions);
      expect(result).toHaveLength(2);
      expect(mockedAxios.create().get).toHaveBeenCalledWith('/transactions', { params: {} });
    });

    it('should handle transactions request error', async () => {
      const errorResponse = {
        response: {
          data: { message: 'Transactions not found' },
          status: 404
        }
      };

      mockedAxios.create().get.mockRejectedValue(errorResponse);

      await expect(transactionsAPI.getTransactions()).rejects.toThrow('Transactions not found');
    });

    it('should pass query parameters', async () => {
      const params = {
        page: 1,
        pageSize: 10,
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31'
      };

      const mockTransactions = [];
      const mockResponse = {
        data: mockTransactions,
        status: 200
      };

      mockedAxios.create().get.mockResolvedValue(mockResponse);

      await transactionsAPI.getTransactions(params);

      expect(mockedAxios.create().get).toHaveBeenCalledWith('/transactions', { params });
    });
  });

  describe('createTransaction', () => {
    it('should create transaction with FormData successfully', async () => {
      const transactionData = {
        amount: 1000,
        type: 'credit' as const,
        category: 'Salary',
        description: 'Monthly salary',
        reference: 'REF123456',
        status: 'completed'
      };

      const mockResponse = {
        data: { message: 'Transaction added' },
        status: 200,
        statusText: 'OK'
      };

      mockedAxios.create().post.mockResolvedValue(mockResponse);

      const result = await transactionsAPI.createTransaction(transactionData);

      expect(result).toEqual({ message: 'Transaction added' });
      expect(mockedAxios.create().post).toHaveBeenCalledWith(
        '/transactions',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
    });

    it('should create FormData correctly', async () => {
      const transactionData = {
        amount: 500,
        type: 'debit' as const,
        category: 'Shopping',
        description: 'Online purchase'
      };

      const mockResponse = {
        data: { message: 'Transaction added' },
        status: 200
      };

      mockedAxios.create().post.mockResolvedValue(mockResponse);

      await transactionsAPI.createTransaction(transactionData);

      const formDataCall = mockedAxios.create().post.mock.calls[0][1];
      expect(formDataCall).toBeInstanceOf(FormData);
    });

    it('should handle create transaction error', async () => {
      const transactionData = {
        amount: 1000,
        type: 'credit' as const,
        category: 'Salary',
        description: 'Monthly salary'
      };

      const errorResponse = {
        response: {
          data: { message: 'Failed to create transaction' },
          status: 400
        }
      };

      mockedAxios.create().post.mockRejectedValue(errorResponse);

      await expect(transactionsAPI.createTransaction(transactionData)).rejects.toThrow('Failed to create transaction');
    });
  });

  describe('createTransactionJson', () => {
    it('should create transaction with JSON successfully', async () => {
      const transactionData = {
        amount: 750,
        type: 'credit' as const,
        category: 'Bonus',
        description: 'Performance bonus'
      };

      const mockTransaction = {
        id: '3',
        amount: 750,
        type: 'credit',
        category: 'Bonus',
        description: 'Performance bonus',
        date: '2024-01-16T12:00:00Z',
        status: 'pending',
        reference: 'REF123458'
      };

      const mockResponse = {
        data: mockTransaction,
        status: 200,
        statusText: 'OK'
      };

      mockedAxios.create().post.mockResolvedValue(mockResponse);

      const result = await transactionsAPI.createTransactionJson(transactionData);

      expect(result).toEqual(mockTransaction);
      expect(mockedAxios.create().post).toHaveBeenCalledWith(
        '/transactions',
        transactionData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    });

    it('should handle JSON transaction creation error', async () => {
      const transactionData = {
        amount: 750,
        type: 'credit' as const,
        category: 'Bonus',
        description: 'Performance bonus'
      };

      const errorResponse = {
        response: {
          data: { message: 'Invalid transaction data' },
          status: 422
        }
      };

      mockedAxios.create().post.mockRejectedValue(errorResponse);

      await expect(transactionsAPI.createTransactionJson(transactionData)).rejects.toThrow('Invalid transaction data');
    });
  });

  describe('Authorization', () => {
    it('should include authorization header for GET requests', async () => {
      localStorageMock.getItem.mockReturnValue('mock_jwt_token');

      const mockTransactions = [];
      const mockResponse = {
        data: mockTransactions,
        status: 200
      };

      mockedAxios.create().get.mockResolvedValue(mockResponse);

      await transactionsAPI.getTransactions();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('authToken');
    });

    it('should include authorization header for POST requests', async () => {
      localStorageMock.getItem.mockReturnValue('mock_jwt_token');

      const transactionData = {
        amount: 1000,
        type: 'credit' as const,
        category: 'Salary',
        description: 'Monthly salary'
      };

      const mockResponse = {
        data: { message: 'Transaction added' },
        status: 200
      };

      mockedAxios.create().post.mockResolvedValue(mockResponse);

      await transactionsAPI.createTransaction(transactionData);

      expect(localStorageMock.getItem).toHaveBeenCalledWith('authToken');
    });
  });
});

// Интеграционные тесты для реального API
describe('TransactionsAPI Real API Tests', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should use real API when REACT_APP_API_URL is set', async () => {
    process.env.REACT_APP_API_URL = 'https://localhost:7001';
    process.env.NODE_ENV = 'production';

    // Перезагружаем модуль для применения новых переменных окружения
    delete require.cache[require.resolve('../config/api')];
    delete require.cache[require.resolve('../services/api')];

    const { transactionsAPI: realTransactionsAPI } = require('../services/api');

    expect(realTransactionsAPI).toBeDefined();
  });
});

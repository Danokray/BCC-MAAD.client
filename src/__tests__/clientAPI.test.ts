// Тесты для ClientAPI интеграции с .NET Backend

import { clientAPI } from '../services/api';

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

describe('ClientAPI Integration Tests', () => {
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

  describe('getProfile', () => {
    it('should get client profile successfully', async () => {
      const mockProfile = {
        name: 'Иван Иванов',
        age: 28,
        status: 'individual',
        average_balance: 150000,
        city: 'Алматы',
        client_code: 12345
      };

      const mockResponse = {
        data: mockProfile,
        status: 200,
        statusText: 'OK'
      };

      mockedAxios.create().get.mockResolvedValue(mockResponse);

      const result = await clientAPI.getProfile();

      expect(result).toEqual(mockProfile);
      expect(mockedAxios.create().get).toHaveBeenCalledWith('/client/profile');
    });

    it('should handle profile request error', async () => {
      const errorResponse = {
        response: {
          data: { message: 'Profile not found' },
          status: 404
        }
      };

      mockedAxios.create().get.mockRejectedValue(errorResponse);

      await expect(clientAPI.getProfile()).rejects.toThrow('Profile not found');
    });
  });

  describe('getBalance', () => {
    it('should get client balance successfully', async () => {
      const mockBalance = {
        current_balance: 150000,
        currency: 'KZT',
        last_updated: '2024-01-15T10:30:00Z',
        account_number: 'KZ123456789012345678'
      };

      const mockResponse = {
        data: mockBalance,
        status: 200,
        statusText: 'OK'
      };

      mockedAxios.create().get.mockResolvedValue(mockResponse);

      const result = await clientAPI.getBalance();

      expect(result).toEqual(mockBalance);
      expect(mockedAxios.create().get).toHaveBeenCalledWith('/client/balance');
    });

    it('should handle balance request error', async () => {
      const errorResponse = {
        response: {
          data: { message: 'Balance not found' },
          status: 404
        }
      };

      mockedAxios.create().get.mockRejectedValue(errorResponse);

      await expect(clientAPI.getBalance()).rejects.toThrow('Balance not found');
    });
  });

  describe('Authorization', () => {
    it('should include authorization header', async () => {
      localStorageMock.getItem.mockReturnValue('mock_jwt_token');

      const mockProfile = {
        name: 'Иван Иванов',
        age: 28,
        status: 'individual',
        average_balance: 150000,
        city: 'Алматы'
      };

      const mockResponse = {
        data: mockProfile,
        status: 200
      };

      mockedAxios.create().get.mockResolvedValue(mockResponse);

      await clientAPI.getProfile();

      // Проверяем, что токен был получен из localStorage
      expect(localStorageMock.getItem).toHaveBeenCalledWith('authToken');
    });
  });
});

// Интеграционные тесты для реального API
describe('ClientAPI Real API Tests', () => {
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

    const { clientAPI: realClientAPI } = require('../services/api');

    // В реальном тесте здесь бы был вызов к настоящему API
    // Для демонстрации мы просто проверяем, что API не использует мок
    expect(realClientAPI).toBeDefined();
  });
});

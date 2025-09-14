// Тесты для TransfersAPI интеграции с .NET Backend

import { transfersAPI } from '../services/api';

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

describe('TransfersAPI Integration Tests', () => {
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

  describe('getTransfers', () => {
    it('should get transfers successfully', async () => {
      const mockTransfers = [
        {
          id: '1',
          type: 'outgoing',
          amount: 5000,
          recipient: 'Иван Петров',
          recipient_account: 'KZ123456789012345678',
          description: 'Transfer to friend',
          date: '2024-01-15T14:30:00Z',
          status: 'completed',
          reference: 'TRF123456',
          client_code: 12345
        },
        {
          id: '2',
          type: 'outgoing',
          amount: 2500,
          recipient: 'Анна Смирнова',
          recipient_account: 'KZ987654321098765432',
          description: 'Online payment',
          date: '2024-01-14T16:45:00Z',
          status: 'pending',
          reference: 'TRF123457',
          client_code: 12345
        }
      ];

      const mockResponse = {
        data: mockTransfers,
        status: 200,
        statusText: 'OK'
      };

      mockedAxios.create().get.mockResolvedValue(mockResponse);

      const result = await transfersAPI.getTransfers();

      expect(result).toEqual(mockTransfers);
      expect(result).toHaveLength(2);
      expect(mockedAxios.create().get).toHaveBeenCalledWith('/transfers', { params: {} });
    });

    it('should handle transfers request error', async () => {
      const errorResponse = {
        response: {
          data: { message: 'Transfers not found' },
          status: 404
        }
      };

      mockedAxios.create().get.mockRejectedValue(errorResponse);

      await expect(transfersAPI.getTransfers()).rejects.toThrow('Transfers not found');
    });

    it('should pass query parameters', async () => {
      const params = {
        page: 1,
        pageSize: 10,
        status: 'completed'
      };

      const mockTransfers = [];
      const mockResponse = {
        data: mockTransfers,
        status: 200
      };

      mockedAxios.create().get.mockResolvedValue(mockResponse);

      await transfersAPI.getTransfers(params);

      expect(mockedAxios.create().get).toHaveBeenCalledWith('/transfers', { params });
    });
  });

  describe('createTransfer', () => {
    it('should create transfer with FormData successfully', async () => {
      const transferData = {
        amount: 5000,
        recipient: 'Иван Петров',
        recipient_account: 'KZ123456789012345678',
        description: 'Transfer to friend',
        reference: 'TRF123456',
        status: 'pending',
        currency: 'KZT'
      };

      const mockResponse = {
        data: { message: 'Transfer added' },
        status: 200,
        statusText: 'OK'
      };

      mockedAxios.create().post.mockResolvedValue(mockResponse);

      const result = await transfersAPI.createTransfer(transferData);

      expect(result).toEqual({ message: 'Transfer added' });
      expect(mockedAxios.create().post).toHaveBeenCalledWith(
        '/transfers',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
    });

    it('should create FormData correctly', async () => {
      const transferData = {
        amount: 2500,
        recipient: 'Анна Смирнова',
        recipient_account: 'KZ987654321098765432',
        description: 'Online payment'
      };

      const mockResponse = {
        data: { message: 'Transfer added' },
        status: 200
      };

      mockedAxios.create().post.mockResolvedValue(mockResponse);

      await transfersAPI.createTransfer(transferData);

      const formDataCall = mockedAxios.create().post.mock.calls[0][1];
      expect(formDataCall).toBeInstanceOf(FormData);
    });

    it('should handle create transfer error', async () => {
      const transferData = {
        amount: 5000,
        recipient: 'Иван Петров',
        recipient_account: 'KZ123456789012345678',
        description: 'Transfer to friend'
      };

      const errorResponse = {
        response: {
          data: { message: 'Failed to create transfer' },
          status: 400
        }
      };

      mockedAxios.create().post.mockRejectedValue(errorResponse);

      await expect(transfersAPI.createTransfer(transferData)).rejects.toThrow('Failed to create transfer');
    });
  });

  describe('createTransferJson', () => {
    it('should create transfer with JSON successfully', async () => {
      const transferData = {
        toAccount: 'KZ987654321098765432',
        amount: 2500,
        currency: 'KZT',
        description: 'Online payment'
      };

      const mockTransfer = {
        id: '3',
        type: 'outgoing',
        amount: 2500,
        recipient: 'Анна Смирнова',
        recipient_account: 'KZ987654321098765432',
        description: 'Online payment',
        date: '2024-01-16T10:00:00Z',
        status: 'pending',
        reference: 'TRF123458'
      };

      const mockResponse = {
        data: mockTransfer,
        status: 200,
        statusText: 'OK'
      };

      mockedAxios.create().post.mockResolvedValue(mockResponse);

      const result = await transfersAPI.createTransferJson(transferData);

      expect(result).toEqual(mockTransfer);
      expect(mockedAxios.create().post).toHaveBeenCalledWith(
        '/transfers',
        transferData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    });

    it('should handle JSON transfer creation error', async () => {
      const transferData = {
        toAccount: 'KZ987654321098765432',
        amount: 2500,
        currency: 'KZT',
        description: 'Online payment'
      };

      const errorResponse = {
        response: {
          data: { message: 'Invalid transfer data' },
          status: 422
        }
      };

      mockedAxios.create().post.mockRejectedValue(errorResponse);

      await expect(transfersAPI.createTransferJson(transferData)).rejects.toThrow('Invalid transfer data');
    });
  });

  describe('Authorization', () => {
    it('should include authorization header for GET requests', async () => {
      localStorageMock.getItem.mockReturnValue('mock_jwt_token');

      const mockTransfers = [];
      const mockResponse = {
        data: mockTransfers,
        status: 200
      };

      mockedAxios.create().get.mockResolvedValue(mockResponse);

      await transfersAPI.getTransfers();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('authToken');
    });

    it('should include authorization header for POST requests', async () => {
      localStorageMock.getItem.mockReturnValue('mock_jwt_token');

      const transferData = {
        amount: 5000,
        recipient: 'Иван Петров',
        recipient_account: 'KZ123456789012345678',
        description: 'Transfer to friend'
      };

      const mockResponse = {
        data: { message: 'Transfer added' },
        status: 200
      };

      mockedAxios.create().post.mockResolvedValue(mockResponse);

      await transfersAPI.createTransfer(transferData);

      expect(localStorageMock.getItem).toHaveBeenCalledWith('authToken');
    });
  });
});

// Интеграционные тесты для реального API
describe('TransfersAPI Real API Tests', () => {
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

    const { transfersAPI: realTransfersAPI } = require('../services/api');

    expect(realTransfersAPI).toBeDefined();
  });
});

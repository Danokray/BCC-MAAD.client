// Конфигурация API для разных окружений

export interface ApiConfig {
  baseURL: string;
  timeout: number;
}

const configs: Record<string, ApiConfig> = {
  development: {
    baseURL: 'https://localhost:7175',
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

export const getApiConfig = (): ApiConfig => {
  const env = process.env.NODE_ENV || 'development';
  return configs[env] || configs.development;
};

export const apiConfig = getApiConfig();

// Экспорт для использования в других файлах
export const { baseURL, timeout } = apiConfig;

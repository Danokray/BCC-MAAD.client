// Константы приложения

// Статусы транзакций
export const TRANSACTION_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  PROCESSING: 'processing'
};

// Типы переводов
export const TRANSFER_TYPE = {
  OUTGOING: 'outgoing',
  INCOMING: 'incoming',
  INTERNAL: 'internal',
  EXTERNAL: 'external'
};

// Категории транзакций
export const TRANSACTION_CATEGORIES = {
  FOOD: 'food',
  TRANSPORT: 'transport',
  SHOPPING: 'shopping',
  ENTERTAINMENT: 'entertainment',
  UTILITIES: 'utilities',
  HEALTHCARE: 'healthcare',
  EDUCATION: 'education',
  SALARY: 'salary',
  TRANSFER: 'transfer',
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  OTHER: 'other'
};

// Статусы пользователей
export const USER_STATUS = {
  INDIVIDUAL: 'individual',
  BUSINESS: 'business',
  VIP: 'vip',
  PREMIUM: 'premium'
};

// Типы уведомлений
export const NOTIFICATION_TYPES = {
  PUSH: 'push',
  EMAIL: 'email',
  SMS: 'sms',
  SECURITY: 'security'
};

// Лимиты
export const LIMITS = {
  MAX_TRANSACTION_AMOUNT: 10000000, // 10 млн тенге
  MIN_TRANSACTION_AMOUNT: 1, // 1 тенге
  MAX_TRANSFER_AMOUNT: 5000000, // 5 млн тенге
  MIN_TRANSFER_AMOUNT: 100, // 100 тенге
  MAX_PASSWORD_LENGTH: 50,
  MIN_PASSWORD_LENGTH: 6,
  MAX_NAME_LENGTH: 100,
  MIN_NAME_LENGTH: 2
};

// Валюты
export const CURRENCIES = {
  KZT: 'KZT',
  USD: 'USD',
  EUR: 'EUR',
  RUB: 'RUB'
};

// Языки
export const LANGUAGES = {
  RU: 'ru',
  KZ: 'kz',
  EN: 'en'
};

// Тема приложения
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Размеры экранов
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

// API эндпоинты
export const API_ENDPOINTS = {
  // Авторизация
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  },
  
  // Клиент
  CLIENT: {
    PROFILE: '/client/profile',
    BALANCE: '/client/balance',
    UPDATE_PROFILE: '/client/profile',
    CHANGE_PASSWORD: '/client/change-password'
  },
  
  // Транзакции
  TRANSACTIONS: {
    LIST: '/transactions',
    CREATE: '/transactions',
    GET: '/transactions/:id',
    UPDATE: '/transactions/:id',
    DELETE: '/transactions/:id'
  },
  
  // Переводы
  TRANSFERS: {
    LIST: '/transfers',
    CREATE: '/transfers',
    GET: '/transfers/:id',
    UPDATE: '/transfers/:id',
    DELETE: '/transfers/:id'
  },
  
  // Push-уведомления
  PUSH: {
    LATEST: '/push/latest',
    GENERATE: '/push/generate',
    RECOMMENDATION: '/recommendation/:clientCode',
    DOWNLOAD: '/pushes/download'
  }
};

// Сообщения об ошибках
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
  UNAUTHORIZED: 'Необходима авторизация.',
  FORBIDDEN: 'Доступ запрещен.',
  NOT_FOUND: 'Ресурс не найден.',
  SERVER_ERROR: 'Внутренняя ошибка сервера.',
  VALIDATION_ERROR: 'Ошибка валидации данных.',
  INVALID_CREDENTIALS: 'Неверный логин или пароль.',
  USER_EXISTS: 'Пользователь с таким кодом уже существует.',
  WEAK_PASSWORD: 'Пароль должен содержать минимум 6 символов.',
  INVALID_EMAIL: 'Неверный формат email адреса.',
  INVALID_PHONE: 'Неверный формат номера телефона.',
  INSUFFICIENT_FUNDS: 'Недостаточно средств на счете.',
  TRANSACTION_LIMIT: 'Превышен лимит транзакции.',
  INVALID_AMOUNT: 'Неверная сумма операции.'
};

// Сообщения об успехе
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Успешный вход в систему.',
  REGISTER_SUCCESS: 'Регистрация прошла успешно.',
  LOGOUT_SUCCESS: 'Вы вышли из системы.',
  PROFILE_UPDATED: 'Профиль обновлен.',
  PASSWORD_CHANGED: 'Пароль изменен.',
  TRANSACTION_CREATED: 'Транзакция создана.',
  TRANSFER_CREATED: 'Перевод создан.',
  PUSH_GENERATED: 'Уведомление сгенерировано.',
  DATA_DOWNLOADED: 'Данные скачаны.'
};

// Локальное хранилище ключи
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  NOTIFICATIONS: 'notifications'
};

// Время жизни токена (в миллисекундах)
export const TOKEN_LIFETIME = {
  ACCESS: 15 * 60 * 1000, // 15 минут
  REFRESH: 7 * 24 * 60 * 60 * 1000 // 7 дней
};

// Интервалы обновления данных (в миллисекундах)
export const REFRESH_INTERVALS = {
  BALANCE: 30 * 1000, // 30 секунд
  TRANSACTIONS: 60 * 1000, // 1 минута
  TRANSFERS: 60 * 1000, // 1 минута
  PUSH: 5 * 60 * 1000 // 5 минут
};

// Регулярные выражения
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+7\s?\(?[0-9]{3}\)?\s?[0-9]{3}-?[0-9]{2}-?[0-9]{2}$/,
  CARD_NUMBER: /^[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}$/,
  ACCOUNT_NUMBER: /^[0-9]{20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/
};

// Настройки по умолчанию
export const DEFAULT_SETTINGS = {
  NOTIFICATIONS: {
    push: true,
    email: true,
    sms: false,
    security: true
  },
  THEME: 'light',
  LANGUAGE: 'ru',
  CURRENCY: 'KZT',
  DATE_FORMAT: 'dd.MM.yyyy',
  TIME_FORMAT: 'HH:mm'
};

export default {
  TRANSACTION_STATUS,
  TRANSFER_TYPE,
  TRANSACTION_CATEGORIES,
  USER_STATUS,
  NOTIFICATION_TYPES,
  LIMITS,
  CURRENCIES,
  LANGUAGES,
  THEMES,
  BREAKPOINTS,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  TOKEN_LIFETIME,
  REFRESH_INTERVALS,
  REGEX_PATTERNS,
  DEFAULT_SETTINGS
};

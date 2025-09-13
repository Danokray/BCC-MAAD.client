import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// Форматирование валюты (тенге)
export const formatCurrency = (amount, options = {}) => {
  const defaultOptions = {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  return new Intl.NumberFormat('ru-KZ', { ...defaultOptions, ...options }).format(amount);
};

// Форматирование даты
export const formatDate = (dateString, formatString = 'dd.MM.yyyy') => {
  if (!dateString) return '—';
  return format(new Date(dateString), formatString, { locale: ru });
};

// Форматирование даты и времени
export const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: ru });
};

// Форматирование номера телефона
export const formatPhoneNumber = (phone) => {
  if (!phone) return '—';
  
  // Убираем все нецифровые символы
  const cleaned = phone.replace(/\D/g, '');
  
  // Форматируем казахстанский номер
  if (cleaned.length === 11 && cleaned.startsWith('7')) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
  }
  
  return phone;
};

// Форматирование номера счета/карты
export const formatAccountNumber = (accountNumber) => {
  if (!accountNumber) return '—';
  
  // Убираем все нецифровые символы
  const cleaned = accountNumber.replace(/\D/g, '');
  
  // Форматируем по 4 цифры
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
};

// Форматирование большого числа
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '—';
  return new Intl.NumberFormat('ru-KZ').format(number);
};

// Сокращение больших чисел (K, M, B)
export const formatCompactNumber = (number) => {
  if (number === null || number === undefined) return '—';
  
  const formatter = new Intl.NumberFormat('ru-KZ', {
    notation: 'compact',
    compactDisplay: 'short'
  });
  
  return formatter.format(number);
};

// Форматирование процентов
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return '—';
  return `${value.toFixed(decimals)}%`;
};

// Форматирование времени (относительное)
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '—';
  
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'только что';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} мин. назад`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ч. назад`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} дн. назад`;
  } else {
    return formatDate(dateString);
  }
};

// Форматирование статуса транзакции
export const formatTransactionStatus = (status) => {
  const statusMap = {
    completed: 'Завершена',
    pending: 'В обработке',
    failed: 'Ошибка',
    cancelled: 'Отменена',
    processing: 'Обрабатывается'
  };
  
  return statusMap[status] || 'Неизвестно';
};

// Форматирование типа перевода
export const formatTransferType = (type) => {
  const typeMap = {
    outgoing: 'Исходящий',
    incoming: 'Входящий',
    internal: 'Внутренний',
    external: 'Внешний'
  };
  
  return typeMap[type] || 'Неизвестно';
};

// Форматирование категории транзакции
export const formatTransactionCategory = (category) => {
  const categoryMap = {
    food: 'Питание',
    transport: 'Транспорт',
    shopping: 'Покупки',
    entertainment: 'Развлечения',
    utilities: 'Коммунальные услуги',
    healthcare: 'Здравоохранение',
    education: 'Образование',
    salary: 'Зарплата',
    transfer: 'Перевод',
    deposit: 'Пополнение',
    withdrawal: 'Снятие',
    other: 'Прочее'
  };
  
  return categoryMap[category] || category || '—';
};

// Маска для ввода номера телефона
export const phoneMask = (value) => {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length <= 1) {
    return cleaned;
  } else if (cleaned.length <= 4) {
    return `+7 (${cleaned.slice(1)}`;
  } else if (cleaned.length <= 7) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4)}`;
  } else if (cleaned.length <= 9) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  } else {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }
};

// Маска для ввода номера карты
export const cardMask = (value) => {
  const cleaned = value.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g) || [];
  return groups.join(' ').slice(0, 19); // Максимум 16 цифр + 3 пробела
};

// Валидация email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Валидация номера телефона
export const isValidPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 11 && cleaned.startsWith('7');
};

// Валидация номера карты (простая проверка длины)
export const isValidCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  return cleaned.length >= 13 && cleaned.length <= 19;
};

export default {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPhoneNumber,
  formatAccountNumber,
  formatNumber,
  formatCompactNumber,
  formatPercentage,
  formatRelativeTime,
  formatTransactionStatus,
  formatTransferType,
  formatTransactionCategory,
  phoneMask,
  cardMask,
  isValidEmail,
  isValidPhone,
  isValidCardNumber
};

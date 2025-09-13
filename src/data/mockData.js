// Демонстрационные данные для тестирования приложения

export const mockUser = {
  id: '1',
  client_code: 'test123',
  name: 'Айдар Нурланов',
  email: 'aidar.nurlanov@example.com',
  status: 'individual',
  city: 'Алматы',
  age: 28,
  created_at: '2023-01-15T10:30:00Z',
  updated_at: '2024-01-15T10:30:00Z'
};

export const mockProfile = {
  name: 'Айдар Нурланов',
  age: 28,
  status: 'individual',
  average_balance: 1250000,
  city: 'Алматы'
};

export const mockBalance = {
  current_balance: 1850000,
  currency: 'KZT',
  last_updated: '2024-01-15T10:30:00Z'
};

export const mockTransactions = [
  {
    id: '1',
    amount: -15000,
    description: 'Покупка в супермаркете "Магнум"',
    category: 'food',
    date: '2024-01-15T14:30:00Z',
    status: 'completed',
    reference: 'TXN001234567'
  },
  {
    id: '2',
    amount: -2500,
    description: 'Оплата проезда в автобусе',
    category: 'transport',
    date: '2024-01-15T08:15:00Z',
    status: 'completed',
    reference: 'TXN001234568'
  },
  {
    id: '3',
    amount: 250000,
    description: 'Зарплата',
    category: 'salary',
    date: '2024-01-14T09:00:00Z',
    status: 'completed',
    reference: 'TXN001234569'
  },
  {
    id: '4',
    amount: -45000,
    description: 'Оплата коммунальных услуг',
    category: 'utilities',
    date: '2024-01-13T16:45:00Z',
    status: 'completed',
    reference: 'TXN001234570'
  },
  {
    id: '5',
    amount: -12000,
    description: 'Покупка лекарств в аптеке',
    category: 'healthcare',
    date: '2024-01-12T11:20:00Z',
    status: 'completed',
    reference: 'TXN001234571'
  },
  {
    id: '6',
    amount: -8500,
    description: 'Обед в ресторане',
    category: 'food',
    date: '2024-01-11T13:30:00Z',
    status: 'completed',
    reference: 'TXN001234572'
  },
  {
    id: '7',
    amount: -35000,
    description: 'Покупка одежды',
    category: 'shopping',
    date: '2024-01-10T15:15:00Z',
    status: 'completed',
    reference: 'TXN001234573'
  },
  {
    id: '8',
    amount: -18000,
    description: 'Билеты в кино',
    category: 'entertainment',
    date: '2024-01-09T19:00:00Z',
    status: 'completed',
    reference: 'TXN001234574'
  }
];

export const mockTransfers = [
  {
    id: '1',
    type: 'outgoing',
    amount: 50000,
    recipient: 'Асель Касымова',
    recipient_account: '****1234',
    description: 'Перевод на день рождения',
    date: '2024-01-15T12:00:00Z',
    status: 'completed',
    reference: 'TRF001234567'
  },
  {
    id: '2',
    type: 'incoming',
    amount: 75000,
    recipient: 'Марат Алиев',
    recipient_account: '****5678',
    description: 'Возврат долга',
    date: '2024-01-14T16:30:00Z',
    status: 'completed',
    reference: 'TRF001234568'
  },
  {
    id: '3',
    type: 'outgoing',
    amount: 120000,
    recipient: 'Айгуль Нурланова',
    recipient_account: '****9012',
    description: 'Помощь родителям',
    date: '2024-01-13T10:15:00Z',
    status: 'completed',
    reference: 'TRF001234569'
  },
  {
    id: '4',
    type: 'outgoing',
    amount: 25000,
    recipient: 'Динара Сейтжанова',
    recipient_account: '****3456',
    description: 'Оплата за обед',
    date: '2024-01-12T14:45:00Z',
    status: 'pending',
    reference: 'TRF001234570'
  },
  {
    id: '5',
    type: 'incoming',
    amount: 30000,
    recipient: 'Ерлан Токтаров',
    recipient_account: '****7890',
    description: 'Возврат за билеты',
    date: '2024-01-11T18:20:00Z',
    status: 'completed',
    reference: 'TRF001234571'
  }
];

export const mockPushNotification = {
  id: '1',
  message: 'Ваш баланс пополнился на 250,000 ₸. Проверьте детали в приложении.',
  type: 'balance_update',
  created_at: '2024-01-15T09:00:00Z',
  read: false
};

export const mockRecommendation = {
  product_name: 'Депозит "Выгодный"',
  push_text: 'Откройте депозит "Выгодный" под 12% годовых и получите дополнительный доход!',
  category: 'deposit',
  priority: 1
};

// Функции для генерации случайных данных
export const generateRandomTransaction = () => {
  const categories = ['food', 'transport', 'shopping', 'entertainment', 'utilities', 'healthcare', 'education', 'salary'];
  const descriptions = [
    'Покупка в супермаркете',
    'Оплата проезда',
    'Покупка одежды',
    'Билеты в кино',
    'Коммунальные услуги',
    'Покупка лекарств',
    'Оплата курсов',
    'Зарплата'
  ];
  
  const category = categories[Math.floor(Math.random() * categories.length)];
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  const amount = Math.floor(Math.random() * 100000) - 50000; // От -50,000 до +50,000
  const date = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    amount,
    description,
    category,
    date: date.toISOString(),
    status: 'completed',
    reference: `TXN${Math.floor(Math.random() * 1000000000)}`
  };
};

export const generateRandomTransfer = () => {
  const types = ['outgoing', 'incoming'];
  const recipients = ['Асель Касымова', 'Марат Алиев', 'Айгуль Нурланова', 'Динара Сейтжанова', 'Ерлан Токтаров'];
  const descriptions = [
    'Перевод на день рождения',
    'Возврат долга',
    'Помощь родителям',
    'Оплата за обед',
    'Возврат за билеты'
  ];
  
  const type = types[Math.floor(Math.random() * types.length)];
  const recipient = recipients[Math.floor(Math.random() * recipients.length)];
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  const amount = Math.floor(Math.random() * 200000) + 10000; // От 10,000 до 210,000
  const date = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    amount,
    recipient,
    recipient_account: `****${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    description,
    date: date.toISOString(),
    status: 'completed',
    reference: `TRF${Math.floor(Math.random() * 1000000000)}`
  };
};

// Генерация массива случайных транзакций
export const generateRandomTransactions = (count = 20) => {
  return Array.from({ length: count }, generateRandomTransaction);
};

// Генерация массива случайных переводов
export const generateRandomTransfers = (count = 15) => {
  return Array.from({ length: count }, generateRandomTransfer);
};

export default {
  mockUser,
  mockProfile,
  mockBalance,
  mockTransactions,
  mockTransfers,
  mockPushNotification,
  mockRecommendation,
  generateRandomTransaction,
  generateRandomTransfer,
  generateRandomTransactions,
  generateRandomTransfers
};

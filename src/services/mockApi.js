// Мок API для тестирования без backend

// Имитация localStorage для хранения пользователей
const mockUsers = [
  {
    id: '1',
    client_code: 'test123',
    password: 'password123',
    name: 'Тестовый Пользователь',
    status: 'individual',
    city: 'Алматы',
    age: 28,
    created_at: new Date().toISOString()
  }
];

// Имитация задержки API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Мок API для авторизации
export const mockAuthAPI = {
  // Регистрация
  register: async (userData) => {
    await delay(1000); // Имитация задержки
    
    // Проверяем, существует ли пользователь
    const existingUser = mockUsers.find(user => user.client_code === userData.client_code);
    if (existingUser) {
      throw new Error('Пользователь с таким кодом уже существует');
    }
    
    // Создаем нового пользователя
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      created_at: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    
    // Генерируем токен
    const token = 'mock_token_' + Date.now();
    
    return {
      token,
      user: {
        id: newUser.id,
        client_code: newUser.client_code,
        name: newUser.name,
        status: newUser.status,
        city: newUser.city
      }
    };
  },

  // Вход
  login: async (credentials) => {
    await delay(1000); // Имитация задержки
    
    const user = mockUsers.find(u => 
      u.client_code === credentials.client_code && 
      u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Неверный код клиента или пароль');
    }
    
    // Генерируем токен
    const token = 'mock_token_' + Date.now();
    
    return {
      token,
      user: {
        id: user.id,
        client_code: user.client_code,
        name: user.name,
        status: user.status,
        city: user.city
      }
    };
  },

  // Получение данных пользователя
  getCurrentUser: async () => {
    await delay(500);
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Токен не найден');
    }
    
    // Находим пользователя по токену (упрощенная логика)
    const user = mockUsers[0]; // Для демо берем первого пользователя
    
    return {
      id: user.id,
      client_code: user.client_code,
      name: user.name,
      status: user.status,
      city: user.city
    };
  }
};

// Мок API для клиентского кабинета
export const mockClientAPI = {
  getProfile: async () => {
    await delay(500);
    return {
      name: 'Тестовый Пользователь',
      age: 28,
      status: 'individual',
      average_balance: 1250000,
      city: 'Алматы'
    };
  },

  getBalance: async () => {
    await delay(500);
    return {
      current_balance: 1850000,
      currency: 'KZT',
      last_updated: new Date().toISOString()
    };
  }
};

// Мок API для транзакций
export const mockTransactionsAPI = {
  getTransactions: async (params = {}) => {
    await delay(500);
    
    const mockTransactions = [
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
      }
    ];
    
    return {
      transactions: mockTransactions,
      total: mockTransactions.length
    };
  },

  createTransaction: async (transactionData) => {
    await delay(1000);
    
    const newTransaction = {
      id: Date.now().toString(),
      ...transactionData,
      status: 'completed',
      reference: 'TXN' + Date.now()
    };
    
    return newTransaction;
  }
};

// Мок API для переводов
export const mockTransfersAPI = {
  getTransfers: async (params = {}) => {
    await delay(500);
    
    const mockTransfers = [
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
      }
    ];
    
    return {
      transfers: mockTransfers,
      total: mockTransfers.length
    };
  },

  createTransfer: async (transferData) => {
    await delay(1000);
    
    const newTransfer = {
      id: Date.now().toString(),
      ...transferData,
      status: 'completed',
      reference: 'TRF' + Date.now()
    };
    
    return newTransfer;
  }
};

// Мок API для push-уведомлений
export const mockPushAPI = {
  getLatestPush: async () => {
    await delay(500);
    return {
      id: '1',
      message: 'Ваш баланс пополнился на 250,000 ₸. Проверьте детали в приложении.',
      type: 'balance_update',
      created_at: new Date().toISOString(),
      read: false
    };
  },

  generatePush: async () => {
    await delay(1000);
    return {
      id: Date.now().toString(),
      message: 'Новое уведомление сгенерировано! Проверьте ваши рекомендации.',
      type: 'recommendation',
      created_at: new Date().toISOString(),
      read: false
    };
  },

  getRecommendation: async (clientCode) => {
    await delay(500);
    return {
      product_name: 'Депозит "Выгодный"',
      push_text: 'Откройте депозит "Выгодный" под 12% годовых и получите дополнительный доход!',
      category: 'deposit',
      priority: 1
    };
  },

  downloadPushes: async () => {
    await delay(1000);
    return 'client_code,message,date\ntest123,Test message,2024-01-15';
  }
};

const mockApi = {
  mockAuthAPI,
  mockClientAPI,
  mockTransactionsAPI,
  mockTransfersAPI,
  mockPushAPI
};

export default mockApi;

// Утилита для тестирования подключения к API
import { authAPI, clientAPI, transactionsAPI, transfersAPI, pushAPI } from '../services/api';

export const testApiConnection = async () => {
  console.log('🔍 Тестирование подключения к API...');
  console.log('📍 API URL: https://localhost:7175');
  
  const results = {
    auth: false,
    client: false,
    transactions: false,
    transfers: false,
    push: false
  };

  try {
    // Тест Auth API
    console.log('🔐 Тестирование Auth API...');
    try {
      await authAPI.getCurrentUser();
      results.auth = true;
      console.log('✅ Auth API: Подключение успешно');
    } catch (error) {
      console.log('⚠️ Auth API: Ошибка (ожидаемо без токена):', error.message);
    }

    // Тест Client API
    console.log('👤 Тестирование Client API...');
    try {
      await clientAPI.getProfile();
      results.client = true;
      console.log('✅ Client API: Подключение успешно');
    } catch (error) {
      console.log('⚠️ Client API: Ошибка (ожидаемо без авторизации):', error.message);
    }

    // Тест Transactions API
    console.log('💳 Тестирование Transactions API...');
    try {
      await transactionsAPI.getTransactions();
      results.transactions = true;
      console.log('✅ Transactions API: Подключение успешно');
    } catch (error) {
      console.log('⚠️ Transactions API: Ошибка (ожидаемо без авторизации):', error.message);
    }

    // Тест Transfers API
    console.log('🔄 Тестирование Transfers API...');
    try {
      await transfersAPI.getTransfers();
      results.transfers = true;
      console.log('✅ Transfers API: Подключение успешно');
    } catch (error) {
      console.log('⚠️ Transfers API: Ошибка (ожидаемо без авторизации):', error.message);
    }

    // Тест Push API
    console.log('📱 Тестирование Push API...');
    try {
      await pushAPI.getLatestPush();
      results.push = true;
      console.log('✅ Push API: Подключение успешно');
    } catch (error) {
      console.log('⚠️ Push API: Ошибка (ожидаемо без авторизации):', error.message);
    }

  } catch (error) {
    console.error('❌ Критическая ошибка подключения:', error);
  }

  // Итоговый отчет
  console.log('\n📊 Итоговый отчет:');
  console.log('==================');
  Object.entries(results).forEach(([api, success]) => {
    console.log(`${success ? '✅' : '❌'} ${api.toUpperCase()} API: ${success ? 'Доступен' : 'Недоступен'}`);
  });

  const availableApis = Object.values(results).filter(Boolean).length;
  const totalApis = Object.keys(results).length;
  
  console.log(`\n🎯 Результат: ${availableApis}/${totalApis} API доступны`);
  
  if (availableApis === 0) {
    console.log('❌ Сервер недоступен. Убедитесь, что .NET бэкенд запущен на localhost:7175');
  } else if (availableApis === totalApis) {
    console.log('🎉 Все API доступны! Подключение к бэкенду работает корректно.');
  } else {
    console.log('⚠️ Частичное подключение. Некоторые API недоступны.');
  }

  return results;
};

// Функция для тестирования конкретного API
export const testSpecificApi = async (apiName) => {
  const apis = {
    auth: authAPI,
    client: clientAPI,
    transactions: transactionsAPI,
    transfers: transfersAPI,
    push: pushAPI
  };

  const api = apis[apiName];
  if (!api) {
    console.error(`❌ API "${apiName}" не найден`);
    return false;
  }

  console.log(`🔍 Тестирование ${apiName.toUpperCase()} API...`);
  
  try {
    // Пробуем разные методы в зависимости от API
    switch (apiName) {
      case 'auth':
        await api.getCurrentUser();
        break;
      case 'client':
        await api.getProfile();
        break;
      case 'transactions':
        await api.getTransactions();
        break;
      case 'transfers':
        await api.getTransfers();
        break;
      case 'push':
        await api.getLatestPush();
        break;
      default:
        throw new Error(`Неизвестный API: ${apiName}`);
    }
    
    console.log(`✅ ${apiName.toUpperCase()} API: Подключение успешно`);
    return true;
  } catch (error) {
    console.log(`❌ ${apiName.toUpperCase()} API: Ошибка -`, error.message);
    return false;
  }
};

// Функция для тестирования логина с разными данными
export const testLoginWithData = async (credentials) => {
  console.log('🔍 Тестирование логина с данными:', credentials);
  
  try {
    const response = await authAPI.login(credentials);
    console.log('✅ Логин успешен:', response);
    return response;
  } catch (error) {
    console.error('❌ Ошибка логина:', error);
    console.error('❌ Статус:', error.response?.status);
    console.error('❌ Данные ошибки:', error.response?.data);
    return null;
  }
};

// Функция для тестирования правильного формата данных
export const testCorrectLoginFormat = async () => {
  console.log('🧪 Тестирование правильного формата данных...');
  
  // Тест с правильными названиями полей
  const correctFormat = { clientCode: "1", password: "1234" };
  console.log('📝 Тестируем:', correctFormat);
  
  return await testLoginWithData(correctFormat);
};

// Экспорт для использования в консоли браузера
if (typeof window !== 'undefined') {
  window.testApiConnection = testApiConnection;
  window.testSpecificApi = testSpecificApi;
  window.testLoginWithData = testLoginWithData;
  window.testCorrectLoginFormat = testCorrectLoginFormat;
}

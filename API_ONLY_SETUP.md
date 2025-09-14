# Настройка только API (без моковых данных)

## ✅ Что было сделано

### 1. **Удалены моковые данные**
- ❌ Удален файл `src/data/mockData.js`
- ❌ Удален файл `src/utils/testApiConnection.js`
- ❌ Убраны все упоминания `useMockApi` из конфигурации

### 2. **Очищена конфигурация API**
- ✅ Обновлен `src/services/api.js` - убраны `useMockApi` флаги
- ✅ Обновлен `src/config/api.ts` - убраны `useMockApi` флаги
- ✅ Оставлены только реальные API endpoints

### 3. **Проверены все страницы**
- ✅ `TransactionsPage.js` - использует только `transactionsAPI.getTransactions()`
- ✅ `DashboardPage.js` - использует только API endpoints
- ✅ `TransfersPage.js` - использует только `transfersAPI`

## 🔗 API Endpoints

### **Transactions API**
- `GET /transactions` - получение списка транзакций
- `POST /transactions` - добавление новой транзакции

### **Client API**
- `GET /client/profile` - получение профиля клиента
- `GET /client/balance` - получение баланса

### **Transfers API**
- `GET /transfers` - получение списка переводов
- `POST /transfers` - создание нового перевода

### **Auth API**
- `POST /auth/login` - вход в систему
- `POST /auth/register` - регистрация
- `GET /auth/me` - получение данных текущего пользователя

## 🚀 Как работает

1. **Все данные загружаются только из API**
2. **Нет fallback на моковые данные**
3. **При ошибке API показывается сообщение об ошибке**
4. **Есть кнопки для повторной загрузки данных**

## 📍 API URL

- **Development**: `https://localhost:7175`
- **Production**: `https://api.bcc.kz`

## ⚠️ Важно

- Убедитесь, что .NET бэкенд запущен на `https://localhost:7175`
- Все данные теперь приходят только из реального API
- При недоступности API будут показываться ошибки, а не моковые данные

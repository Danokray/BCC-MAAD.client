# Инструкция по настройке и запуску

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка переменных окружения
Скопируйте файл `env.example` в `.env`:
```bash
cp env.example .env
```

Отредактируйте `.env` файл:
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_NAME=Bank Center Credit Portal
REACT_APP_VERSION=1.0.0
```

### 3. Запуск в режиме разработки
```bash
npm start
```

Приложение будет доступно по адресу: http://localhost:3000

## 🔧 Настройка Backend API

Убедитесь, что backend API запущен на порту 3001 и доступен по адресу, указанному в `REACT_APP_API_URL`.

### Требуемые эндпоинты:
- `POST /auth/register` - Регистрация
- `POST /auth/login` - Вход
- `GET /auth/me` - Данные пользователя
- `GET /client/profile` - Профиль клиента
- `GET /client/balance` - Баланс
- `GET /transactions` - Список транзакций
- `POST /transactions` - Добавить транзакцию
- `GET /transfers` - Список переводов
- `POST /transfers` - Создать перевод
- `GET /push/latest` - Последний пуш
- `POST /push/generate` - Генерация пуша
- `GET /recommendation/{client_code}` - Рекомендации
- `GET /pushes/download` - Скачивание CSV

## 📱 Тестирование

### Тестовые данные для входа:
- **Код клиента**: `test123`
- **Пароль**: `password123`

### Или зарегистрируйте нового пользователя:
- Заполните форму регистрации
- Используйте любые данные для тестирования

## 🎨 Кастомизация

### Изменение цветовой схемы
Отредактируйте файл `src/styles/theme.js`:
```javascript
export const theme = {
  colors: {
    primary: '#1e3a8a',      // Основной цвет BCC
    primaryLight: '#3b82f6', // Светлый оттенок
    // ... другие цвета
  }
};
```

### Изменение логотипа
Замените компонент логотипа в `src/components/layout/Header.js`:
```javascript
const LogoIcon = styled.div`
  // Ваш логотип здесь
`;
```

## 🔒 Безопасность

### JWT токены
- Токены автоматически сохраняются в localStorage
- Автоматическое обновление при истечении
- Защищенные маршруты

### CORS настройки
Убедитесь, что backend настроен для работы с фронтендом:
```javascript
// Backend CORS настройки
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

## 📦 Сборка для продакшена

### 1. Сборка проекта
```bash
npm run build
```

### 2. Тестирование сборки
```bash
npm install -g serve
serve -s build
```

### 3. Развертывание
Загрузите содержимое папки `build` на ваш веб-сервер.

## 🐛 Отладка

### Консоль разработчика
Откройте DevTools (F12) для просмотра:
- Ошибок JavaScript
- Сетевых запросов
- Состояния Redux (если используется)

### Логи API
Все API запросы логируются в консоль в режиме разработки.

### Проверка токенов
```javascript
// В консоли браузера
console.log('Token:', localStorage.getItem('authToken'));
console.log('User:', localStorage.getItem('user'));
```

## 🔄 Обновления

### Обновление зависимостей
```bash
npm update
```

### Проверка устаревших пакетов
```bash
npm outdated
```

## 📊 Производительность

### Оптимизация сборки
```bash
npm run build
# Анализ размера bundle
npx webpack-bundle-analyzer build/static/js/*.js
```

### Lazy loading
Компоненты страниц уже настроены для ленивой загрузки.

## 🌐 Интернационализация

### Добавление нового языка
1. Создайте файл переводов в `src/locales/`
2. Обновите `src/constants/index.js`
3. Добавьте переключатель языка в настройки

## 📱 PWA функции

### Манифест
Файл `public/manifest.json` настроен для PWA.

### Service Worker
Добавьте service worker для офлайн работы:
```bash
npm install workbox-webpack-plugin
```

## 🧪 Тестирование

### Запуск тестов
```bash
npm test
```

### E2E тестирование
```bash
npm install cypress
npx cypress open
```

## 📈 Мониторинг

### Аналитика
Добавьте Google Analytics или другую систему аналитики в `src/index.js`.

### Ошибки
Настройте Sentry или другую систему мониторинга ошибок.

## 🔧 Дополнительные настройки

### Environment переменные
```env
# API
REACT_APP_API_URL=http://localhost:3001
REACT_APP_API_TIMEOUT=10000

# Аналитика
REACT_APP_GA_TRACKING_ID=UA-XXXXXXXXX-X

# Мониторинг
REACT_APP_SENTRY_DSN=https://...

# Функции
REACT_APP_ENABLE_PWA=true
REACT_APP_ENABLE_ANALYTICS=true
```

### Кастомные настройки
Создайте файл `src/config/index.js` для централизованной конфигурации.

## 📞 Поддержка

При возникновении проблем:
1. Проверьте консоль браузера на ошибки
2. Убедитесь, что backend API доступен
3. Проверьте переменные окружения
4. Обратитесь к команде разработки

---

**Bank Center Credit** - Надежный партнер в цифровом банкинге

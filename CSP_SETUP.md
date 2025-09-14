# Content Security Policy (CSP) Настройка

## 🔧 Что было исправлено

### Проблема
```
Content Security Policy of your site blocks the use of 'eval' in JavaScript
```

### Решение
Настроены разные CSP политики для development и production режимов.

## 📁 Файлы

### 1. `public/index.html` (Development)
- Разрешает `'unsafe-eval'` для работы с source maps
- Разрешает `'unsafe-inline'` для стилей
- Настроен для localhost:7175 API

### 2. `public/index.production.html` (Production)
- Строгий CSP без `'unsafe-eval'`
- Только необходимые разрешения
- Безопасен для production

### 3. `scripts/setup-env.js`
- Автоматически переключает CSP в зависимости от режима
- Копирует правильный index.html при сборке

## 🚀 Команды

```bash
# Development (с source maps и eval)
npm start

# Production build (строгий CSP)
npm run build

# Development build (с source maps)
npm run build:dev
```

## 🔒 CSP Политики

### Development CSP
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-eval' 'unsafe-inline' https://localhost:7175; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src 'self' https://fonts.gstatic.com; 
               connect-src 'self' https://localhost:7175 https://api.bcc.kz; 
               img-src 'self' data: blob:;">
```

### Production CSP
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self'; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src 'self' https://fonts.gstatic.com; 
               connect-src 'self' https://localhost:7175 https://api.bcc.kz; 
               img-src 'self' data: blob:;">
```

## ✅ Результат

- ✅ Development режим работает с source maps
- ✅ Production режим безопасен без eval()
- ✅ Автоматическое переключение CSP
- ✅ Нет ошибок CSP в консоли

## 🔍 Проверка

1. **Development**: `npm start` - должен работать без ошибок CSP
2. **Production**: `npm run build` - строгий CSP, безопасный для продакшена
3. **Консоль**: Проверьте отсутствие ошибок CSP в DevTools

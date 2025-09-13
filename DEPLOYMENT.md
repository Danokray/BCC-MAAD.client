# Руководство по развертыванию

## 🚀 Развертывание в продакшене

### 1. Подготовка к развертыванию

#### Сборка проекта
```bash
npm run build
```

#### Проверка сборки
```bash
# Установите serve глобально
npm install -g serve

# Запустите локальный сервер для тестирования
serve -s build -l 3000
```

### 2. Настройка переменных окружения для продакшена

Создайте файл `.env.production`:
```env
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_NAME=Bank Center Credit Portal
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
```

### 3. Оптимизация для продакшена

#### Анализ размера bundle
```bash
npm install -g webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

#### Сжатие изображений
```bash
npm install -g imagemin-cli
imagemin src/assets/images/* --out-dir=src/assets/images/optimized
```

## 🌐 Развертывание на различных платформах

### Netlify

#### Автоматическое развертывание
1. Подключите репозиторий к Netlify
2. Настройте команды сборки:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
3. Добавьте переменные окружения в настройках Netlify

#### Ручное развертывание
```bash
npm run build
# Загрузите содержимое папки build на Netlify
```

#### Netlify конфигурация
Создайте файл `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### Vercel

#### Автоматическое развертывание
1. Подключите репозиторий к Vercel
2. Vercel автоматически определит настройки React
3. Добавьте переменные окружения в настройках проекта

#### Ручное развертывание
```bash
npm install -g vercel
vercel --prod
```

#### Vercel конфигурация
Создайте файл `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### AWS S3 + CloudFront

#### Настройка S3
```bash
# Установите AWS CLI
aws configure

# Создайте bucket
aws s3 mb s3://your-bucket-name

# Загрузите файлы
aws s3 sync build/ s3://your-bucket-name --delete

# Настройте статический хостинг
aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html
```

#### Настройка CloudFront
1. Создайте CloudFront distribution
2. Укажите S3 bucket как origin
3. Настройте Default Root Object: `index.html`
4. Добавьте Error Pages для SPA:
   - Error Code: 403, 404
   - Response Page Path: `/index.html`
   - HTTP Response Code: 200

### Docker

#### Dockerfile
```dockerfile
# Многоэтапная сборка
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Nginx для продакшена
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Кэширование статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA роутинг
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Безопасность
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### Docker Compose
```yaml
version: '3.8'
services:
  bcc-frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_URL=https://your-api-domain.com
    restart: unless-stopped
```

### Kubernetes

#### Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bcc-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: bcc-frontend
  template:
    metadata:
      labels:
        app: bcc-frontend
    spec:
      containers:
      - name: bcc-frontend
        image: your-registry/bcc-frontend:latest
        ports:
        - containerPort: 80
        env:
        - name: REACT_APP_API_URL
          value: "https://your-api-domain.com"
---
apiVersion: v1
kind: Service
metadata:
  name: bcc-frontend-service
spec:
  selector:
    app: bcc-frontend
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

## 🔒 Безопасность

### HTTPS
- Обязательно используйте HTTPS в продакшене
- Настройте SSL сертификаты (Let's Encrypt, Cloudflare, etc.)

### Заголовки безопасности
```nginx
# Nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

### CORS настройки
Убедитесь, что backend настроен для работы с продакшен доменом:
```javascript
app.use(cors({
  origin: ['https://your-domain.com', 'https://www.your-domain.com'],
  credentials: true
}));
```

## 📊 Мониторинг и аналитика

### Google Analytics
```javascript
// src/index.js
import ReactGA from 'react-ga';

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-XXXXXXXXX-X');
  ReactGA.pageview(window.location.pathname + window.location.search);
}
```

### Sentry для мониторинга ошибок
```javascript
// src/index.js
import * as Sentry from '@sentry/react';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'YOUR_SENTRY_DSN',
    environment: 'production'
  });
}
```

### Performance мониторинг
```javascript
// src/index.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

if (process.env.NODE_ENV === 'production') {
  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
}
```

## 🔄 CI/CD

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test -- --coverage --watchAll=false
    
    - name: Build
      run: npm run build
      env:
        REACT_APP_API_URL: ${{ secrets.REACT_APP_API_URL }}
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './build'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### GitLab CI
```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm test -- --coverage --watchAll=false
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'

build:
  stage: build
  image: node:18
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - build/
    expire_in: 1 hour

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache curl
    - curl -X POST -H "Authorization: Bearer $NETLIFY_TOKEN" -H "Content-Type: application/zip" --data-binary @build.zip https://api.netlify.com/api/v1/sites/$NETLIFY_SITE_ID/deploys
  dependencies:
    - build
  only:
    - main
```

## 📱 PWA настройки

### Service Worker
```javascript
// public/sw.js
const CACHE_NAME = 'bcc-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
```

## 🔧 Оптимизация производительности

### Code Splitting
```javascript
// Lazy loading компонентов
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TransactionsPage = lazy(() => import('./pages/TransactionsPage'));
```

### Preloading критических ресурсов
```html
<!-- public/index.html -->
<link rel="preload" href="/static/css/main.css" as="style">
<link rel="preload" href="/static/js/main.js" as="script">
```

### CDN для статических ресурсов
```javascript
// Настройка CDN в package.json
"homepage": "https://cdn.your-domain.com/bcc-portal"
```

## 📋 Чек-лист развертывания

- [ ] Сборка проекта без ошибок
- [ ] Тестирование на локальном сервере
- [ ] Настройка переменных окружения
- [ ] Настройка HTTPS
- [ ] Настройка CORS на backend
- [ ] Настройка мониторинга
- [ ] Настройка аналитики
- [ ] Тестирование в продакшене
- [ ] Настройка резервного копирования
- [ ] Документация для команды

## 🆘 Устранение неполадок

### Проблемы с роутингом
```nginx
# Nginx - SPA роутинг
location / {
    try_files $uri $uri/ /index.html;
}
```

### Проблемы с CORS
```javascript
// Backend - настройка CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### Проблемы с кэшированием
```nginx
# Nginx - отключение кэширования для index.html
location = /index.html {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}
```

---

**Bank Center Credit** - Надежное развертывание для вашего успеха

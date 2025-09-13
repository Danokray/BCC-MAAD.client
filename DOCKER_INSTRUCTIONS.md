# Docker инструкции для ReactJS проекта

## Обзор

Проект настроен для контейнеризации с использованием двухэтапной сборки Docker:
- **Этап 1**: Node.js 18 Alpine для установки зависимостей и сборки приложения
- **Этап 2**: Nginx Alpine для раздачи статических файлов

## Предварительные требования

1. **Docker Desktop** должен быть установлен и запущен
2. **Node.js** (для локальной разработки, опционально)
3. **Git** для клонирования проекта

### Проверка Docker
```cmd
docker --version
docker run hello-world
```

## Сборка и развертывание

### 1. Подготовка проекта

```cmd
# Переход в директорию проекта
cd C:\Users\rayev\bcc

# Проверка наличия файлов
dir
```

### 2. Сборка Docker образа

```cmd
# Сборка образа с тегом bcc-frontend
docker build -t bcc-frontend .

# Сборка с очисткой кэша (если нужна пересборка)
docker build -t bcc-frontend . --no-cache
```

### 3. Запуск контейнера

#### Базовый запуск:
```cmd
docker run -d -p 3000:80 --name bcc-app bcc-frontend
```

#### Запуск с дополнительными параметрами:
```cmd
docker run -d -p 3000:80 --name bcc-app --restart unless-stopped bcc-frontend
```

#### Запуск с переменными окружения:
```cmd
docker run -d -p 3000:80 --name bcc-app -e NODE_ENV=production bcc-frontend
```

### 4. Проверка работы

Откройте браузер и перейдите по адресу: **http://localhost:3000**

### 5. Управление контейнером

```cmd
# Просмотр запущенных контейнеров
docker ps

# Просмотр всех контейнеров (включая остановленные)
docker ps -a

# Остановка контейнера
docker stop bcc-app

# Запуск остановленного контейнера
docker start bcc-app

# Перезапуск контейнера
docker restart bcc-app

# Удаление контейнера
docker rm bcc-app

# Удаление контейнера с принудительным завершением
docker rm -f bcc-app
```

### 6. Мониторинг и отладка

```cmd
# Просмотр логов контейнера
docker logs bcc-app

# Просмотр логов в реальном времени
docker logs -f bcc-app

# Просмотр последних 100 строк логов
docker logs --tail 100 bcc-app

# Вход в контейнер для отладки
docker exec -it bcc-app sh

# Просмотр использования ресурсов
docker stats bcc-app
```

## Структура файлов

```
├── Dockerfile              # Основной Docker файл
├── nginx.conf             # Конфигурация Nginx
├── .dockerignore          # Исключения для Docker контекста
└── DOCKER_INSTRUCTIONS.md # Данная инструкция
```

## Особенности конфигурации

### Dockerfile
- Использует Node.js 18 Alpine для сборки
- Nginx Alpine для продакшена
- Двухэтапная сборка для оптимизации размера образа
- Порт 80 открыт для Nginx

### nginx.conf
- Настроен для SPA (Single Page Application)
- Все неизвестные маршруты перенаправляются на index.html
- Включено сжатие gzip
- Кэширование статических файлов
- Заголовки безопасности

### .dockerignore
- Исключает node_modules, build, логи
- Исключает файлы разработки и IDE
- Оптимизирует размер Docker контекста

## Развертывание в продакшене

### 1. Сборка для продакшена

```cmd
# Сборка образа для продакшена
docker build -t bcc-frontend:latest .

# Сборка с версионированием
docker build -t bcc-frontend:v1.0.0 .
```

### 2. Запуск в продакшене

```cmd
# Запуск с автоматическим перезапуском
docker run -d \
  -p 80:80 \
  --name bcc-production \
  --restart unless-stopped \
  -e NODE_ENV=production \
  bcc-frontend:latest
```

### 3. Обновление приложения

```cmd
# Остановка текущего контейнера
docker stop bcc-production

# Удаление старого контейнера
docker rm bcc-production

# Сборка нового образа
docker build -t bcc-frontend:latest .

# Запуск обновленного контейнера
docker run -d \
  -p 80:80 \
  --name bcc-production \
  --restart unless-stopped \
  -e NODE_ENV=production \
  bcc-frontend:latest
```

## Полезные команды

```cmd
# Просмотр всех образов
docker images

# Просмотр размера образа
docker images bcc-frontend

# Очистка неиспользуемых образов
docker image prune

# Очистка всех неиспользуемых ресурсов
docker system prune -a

# Экспорт образа в файл
docker save -o bcc-frontend.tar bcc-frontend:latest

# Импорт образа из файла
docker load -i bcc-frontend.tar

# Просмотр использования ресурсов
docker stats bcc-app
```

## Troubleshooting

### Проблема: Контейнер не запускается
```cmd
# Проверка логов
docker logs bcc-app

# Проверка статуса
docker ps -a

# Проверка деталей контейнера
docker inspect bcc-app
```

### Проблема: Приложение недоступно
- Убедитесь, что порт 3000 не занят другим приложением
- Проверьте, что контейнер запущен: `docker ps`
- Проверьте маппинг портов: `docker port bcc-app`
- Проверьте, что nginx запущен внутри контейнера

### Проблема: Ошибки сборки
- Убедитесь, что все файлы в рабочей директории
- Проверьте package.json на корректность зависимостей
- Обновите package-lock.json: `npm install`
- Очистите Docker кэш: `docker builder prune`
- Проверьте доступность интернета для загрузки зависимостей
- При ошибке "lock file's typescript does not satisfy" выполните `npm install` для синхронизации

### Проблема: Медленная сборка
- Используйте Docker BuildKit: `DOCKER_BUILDKIT=1 docker build -t bcc-frontend .`
- Проверьте .dockerignore файл
- Используйте многоэтапную сборку (уже настроена)

## Быстрый старт

```cmd
# 1. Переход в директорию проекта
cd C:\Users\rayev\bcc

# 2. Сборка образа
docker build -t bcc-frontend .

# 3. Запуск контейнера
docker run -d -p 3000:80 --name bcc-app bcc-frontend

# 4. Проверка работы
# Откройте http://localhost:3000 в браузере

# 5. Остановка (когда нужно)
docker stop bcc-app
docker rm bcc-app
```


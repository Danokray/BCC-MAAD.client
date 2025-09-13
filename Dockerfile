# Этап 1: Сборка приложения
FROM node:18-alpine AS build

# Установка рабочей директории
WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm ci --omit=dev

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN npm run build

# Этап 2: Nginx для раздачи статических файлов
FROM nginx:alpine

# Копирование собранного приложения
COPY --from=build /app/build /usr/share/nginx/html

# Копирование конфигурации nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Открытие порта 80
EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]


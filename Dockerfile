# Локальная разработка без nginx
FROM node:18-alpine

# Установка рабочей директории
WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка всех зависимостей (включая dev)
RUN npm install

# Копирование исходного кода
COPY . .

# Открытие порта 3000 для React dev server
EXPOSE 3000

# Запуск React приложения в режиме разработки
CMD ["npm", "start"]


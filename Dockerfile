# Базовый образ с Node.js
FROM node:20-alpine

# Рабочая директория внутри контейнера
WORKDIR /app

# Скопировать package.json и package-lock.json
COPY package*.json ./

# Установить зависимости
RUN npm install

# Скопировать весь проект
COPY . .

# Собрать проект (для Next.js)
RUN npm run build

# Указать порт, который будет слушать приложение
EXPOSE 3000

# Команда запуска
CMD ["npm", "run", "start"]

# Використовуємо офіційний образ Node.js
FROM node:16.16.0-alpine

# Встановлюємо робочу директорію контейнера
WORKDIR /app

# Копіюємо файли package.json та package-lock.json в контейнер
COPY package*.json ./

# Виконуємо установку залежностей
RUN npm ci

# Копіюємо весь вихідний код в контейнер
COPY . .

# Відкриваємо порт, який буде слухати додаток
EXPOSE 3000

# Виконуємо команду для збірки додатку
RUN npm run build

# Вказуємо команду, яку буде запускати контейнер
CMD [ "node", "dist/main" ]

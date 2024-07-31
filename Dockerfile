FROM node:20-alpine

WORKDIR /app

RUN apk update && apk add curl

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080
ENV PORT=8080

RUN npm run build

CMD ["npm", "start"]
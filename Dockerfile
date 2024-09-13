FROM node:20.16.0-alpine

WORKDIR /app

COPY package*.json .

RUN npm ci

RUN npm i --global cross-env

# COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
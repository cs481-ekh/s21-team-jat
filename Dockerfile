FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm run build-prod

COPY . .

EXPOSE 3000

ENTRYPOINT ["npm", "start"]
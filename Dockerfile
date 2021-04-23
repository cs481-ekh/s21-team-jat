FROM node:14.15.5-buster-slim

WORKDIR /app

COPY package*.json ./

# Dependencies
RUN apt update
RUN apt upgrade -y
RUN apt install python3-pip -y
RUN pip3 install --upgrade pip
RUN pip3 install pandas
RUN npm install -g pm2

RUN npm install

# Build
RUN npm run build-prod

COPY . .

EXPOSE 3000

ENTRYPOINT ["pm2-runtime", "ecosystem.config.js"]
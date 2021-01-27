FROM node:12.18.2

WORKDIR /usr/stc/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "node", "index.js" ]


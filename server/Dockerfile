FROM node

ARG NODE_ENV="development"

RUN mkdir /server

RUN mkdir -p /var/www/html/images

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9632

CMD npx sequelize db:migrate

CMD npx sequelize db:seed:all

CMD npm start
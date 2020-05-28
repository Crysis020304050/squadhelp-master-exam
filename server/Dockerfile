FROM node

ARG NODE_ENV="development"

RUN mkdir /server

RUN mkdir -p /var/www/html/images

WORKDIR /server

COPY package*.json ./

RUN npm install -g nodemon
RUN npm install -g sequelize-cli

RUN npm install

COPY . .

EXPOSE 9632

CMD npm start
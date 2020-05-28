FROM node

ARG NODE_ENV="development"

RUN mkdir -p ./client

WORKDIR /client

COPY package*.json ./

COPY . .



EXPOSE 3000

RUN npm install
CMD npm start

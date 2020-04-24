require('./dbMongo/mongoose');
const http = require('http');
const express = require('express');
const router = require('./router');
const cors = require('cors');
const ConnectionController = require('./socketInit');
const handlerError = require('./handlerError/handler');
const errorsLogger = require('./utils/errorsLogger/logger.js');
const loggerSchedule = require('./utils/errorsLogger/loggerSchedule.js');
const schedule = require('node-schedule');

const PORT = process.env.PORT || 9632;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));
app.use(router);
app.use(errorsLogger);
app.use(handlerError);

schedule.scheduleJob('0 0 * * *', loggerSchedule);
const server = http.createServer(app);
server.listen(PORT/*,
  () => console.log(`Example app listening on port ${ PORT }!`)*/);
const controller = new ConnectionController(server);

module.exports.controller = controller;



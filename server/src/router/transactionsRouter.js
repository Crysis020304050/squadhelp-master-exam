const basicMiddlewares = require("../middlewares/basicMiddlewares");
const upload = require("../utils/fileUpload");
const validators = require("../middlewares/validators");
const transactionsController = require("../controllers/transactionsController");

const transactionsRouter = require('express')();

transactionsRouter.post(
    '/pay',
    basicMiddlewares.onlyForCustomer,
    upload.uploadContestFiles,
    basicMiddlewares.parseBody,
    validators.validateContestCreation,
    transactionsController.payment,
);

transactionsRouter.post(
    '/cashout',
    basicMiddlewares.onlyForCreative,
    transactionsController.cashout,
);

transactionsRouter.get('/getUserTransactionsHistory',
    transactionsController.getUserTransactionsHistory,
);

transactionsRouter.get('/getUserTransactionsStatement',
    transactionsController.getUserTransactionsStatement,
);

module.exports = transactionsRouter;
const checkToken = require("../middlewares/checkToken");
const basicMiddlewares = require("../middlewares/basicMiddlewares");
const upload = require("../utils/fileUpload");
const validators = require("../middlewares/validators");
const transactionsController = require("../controllers/transactionsController");
const transactionsRouter = require('express')();

transactionsRouter.post(
    '/pay',
    checkToken.checkToken,
    basicMiddlewares.onlyForCustomer,
    upload.uploadContestFiles,
    basicMiddlewares.parseBody,
    validators.validateContestCreation,
    transactionsController.payment,
);

transactionsRouter.post(
    '/cashout',
    checkToken.checkToken,
    basicMiddlewares.onlyForCreative,
    transactionsController.cashout,
);

transactionsRouter.get('/getUserTransactionsHistory',
    checkToken.checkToken,
    transactionsController.getUserTransactionsHistory,
);

transactionsRouter.get('/getUserTransactionsStatement',
    checkToken.checkToken,
    transactionsController.getUserTransactionsStatement,
);

module.exports = transactionsRouter;
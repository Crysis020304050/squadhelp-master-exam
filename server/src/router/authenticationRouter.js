const validators = require("../middlewares/validators");
const userController = require("../controllers/userController");
const hashPass = require('../middlewares/hashPassMiddle');

const authenticationRouter = require('express')();

authenticationRouter.post(
    '/registration',
    validators.validateRegistrationData,
    hashPass,
    userController.registration,
);

authenticationRouter.post(
    '/login',
    validators.validateLogin,
    userController.login,
);

module.exports = authenticationRouter;
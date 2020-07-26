const validators = require("../middlewares/validators");
const userController = require("../controllers/userController");
const tokensController = require('../controllers/tokensController');
const hashPass = require('../middlewares/hashPassMiddle');
const basicMiddlewares = require("../middlewares/basicMiddlewares");
const {sendEmailWithResettingPasswordLink} = require("../middlewares/emailMiddlewares");

const authenticationRouter = require('express')();

authenticationRouter.post(
    '/registration',
    validators.validateRegistrationData,
    hashPass,
    userController.createUser,
    tokensController.signRefreshToken,
    tokensController.saveRefreshToken,
    tokensController.signAccessToken,
    basicMiddlewares.sendAuthData,
);

authenticationRouter.post(
    '/login',
    validators.validateLogin,
    userController.findUserByEmailOrId,
    userController.verifyUserPassword,
    tokensController.signRefreshToken,
    tokensController.saveRefreshToken,
    tokensController.signAccessToken,
    basicMiddlewares.sendAuthData,
);

authenticationRouter.post(
    '/refreshTokens',
    tokensController.verifyRefreshToken,
    tokensController.findRefreshToken,
    tokensController.signRefreshToken,
    tokensController.updateRefreshToken,
    tokensController.signAccessToken,
    basicMiddlewares.sendTokens,
);

authenticationRouter.post(
    '/refreshLogin',
    tokensController.verifyRefreshToken,
    tokensController.findRefreshToken,
    tokensController.getUserByRefreshToken,
    tokensController.signRefreshToken,
    tokensController.updateRefreshToken,
    tokensController.signAccessToken,
    basicMiddlewares.sendAuthData,
);

authenticationRouter.post(
  '/logout',
    tokensController.verifyRefreshToken,
    tokensController.deleteRefreshToken,
);

authenticationRouter.post(
    '/resetUserPasswordRequest',
    validators.validateResetPassword,
    userController.findUserByEmailOrId,
    userController.compareUserPasswords,
    hashPass,
    tokensController.generateTokenWithNewPassword,
    sendEmailWithResettingPasswordLink,
);

module.exports = authenticationRouter;
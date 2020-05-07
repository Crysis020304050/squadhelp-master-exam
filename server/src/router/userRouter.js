const validators = require("../middlewares/validators");
const userController = require("../controllers/userController");
const basicMiddlewares = require("../middlewares/basicMiddlewares");
const checkToken = require("../middlewares/checkToken");
const upload = require("../utils/fileUpload");
const {notifyUserAboutSuccessfulPasswordResetting, sendEmailWithResettingPasswordLink} = require("../middlewares/emailMiddlewares");
const {generateTokenWithNewPassword} = require("../middlewares/generateTokenWithNewPassword");
const hashPass = require('../middlewares/hashPassMiddle');

const userRouter = require('express')();

userRouter.post(
    '/registration',
    validators.validateRegistrationData,
    hashPass,
    userController.registration,
);

userRouter.post(
    '/login',
    validators.validateLogin,
    userController.login,
);

userRouter.post(
    '/getUser',
    checkToken.checkAuth,
);

userRouter.post(
    '/changeMark',
    checkToken.checkToken,
    basicMiddlewares.onlyForCustomer,
    userController.changeMark,
);

userRouter.post(
    '/updateUser',
    checkToken.checkToken,
    upload.uploadAvatar,
    userController.updateUser,
);

userRouter.post('/resetUserPasswordRequest',
    userController.findUserByEmailOrId,
    userController.compareUserPasswords,
    hashPass,
    generateTokenWithNewPassword,
    sendEmailWithResettingPasswordLink,
);

userRouter.post('/confirmPasswordResetting',
    checkToken.checkToken,
    userController.resetUserPassword,
    notifyUserAboutSuccessfulPasswordResetting,
);

module.exports = userRouter;
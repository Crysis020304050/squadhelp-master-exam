const userController = require("../controllers/userController");
const basicMiddlewares = require("../middlewares/basicMiddlewares");
const upload = require("../utils/fileUpload");
const {notifyUserAboutSuccessfulPasswordResetting} = require("../middlewares/emailMiddlewares");

const userRouter = require('express')();

userRouter.post(
    '/changeMark',
    basicMiddlewares.onlyForCustomer,
    userController.changeMark,
);

userRouter.post(
    '/updateUser',
    upload.uploadAvatar,
    userController.updateUser,
);

userRouter.post('/confirmPasswordResetting',
    userController.resetUserPassword,
    notifyUserAboutSuccessfulPasswordResetting,
);

module.exports = userRouter;
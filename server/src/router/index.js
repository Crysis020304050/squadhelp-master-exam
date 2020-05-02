const express = require('express');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const hashPass = require('../middlewares/hashPassMiddle');
const userController = require('../controllers/userController');
const contestController = require('../controllers/contestController');
const checkToken = require('../middlewares/checkToken');
const validators = require('../middlewares/validators');
const chatController = require('../controllers/chatController');
const upload = require('../utils/fileUpload');
const {notifyUserAboutRejectingRequest} = require("../middlewares/emailMiddlewares");
const {notifyUserAboutResolvingRequest} = require("../middlewares/emailMiddlewares");
const {resolveContest, rejectContest} = require("../controllers/contestController");
const {getContestsForModerator} = require("../controllers/contestController");
const {resetUserPassword} = require("../middlewares/resetUserPassword");
const {generateTokenWithNewPassword} = require("../middlewares/generateTokenWithNewPassword");
const {findUserByEmailOrId} = require("../middlewares/findUserByEmailOrId");
const {sendEmailWithResettingPasswordLink, notifyUserAboutSuccessfulPasswordResetting} = require('../middlewares/emailMiddlewares');

const router = express.Router();

router.post(
    '/registration',
    validators.validateRegistrationData,
    hashPass,
    userController.registration,
);

router.post(
    '/login',
    validators.validateLogin,
    userController.login,
);

router.post(
    '/dataForContest',
    checkToken.checkToken,
    contestController.dataForContest,
);

router.post(
    '/pay',
    checkToken.checkToken,
    basicMiddlewares.onlyForCustomer,
    upload.uploadContestFiles,
    basicMiddlewares.parseBody,
    validators.validateContestCreation,
    userController.payment,
);

router.post(
    '/getCustomersContests',
    checkToken.checkToken,
    contestController.getCustomersContests,
);

router.get(
    '/getContestById',
    checkToken.checkToken,
    contestController.getContestById,
);

router.post(
    '/getAllContests',
    checkToken.checkToken,
    basicMiddlewares.onlyForCreative,
    contestController.getContests,
);

router.post(
    '/getUser',
    checkToken.checkAuth,
);

router.get(
    '/downloadFile/:fileName',
    checkToken.checkToken,
    contestController.downloadFile,
);

router.post(
    '/updateContest',
    checkToken.checkToken,
    upload.updateContestFile,
    contestController.updateContest,
);

router.post(
    '/setNewOffer',
    checkToken.checkToken,
    upload.uploadLogoFiles,
    basicMiddlewares.canSendOffer,
    contestController.setNewOffer,
);

router.post(
    '/setOfferStatus',
    checkToken.checkToken,
    basicMiddlewares.onlyForCustomerWhoCreateContest,
    contestController.setOfferStatus,
);

router.post(
    '/changeMark',
    checkToken.checkToken,
    basicMiddlewares.onlyForCustomer,
    userController.changeMark,
);

router.post(
    '/updateUser',
    checkToken.checkToken,
    upload.uploadAvatar,
    userController.updateUser,
);

router.post(
    '/cashout',
    checkToken.checkToken,
    basicMiddlewares.onlyForCreative,
    userController.cashout,
);

router.post(
    '/newMessage',
    checkToken.checkToken,
    chatController.addMessage,
);

router.post(
    '/getChat',
    checkToken.checkToken,
    chatController.getChat,
);

router.post(
    '/getPreview',
    checkToken.checkToken,
    chatController.getPreview,
);

router.post(
    '/blackList',
    checkToken.checkToken,
    chatController.blackList,
);

router.post(
    '/favorite',
    checkToken.checkToken,
    chatController.favoriteChat,
);

router.post(
    '/createCatalog',
    checkToken.checkToken,
    chatController.createCatalog,
);

router.post(
    '/updateNameCatalog',
    checkToken.checkToken,
    chatController.updateNameCatalog,
);

router.post(
    '/addNewChatToCatalog',
    checkToken.checkToken,
    chatController.addNewChatToCatalog,
);

router.post(
    '/removeChatFromCatalog',
    checkToken.checkToken,
    chatController.removeChatFromCatalog,
);

router.post(
    '/deleteCatalog',
    checkToken.checkToken,
    chatController.deleteCatalog,
);

router.post(
    '/getCatalogs',
    checkToken.checkToken,
    chatController.getCatalogs,
);

router.get('/getOffersFiles',
    validators.validateGetOffersFilesData,
    contestController.getOffersFiles);

router.get('/getUserTransactionsHistory',
    checkToken.checkToken,
    userController.getUserTransactionsHistory,
);

router.get('/getUserTransactionsStatement',
    checkToken.checkToken,
    userController.getUserTransactionsStatement,
);

router.post('/resetUserPasswordRequest',
    findUserByEmailOrId,
    hashPass,
    generateTokenWithNewPassword,
    sendEmailWithResettingPasswordLink,
);

router.post('/confirmPasswordResetting',
    checkToken.checkToken,
    resetUserPassword,
    notifyUserAboutSuccessfulPasswordResetting,
);

router.post('/getContestsForModerator',
    checkToken.checkToken,
    basicMiddlewares.onlyForModerators,
    getContestsForModerator,
);

router.post('/resolveContest',
    checkToken.checkToken,
    basicMiddlewares.onlyForModerators,
    resolveContest,
    findUserByEmailOrId,
    notifyUserAboutResolvingRequest,
);

router.post('/rejectContest',
    checkToken.checkToken,
    basicMiddlewares.onlyForModerators,
    rejectContest,
    findUserByEmailOrId,
    notifyUserAboutRejectingRequest,
);

module.exports = router;

const checkToken = require("../middlewares/checkToken");
const contestController = require("../controllers/contestController");
const basicMiddlewares = require("../middlewares/basicMiddlewares");
const upload = require("../utils/fileUpload");
const validators = require("../middlewares/validators");
const {notifyUserAboutRejectingRequest, notifyUserAboutResolvingRequest} = require("../middlewares/emailMiddlewares");
const userController = require('../controllers/userController');

const contestRouter = require('express')();

contestRouter.post(
    '/dataForContest',
    checkToken.checkToken,
    contestController.dataForContest,
);

contestRouter.post(
    '/getCustomersContests',
    checkToken.checkToken,
    contestController.getCustomersContests,
);

contestRouter.get(
    '/getContestById',
    checkToken.checkToken,
    contestController.getContestById,
);

contestRouter.post(
    '/getAllContests',
    checkToken.checkToken,
    basicMiddlewares.onlyForCreative,
    contestController.getContestsForCreative,
);

contestRouter.get(
    '/downloadFile/:fileName',
    checkToken.checkToken,
    contestController.downloadFile,
);

contestRouter.post(
    '/updateContest',
    checkToken.checkToken,
    upload.updateContestFile,
    contestController.updateContest,
);

contestRouter.post(
    '/setNewOffer',
    checkToken.checkToken,
    upload.uploadLogoFiles,
    basicMiddlewares.canSendOffer,
    contestController.setNewOffer,
);

contestRouter.post(
    '/setOfferStatus',
    checkToken.checkToken,
    basicMiddlewares.onlyForCustomerWhoCreateContest,
    contestController.setOfferStatus,
);

contestRouter.get('/getOffersFiles',
    validators.validateGetOffersFilesData,
    contestController.getOffersFiles);

contestRouter.post('/getContestsForModerator',
    checkToken.checkToken,
    basicMiddlewares.onlyForModerators,
    contestController.getContestsForModerator,
);

contestRouter.post('/resolveContest',
    checkToken.checkToken,
    basicMiddlewares.onlyForModerators,
    contestController.resolveContest,
    userController.findUserByEmailOrId,
    notifyUserAboutResolvingRequest,
);

contestRouter.post('/rejectContest',
    checkToken.checkToken,
    basicMiddlewares.onlyForModerators,
    contestController.rejectContest,
    userController.findUserByEmailOrId,
    notifyUserAboutRejectingRequest,
);

module.exports = contestRouter;
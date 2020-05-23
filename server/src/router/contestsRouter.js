const contestController = require("../controllers/contestController");
const basicMiddlewares = require("../middlewares/basicMiddlewares");
const upload = require("../utils/fileUpload");
const validators = require("../middlewares/validators");
const {notifyUserAboutRejectingRequest, notifyUserAboutResolvingRequest} = require("../middlewares/emailMiddlewares");
const userController = require('../controllers/userController');

const contestRouter = require('express')();

contestRouter.post(
    '/dataForContest',
    contestController.dataForContest,
);

contestRouter.post(
    '/getCustomersContests',
    contestController.getCustomersContests,
);

contestRouter.get(
    '/getContestById',
    contestController.getContestById,
);

contestRouter.post(
    '/getAllContests',
    basicMiddlewares.onlyForCreative,
    contestController.getContestsForCreative,
);

contestRouter.get(
    '/downloadFile/:fileName',
    contestController.downloadFile,
);

contestRouter.post(
    '/updateContest',
    upload.updateContestFile,
    contestController.updateContest,
);

contestRouter.post(
    '/setNewOffer',
    upload.uploadLogoFiles,
    basicMiddlewares.canSendOffer,
    contestController.setNewOffer,
);

contestRouter.post(
    '/setOfferStatus',
    basicMiddlewares.onlyForCustomerWhoCreateContest,
    contestController.setOfferStatus,
);

contestRouter.get('/getOffersFiles',
    validators.validateGetOffersFilesData,
    contestController.getOffersFiles);

contestRouter.post('/getContestsForModerator',
    basicMiddlewares.onlyForModerators,
    contestController.getContestsForModerator,
);

contestRouter.post('/resolveContest',
    basicMiddlewares.onlyForModerators,
    contestController.resolveContest,
    userController.findUserByEmailOrId,
    notifyUserAboutResolvingRequest,
);

contestRouter.post('/rejectContest',
    basicMiddlewares.onlyForModerators,
    contestController.rejectContest,
    userController.findUserByEmailOrId,
    notifyUserAboutRejectingRequest,
);

module.exports = contestRouter;
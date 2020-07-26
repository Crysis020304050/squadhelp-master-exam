const bd = require('../models');
const RightsError = require('../errors/RightsError');
const ServerError = require('../errors/ServerError');
import constants from '../constants/constants';
const {prepareUserToSending} = require('../utils/functions');

module.exports.parseBody = (req, res, next) => {
    req.body.contests = JSON.parse(req.body.contests);
    for (let i = 0; i < req.body.contests.length; i++) {
        if (req.body.contests[i].haveFile) {
            const file = req.files.splice(0, 1);
            req.body.contests[i].fileName = file[0].filename;
            req.body.contests[i].originalFileName = file[0].originalname;
        }
    }
    next();
};

module.exports.onlyForCreative = (req, res, next) => {
    try {
        if (req.tokenData.role === constants.CREATOR) {
            return next();
        }
        return next(new RightsError('This page is only for creators'));
    } catch (e) {
        next(e);
    }
};

module.exports.onlyForCustomer = (req, res, next) => {
    try {
        if (req.tokenData.role === constants.CUSTOMER) {
            return next();
        }
        return next(new RightsError('This page is only for customers'));
    } catch (e) {
        next(e);
    }
};

module.exports.onlyForModerators = (req, res, next) => {
    try {
        if (req.tokenData.role === constants.MODERATOR) {
            return next();
        }
        return next(new RightsError('This page is only for moderators'))
    } catch (e) {
        next(e);
    }
};

module.exports.canSendOffer = async (req, res, next) => {
    if (req.tokenData.role === constants.CUSTOMER) {
        return next(new RightsError());
    }
    try {
        const result = await bd.Contests.findOne({
            where: {
                id: req.body.contestId,
            },
            attributes: ['status'],
        });
        if (result.get({plain: true}).status ===
            constants.CONTEST_STATUS_ACTIVE) {
            return next();
        }
        new RightsError();
    } catch (e) {
        next(new ServerError());
    }

};

module.exports.onlyForCustomerWhoCreateContest = async (req, res, next) => {
    try {
        const {tokenData: {id}, body: {contestId}} = req;
        const result = await bd.Contests.findOne({
            where: {
                userId: id,
                id: contestId,
                status: constants.CONTEST_STATUS_ACTIVE,
            },
            attributes: ['id'],
        });
        if (result) {
            return next();
        }
        new RightsError();
    } catch (e) {
        next(e);
    }
};

module.exports.canUpdateContest = async (req, res, next) => {
    try {
        const {tokenData: {id}, body: {contestId}} = req;
        const result = bd.Contests.findOne({
            where: {
                userId: id,
                id: contestId,
                status: {[bd.Sequelize.Op.not]: constants.CONTEST_STATUS_FINISHED},
            },
            attributes: ['id'],
        });
        if (result) {
            return next();
        }
        new RightsError();
    } catch (e) {
        next(e);
    }
};

module.exports.sendAuthData = (req, res, next) => {
    const {accessTokenValue, refreshTokenValue, user} = req;
    res.send({
        user: prepareUserToSending(user),
        tokenPair: {
            accessToken: accessTokenValue,
            refreshToken: refreshTokenValue,
        },
    });
};

module.exports.sendTokens = (req, res, next) => {
    const {accessTokenValue, refreshTokenValue} = req;
    res.send({
        accessToken: accessTokenValue,
        refreshToken: refreshTokenValue,
    });
};
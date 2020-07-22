const db = require('../models');
const ServerError = require('../errors/ServerError');
const contestQueries = require('./queries/contestQueries');
const userQueries = require('./queries/userQueries');
const transactionQueries = require('./queries/transactionsQueries.js');
const controller = require('../index.js');
const constants = require('../constants/constants');
const moment = require('moment');
const money = require('money-math');


module.exports.dataForContest = async (req, res, next) => {
    try {
        const {body: {characteristic1, characteristic2}} = req;
        const characteristics = await contestQueries.getSelectsData({
            where: {
                type: {
                    [db.Sequelize.Op.or]: [
                        characteristic1,
                        characteristic2,
                        'industry',
                    ],
                },
            },
        });
        const preparedData = {};
        characteristics.forEach(({type, describe}) => {
            if (!preparedData[type]) {
                preparedData[type] = [];
            }
            preparedData[type].push(describe);
        });
        res.send(preparedData);
    } catch (e) {
        next(e);
    }
};

module.exports.getContestById = async (req, res, next) => {
    try {
        const {tokenData: {role, id}, headers: {contestid}} = req;
        const contestInfo = await contestQueries.getContest({
            where: {
                id: contestid,
                ...(role === constants.CREATOR && {moderationStatus: constants.MODERATION_STATUS_RESOLVED}),
            },
            order: [
                [db.Offers, 'id', 'asc'],
            ],
            include: [
                {
                    model: db.Users,
                    required: true,
                    attributes: {
                        exclude: [
                            'password',
                            'role',
                            'balance',
                            'accessToken',
                        ],
                    },
                },
                {
                    model: db.Offers,
                    required: false,
                    where: {
                        ...(role === constants.CREATOR && {userId: id}),
                        ...(role === constants.CUSTOMER && {moderationStatus: constants.MODERATION_STATUS_RESOLVED}),

                    },
                    attributes: {exclude: ['userId', 'contestId']},
                    include: [
                        {
                            model: db.Users,
                            required: true,
                            attributes: {
                                exclude: [
                                    'password',
                                    'role',
                                    'balance',
                                    'accessToken',
                                ],
                            },
                        },
                        {
                            model: db.Ratings,
                            required: false,
                            where: {userId: id},
                            attributes: {exclude: ['userId', 'offerId']},
                        },
                    ],
                },
            ],
        });
        const preparedContestInfo = {...contestInfo};
        preparedContestInfo.Offers.forEach(offer => {
            if (offer.Rating) {
                offer.mark = offer.Rating.mark;
            }
            delete offer.Rating;
        });
        return res.send(preparedContestInfo);
    } catch (e) {
        next(e);
    }
};

module.exports.downloadFile = async (req, res, next) => {
    const file = constants.CONTESTS_DEFAULT_DIR + req.params.fileName;
    res.download(file);
};

module.exports.updateContest = async (req, res, next) => {
    try {
        const {file, body, tokenData: {id}} = req;
        if (file) {
            body.fileName = file.filename;
            body.originalFileName = file.originalname;
        }
        const contestId = body.contestId;
        delete body.contestId;
        const updatedContest = await contestQueries.updateContest(body, {
            id: contestId,
            userId: id,
        });
        res.send(updatedContest);
    } catch (e) {
        next(e);
    }
};

module.exports.setNewOffer = async (req, res, next) => {
    try {
        const {body: {contestType, offerData, contestId}, file, tokenData} = req;
        const preparedOfferData = {
            userId: tokenData.id,
            contestId,
            ...(contestType === constants.LOGO_CONTEST && {
                fileName: file.filename,
                originalFileName: file.originalname,
            }),
            ...(offerData && {text: offerData}),
        };
        const result = await contestQueries.createOffer(preparedOfferData);
        const preparedResult = (({contestId, userId, ...rest}) => rest)(result);
        res.send({...preparedResult, User: {...tokenData}});
    } catch (e) {
        next(e);
    }
};

const rejectOffer = async (offerId, creatorId, contestId) => {
    const rejectedOffer = await contestQueries.updateOffer(
        {status: constants.OFFER_STATUS_REJECTED}, {id: offerId});
    controller.controller.notificationController.emitChangeOfferStatus(creatorId,
        'Someone of yours offers was rejected', contestId);
    return rejectedOffer;
};

const resolveOffer = async (contestId, creatorId, orderId, offerId, priority, transaction) => {
    const finishedContest = await contestQueries.updateContestStatus({
        status: db.sequelize.literal(`   CASE
            WHEN "id"=${contestId}  AND "orderId"='${orderId}' THEN '${constants.CONTEST_STATUS_FINISHED}'
            WHEN "orderId"='${orderId}' AND "priority"=${priority +
        1}  THEN '${constants.CONTEST_STATUS_ACTIVE}'
            ELSE '${constants.CONTEST_STATUS_PENDING}'
            END
    `),
    }, {orderId: orderId}, transaction);
    const prizeToMoney = money.floatToAmount(finishedContest.prize);
    await userQueries.updateUser(
        {balance: db.sequelize.literal(`balance+${prizeToMoney}`)},
        creatorId, transaction);
    const updatedOffers = await contestQueries.updateOfferStatus({
        status: db.sequelize.literal(` CASE
            WHEN "id"=${offerId} THEN '${constants.OFFER_STATUS_WON}'
            ELSE '${constants.OFFER_STATUS_REJECTED}'
            END
    `),
    }, {
        contestId,
    }, transaction);
    const arrayRoomsId = [];
    updatedOffers.forEach(offer => {
        if (offer.status === constants.OFFER_STATUS_REJECTED && creatorId !==
            offer.userId) {
            arrayRoomsId.push(offer.userId);
        }
    });
    controller.controller.notificationController.emitChangeOfferStatus(arrayRoomsId,
        'Someone of yours offers was rejected', contestId);
    controller.controller.notificationController.emitChangeOfferStatus(creatorId,
        'Someone of your offers WIN', contestId, prizeToMoney);
    return {...updatedOffers[0].dataValues, prize: prizeToMoney};
};

module.exports.setOfferStatus = async (req, res, next) => {
    try {
        const {body: {command, offerId, creatorId, contestId, orderId, priority}} = req;
        switch (command) {
            case 'reject': {
                const rejectedOffer = await rejectOffer(offerId, creatorId, contestId);
                return res.send(rejectedOffer);
            }
            case 'resolve': {
                await db.sequelize.transaction(async transaction => {
                    const winningOffer = await resolveOffer(contestId, creatorId, orderId, offerId, priority, transaction);
                    await transactionQueries.newIncomeTransaction({
                        typeOperation: constants.INCOME_TRANSACTION,
                        sum: winningOffer.prize,
                        userId: winningOffer.userId,
                    }, transaction);
                    res.send(winningOffer);
                });
                break;
            }
            default: {
                new ServerError();
            }
        }
    } catch (e) {
        next(e);
    }
};

module.exports.getOffersForModerator = async (req, res, next) => {
    try {
        const {limit, offset, moderationStatus} = req.body;
        const offers = await contestQueries.getOffersData({
            where: {moderationStatus},
            limit,
            offset: offset || 0,
            order: [['id', 'DESC']],
            include: [
                {
                    model: db.Contests,
                    attributes: ['contestType'],
                },
            ],
        });
        res.send({offers, haveMore: offers.length >= limit});
    } catch (e) {
        next(e);
    }
};

module.exports.getCustomersContests = async (req, res, next) => {
    try {
        const {headers: {status}, tokenData: {id}, body: {limit, offset}} = req;
        let contests = await contestQueries.getContests({
            where: {
                status,
                userId: id,
                ...(status === constants.CONTEST_STATUS_ACTIVE && {moderationStatus: constants.MODERATION_STATUS_RESOLVED}),
                ...(status === constants.CONTEST_STATUS_PENDING && {
                    status: {
                        [db.Sequelize.Op.or]: [constants.CONTEST_STATUS_ACTIVE, constants.CONTEST_STATUS_PENDING]
                    },
                })
            },
            limit,
            offset: offset || 0,
            order: [['id', 'DESC']],
            include: [
                {
                    model: db.Offers,
                    required: false,
                    attributes: ['id', 'moderationStatus'],
                },
            ],
        });
        if (status === constants.CONTEST_STATUS_PENDING) {
            contests = contests.filter(({status, moderationStatus}) => !(status === constants.CONTEST_STATUS_ACTIVE && moderationStatus === constants.MODERATION_STATUS_RESOLVED));
        }
        contests.forEach(contest => contest.dataValues.count = contest.Offers.filter(({moderationStatus}) => moderationStatus === constants.MODERATION_STATUS_RESOLVED).length);
        res.send({contests, haveMore: contests.length >= limit});
    } catch (e) {
        next(e);
    }
};

module.exports.getContestsForModerator = async (req, res, next) => {
    try {
        const {limit, offset, moderationStatus} = req.body;
        const contests = await contestQueries.getContests({
            where: {moderationStatus},
            limit,
            offset: offset || 0,
            order: [['id', 'DESC']],
            include: [
                {
                    model: db.Offers,
                    required: false,
                    attributes: ['id', 'moderationStatus'],
                },
            ],
        });
        contests.forEach(contest => contest.dataValues.count = contest.Offers.filter(({moderationStatus}) => moderationStatus === constants.MODERATION_STATUS_RESOLVED).length);
        res.send({contests, haveMore: contests.length >= limit});
    } catch (e) {
        next(e);
    }
};

module.exports.getContestsForCreative = async (req, res, next) => {
    try {
        const {body: {selectedContestTypes, contestId, industry, awardSort, limit, offset, ownEntries}, tokenData: {id}} = req;
        let contests = await contestQueries.getContests({
            where: {
                ...(selectedContestTypes && {contestType: {[db.Sequelize.Op.or]: selectedContestTypes}}),
                ...(contestId && {id: contestId}),
                ...(industry && {industry}),
                status: {
                    [db.Sequelize.Op.or]: [
                        constants.CONTEST_STATUS_FINISHED,
                        constants.CONTEST_STATUS_ACTIVE,
                    ],
                },
                moderationStatus: constants.MODERATION_STATUS_RESOLVED,
            },
            order: [['status', 'asc'], (awardSort && ['prize', awardSort]), ['id', 'desc']],
            limit,
            offset: offset || 0,
            include: [
                {
                    model: db.Offers,
                    required: ownEntries,
                    where: {
                        ...(ownEntries && {userId: id}),
                    },
                    attributes: ['id', 'moderationStatus', 'userId'],
                },
            ],
        });
        contests = contests.filter(({status, Offers}) => {
            if (Offers.some(({userId}) => userId === id)) {
                return true;
            } else {
                return status !== constants.CONTEST_STATUS_FINISHED;
            }
        });
        contests.forEach(contest => contest.dataValues.count = contest.Offers.filter(({moderationStatus}) => moderationStatus === constants.MODERATION_STATUS_RESOLVED).length);
        res.send({contests, haveMore: contests.length >= limit});
    } catch (e) {
        next(e);
    }
};

module.exports.getOffersFiles = async (req, res, next) => {
    try {
        const {body: {dateFrom}} = req;

        const searchFilter = {
            where: {
                fileName: {
                    [db.Sequelize.Op.not]: null,
                },
                ...(dateFrom && {
                    createdAt: {
                        [db.Sequelize.Op.gte]: moment(dateFrom).format()
                    }
                }),
            },
        };

        const result = await contestQueries.getOffersData(searchFilter);
        res.send(result);
    } catch (e) {
        next(e);
    }
};

module.exports.resolveContest = async (req, res, next) => {
    try {
        const {id} = req.body;
        req.updatedContest = await contestQueries.updateContest({moderationStatus: constants.MODERATION_STATUS_RESOLVED}, {id});
        next();
    } catch (e) {
        next(e);
    }
};

module.exports.rejectContest = async (req, res, next) => {
    try {
        const {id} = req.body;
        req.updatedContest = await contestQueries.updateContest({moderationStatus: constants.MODERATION_STATUS_REJECTED}, {id});
        next();
    } catch (e) {
        next(e);
    }
};

module.exports.resolveOffer = async (req, res, next) => {
    try {
        const {id} = req.body;
        req.updatedOffer = await contestQueries.updateOffer({moderationStatus: constants.MODERATION_STATUS_RESOLVED}, {id});
        next();
    } catch (e) {
        next(e);
    }
};

module.exports.rejectOffer = async (req, res, next) => {
    try {
        const {id} = req.body;
        req.updatedOffer = await contestQueries.updateOffer({moderationStatus: constants.MODERATION_STATUS_REJECTED}, {id});
        next();
    } catch (e) {
        next(e);
    }
};

module.exports.findAndNotifyContestHolderAboutNewEntry = async (req, res, next) => {
    try {
        const {updatedOffer: {contestId}} = req;
        const {userId} = await contestQueries.getUserIdByContestId(contestId);
        controller.controller.notificationController.emitEntryCreated(userId);
        next();
    } catch (e) {
        next(e);
    }
};
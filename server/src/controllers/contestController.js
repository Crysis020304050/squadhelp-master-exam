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
    let response = {};
    try {
        const characteristics = await db.Selects.findAll({
            where: {
                type: {
                    [db.Sequelize.Op.or]: [
                        req.body.characteristic1,
                        req.body.characteristic2,
                        'industry',
                    ],
                },
            },
        });
        if (!characteristics) {
            return next(new ServerError());
        }
        characteristics.forEach(characteristic => {
            if (!response[characteristic.type]) {
                response[characteristic.type] = [];
            }
            response[characteristic.type].push(characteristic.describe);
        });
        res.send(response);
    } catch (err) {
        next(new ServerError('cannot get contest preferences'));
    }
};

module.exports.getContestById = async (req, res, next) => {
    try {
        const {tokenData: {role, id}, headers: {contestid}} = req;
        const contestInfo = await db.Contests.findOne({
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
        if (contestInfo) {
            const preparedContestInfo = contestInfo.get({plain: true});
            preparedContestInfo.Offers.forEach(offer => {
                if (offer.Rating) {
                    offer.mark = offer.Rating.mark;
                }
                delete offer.Rating;
            });
            return res.send(preparedContestInfo);
        }
        return next(new ServerError('Cannot get contest'));
    } catch (e) {
        next(e);
    }
};

module.exports.downloadFile = async (req, res, next) => {
    const file = constants.CONTESTS_DEFAULT_DIR + req.params.fileName;
    res.download(file);
};

module.exports.updateContest = async (req, res, next) => {
    if (req.file) {
        req.body.fileName = req.file.filename;
        req.body.originalFileName = req.file.originalname;
    }
    const contestId = req.body.contestId;
    delete req.body.contestId;
    try {
        const updatedContest = await contestQueries.updateContest(req.body, {
            id: contestId,
            userId: req.tokenData.id,
        });
        res.send(updatedContest);
    } catch (e) {
        next(e);
    }
};

module.exports.setNewOffer = async (req, res, next) => {
    const obj = {};
    if (req.body.contestType === constants.LOGO_CONTEST) {
        obj.fileName = req.file.filename;
        obj.originalFileName = req.file.originalname;
    } else {
        obj.text = req.body.offerData;
    }
    obj.userId = req.tokenData.id;
    obj.contestId = req.body.contestId;
    try {
        let result = await contestQueries.createOffer(obj);
        delete result.contestId;
        delete result.userId;
        const User = Object.assign({}, req.tokenData, {id: req.tokenData.id});
        res.send(Object.assign({}, result, {User}));
    } catch (e) {
        return next(new ServerError());
    }
};

const rejectOffer = async (offerId, creatorId, contestId) => {
    const rejectedOffer = await contestQueries.updateOffer(
        {status: constants.OFFER_STATUS_REJECTED}, {id: offerId});
    controller.controller.notificationController.emitChangeOfferStatus(creatorId,
        'Someone of yours offers was rejected', contestId);
    return rejectedOffer;
};

const resolveOffer = async (
    contestId, creatorId, orderId, offerId, priority, transaction) => {
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
        {balance: db.sequelize.literal('balance + ' + prizeToMoney)},
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
    transaction.commit();
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
    let transaction;
    const {body: {command, offerId, creatorId, contestId, orderId, priority}} = req;
    if (command === 'reject') {
        try {
            const offer = await rejectOffer(offerId, creatorId, contestId);
            res.send(offer);
        } catch (err) {
            next(err);
        }
    } else if (command === 'resolve') {
        try {
            transaction = await db.sequelize.transaction();
            const winningOffer = await resolveOffer(contestId, creatorId, orderId, offerId, priority, transaction);

            await transactionQueries.newIncomeTransaction({
                typeOperation: constants.INCOME_TRANSACTION,
                sum: winningOffer.prize,
                userId: winningOffer.userId,
            });
            res.send(winningOffer);
        } catch (err) {
            transaction.rollback();
            next(err);
        }
    }
};

module.exports.getOffersForModerator = async (req, res, next) => {
    try {
        const {limit, offset, moderationStatus} = req.body;
        const offers = await db.Offers.findAll({
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
        let contests = await db.Contests.findAll({
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
        const contests = await db.Contests.findAll({
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
        let contests = await db.Contests.findAll({
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
        const {dateFrom} = req.body;

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
        return res.send(result);
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
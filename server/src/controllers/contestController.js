const db = require('../models');
import ServerError from '../errors/ServerError';

const contestQueries = require('./queries/contestQueries');
const userQueries = require('./queries/userQueries');
const transactionQueries = require('./queries/transactionsQueries.js');
const controller = require('../index.js');
const UtilFunctions = require('../utils/functions');
const CONSTANTS = require('../constants/constants');
const moment = require('moment');
import {INCOME_TRANSACTION} from '../constants/constants.js';

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
        const contestInfo = await db.Contests.findOne({
            where: {id: req.headers.contestid},
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
                    where: req.tokenData.role === CONSTANTS.CREATOR
                        ? {userId: req.tokenData.userId}
                        : {},
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
                            where: {userId: req.tokenData.userId},
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
    const file = CONSTANTS.CONTESTS_DEFAULT_DIR + req.params.fileName;
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
            userId: req.tokenData.userId,
        });
        res.send(updatedContest);
    } catch (e) {
        next(e);
    }
};

module.exports.setNewOffer = async (req, res, next) => {
    const obj = {};
    if (req.body.contestType === CONSTANTS.LOGO_CONTEST) {
        obj.fileName = req.file.filename;
        obj.originalFileName = req.file.originalname;
    } else {
        obj.text = req.body.offerData;
    }
    obj.userId = req.tokenData.userId;
    obj.contestId = req.body.contestId;
    try {
        let result = await contestQueries.createOffer(obj);
        delete result.contestId;
        delete result.userId;
        controller.controller.notificationController.emitEntryCreated(
            req.body.customerId);
        const User = Object.assign({}, req.tokenData, {id: req.tokenData.userId});
        res.send(Object.assign({}, result, {User}));
    } catch (e) {
        return next(new ServerError());
    }
};

const rejectOffer = async (offerId, creatorId, contestId) => {
    const rejectedOffer = await contestQueries.updateOffer(
        {status: CONSTANTS.OFFER_STATUS_REJECTED}, {id: offerId});
    controller.controller.notificationController.emitChangeOfferStatus(creatorId,
        'Someone of yours offers was rejected', contestId);
    return rejectedOffer;
};

const resolveOffer = async (
    contestId, creatorId, orderId, offerId, priority, transaction) => {
    const finishedContest = await contestQueries.updateContestStatus({
        status: db.sequelize.literal(`   CASE
            WHEN "id"=${contestId}  AND "orderId"='${orderId}' THEN '${CONSTANTS.CONTEST_STATUS_FINISHED}'
            WHEN "orderId"='${orderId}' AND "priority"=${priority +
        1}  THEN '${CONSTANTS.CONTEST_STATUS_ACTIVE}'
            ELSE '${CONSTANTS.CONTEST_STATUS_PENDING}'
            END
    `),
    }, {orderId: orderId}, transaction);
    await userQueries.updateUser(
        {balance: db.sequelize.literal('balance + ' + finishedContest.prize)},
        creatorId, transaction);
    const updatedOffers = await contestQueries.updateOfferStatus({
        status: db.sequelize.literal(` CASE
            WHEN "id"=${offerId} THEN '${CONSTANTS.OFFER_STATUS_WON}'
            ELSE '${CONSTANTS.OFFER_STATUS_REJECTED}'
            END
    `),
    }, {
        contestId: contestId,
    }, transaction);
    transaction.commit();
    const arrayRoomsId = [];
    updatedOffers.forEach(offer => {
        if (offer.status === CONSTANTS.OFFER_STATUS_REJECTED && creatorId !==
            offer.userId) {
            arrayRoomsId.push(offer.userId);
        }
    });
    controller.controller.notificationController.emitChangeOfferStatus(arrayRoomsId,
        'Someone of yours offers was rejected', contestId);
    controller.controller.notificationController.emitChangeOfferStatus(creatorId,
        'Someone of your offers WIN', contestId);
    return {...updatedOffers[0].dataValues, prize: finishedContest.prize};
};

module.exports.setOfferStatus = async (req, res, next) => {
    let transaction;
    if (req.body.command === 'reject') {
        try {
            const offer = await rejectOffer(req.body.offerId, req.body.creatorId,
                req.body.contestId);
            res.send(offer);
        } catch (err) {
            next(err);
        }
    } else if (req.body.command === 'resolve') {
        try {
            transaction = await db.sequelize.transaction();
            const winningOffer = await resolveOffer(req.body.contestId,
                req.body.creatorId, req.body.orderId, req.body.offerId,
                req.body.priority, transaction);

            await transactionQueries.newIncomeTransaction({
                typeOperation: INCOME_TRANSACTION,
                sum: winningOffer.prize,
                userId: winningOffer.userId,
            });
            //
            res.send(winningOffer);
        } catch (err) {
            transaction.rollback();
            next(err);
        }
    }
};

module.exports.getCustomersContests = (req, res, next) => {
    db.Contests.findAll({
        where: {status: req.headers.status, userId: req.tokenData.userId},
        limit: req.body.limit,
        offset: req.body.offset ? req.body.offset : 0,
        order: [['id', 'DESC']],
        include: [
            {
                model: db.Offers,
                required: false,
                attributes: ['id'],
            },
        ],
    })
        .then(contests => {
            contests.forEach(
                contest => contest.dataValues.count = contest.dataValues.Offers.length);
            let haveMore = true;
            if (contests.length === 0) {
                haveMore = false;
            }
            res.send({contests, haveMore});
        })
        .catch(err => next(new ServerError(err)));
};

module.exports.getContestsForModerator = async (req, res, next) => {
    try {
        const {limit, offset, moderationStatus} = req.body;
        const contests = await db.Contests.findAll({
            where: {moderationStatus},
            limit,
            offset: offset || 0,
            include: [
                {
                    model: db.Offers,
                    required: false,
                    attributes: ['id'],
                },
            ],
        });
        contests.forEach(contest => contest.dataValues.count = contest.dataValues.Offers.length);
        const haveMore = contests.length !== 0;
        res.send({contests, haveMore});
    } catch (e) {
        next(e);
    }
};

module.exports.getContests = (req, res, next) => {
    const predicates = UtilFunctions.createWhereForAllContests(req.body.selectedContestTypes,
        req.body.contestId, req.body.industry, req.body.awardSort, req.body.moderationStatus);
    db.Contests.findAll({
        where: predicates.where,
        order: predicates.order,
        limit: req.body.limit,
        offset: req.body.offset ? req.body.offset : 0,
        include: [
            {
                model: db.Offers,
                required: req.body.ownEntries,
                where: req.body.ownEntries ? {userId: req.tokenData.userId} : {},
                attributes: ['id'],
            },
        ],
    })
        .then(contests => {
            contests.forEach(
                contest => contest.dataValues.count = contest.dataValues.Offers.length);
            let haveMore = true;
            if (contests.length === 0 || contests.length <= req.body.limit) {
                haveMore = false;
            }
            res.send({contests, haveMore});
        })
        .catch(err => {
            next(new ServerError());
        })
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
            }
        };

        const result = await contestQueries.getOffersData(searchFilter);
        return res.send(result);
    } catch (e) {
        next(e);
    }
};
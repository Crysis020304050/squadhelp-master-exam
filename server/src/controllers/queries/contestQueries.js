const db = require('../../models');
const ServerError = require('../../errors/ServerError');
const NotFoundError = require('../../errors/UserNotFoundError');
const uuid = require('uuid/v1');
const {CONTEST_STATUS_ACTIVE, CONTEST_STATUS_PENDING} = require('../../constants/constants');
const money = require('money-math');
const moment = require('moment');

module.exports.createContestOrContests = async (contestsArr, price, userId, transaction) => {
    const orderId = uuid();
    const preparedContests = contestsArr.map((contest, index) => ({
        ...contest,
        status: index === 0 ? CONTEST_STATUS_ACTIVE : CONTEST_STATUS_PENDING,
        userId,
        priority: index + 1,
        orderId,
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        prize: money.floatToAmount(money.div(price, money.floatToAmount(contestsArr.length))),
    }));
    return await db.Contests.bulkCreate(preparedContests, {transaction});
};

module.exports.updateContest = async (data, predicate, transaction) => {
    const [updatedRowsCount, [updatedContest]] = await db.Contests.update(data,
        {where: predicate, returning: true, transaction, raw: true});
    if (updatedRowsCount) {
        return updatedContest;
    }
    throw new ServerError('Cannot update contest');
};

module.exports.updateContestStatus = async (data, predicate, transaction) => {
    const [updatedRowsCount, [updatedContest]] = await db.Contests.update(data,
        {where: predicate, returning: true, transaction, raw: true});
    if (updatedRowsCount) {
        return updatedContest;
    }
    throw new ServerError('Cannot update contest');
};

module.exports.updateOffer = async (data, predicate, transaction) => {
    const [updatedRowsCount, [updatedOffer]] = await db.Offers.update(data,
        {where: predicate, returning: true, transaction, raw: true});
    if (updatedRowsCount) {
        return updatedOffer;
    }
    throw new ServerError('Cannot update offer');
};

module.exports.updateOfferStatus = async (data, predicate, transaction) => {
    const [updatedRowsCount, updatedOffers] = await db.Offers.update(data,
        {where: predicate, returning: true, transaction});
    if (updatedRowsCount) {
        return updatedOffers;
    }
    throw new ServerError('Cannot set offer status');
};

module.exports.createOffer = async (data) => {
    const result = await db.Offers.create(data);
    if (result) {
        return result.get({plain: true});
    }
    throw new ServerError('Cannot create new Offer');
};

module.exports.getOffersData = async (filter) => await db.Offers.findAll(filter);

module.exports.getUserIdByContestId = async (contestId) => {
    const result = await db.Contests.findOne({
        where: {
            id: contestId,
        },
        attributes: ['userId']
    });
    if (result) {
        return result.get({plain: true});
    }
    throw new NotFoundError('Cannot find user by contest id');
};

module.exports.getSelectsData = async (filter) => {
    const result = await db.Selects.findAll(filter);
    if (result.length) {
        return result;
    }
    throw new ServerError('Cannot get contest preferences');
};

module.exports.getContest = async (filter) => {
    const result = await db.Contests.findOne(filter);
    if (result) {
        return result.get({plain: true});
    }
    throw new NotFoundError('Cannot get contest');
};

module.exports.getContests = async (filter) => await db.Contests.findAll(filter);

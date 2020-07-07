const bd = require('../../models');
const ServerError = require('../../errors/ServerError');
const NotFoundError = require('../../errors/UserNotFoundError');

module.exports.updateContest = async (data, predicate, transaction) => {
    const [updatedRowsCount, [updatedContest]] = await bd.Contests.update(data,
        {where: predicate, returning: true, transaction, raw: true});
    if (updatedRowsCount) {
        return updatedContest;
    }
    throw new ServerError('Cannot update contest');
};

module.exports.updateContestStatus = async (data, predicate, transaction) => {
    const [updatedRowsCount, [updatedContest]] = await bd.Contests.update(data,
        {where: predicate, returning: true, transaction, raw: true});
    if (updatedRowsCount) {
        return updatedContest;
    }
    throw new ServerError('Cannot update contest');
};

module.exports.updateOffer = async (data, predicate, transaction) => {
    const [updatedRowsCount, [updatedOffer]] = await bd.Offers.update(data,
        {where: predicate, returning: true, transaction, raw: true});
    if (updatedRowsCount) {
        return updatedOffer;
    }
    throw new ServerError('Cannot update offer');
};

module.exports.updateOfferStatus = async (data, predicate, transaction) => {
    const [updatedRowsCount, updatedOffers] = await bd.Offers.update(data,
        {where: predicate, returning: true, transaction});
    if (updatedRowsCount) {
        return updatedOffers;
    }
    throw new ServerError('Cannot set offer status');
};

module.exports.createOffer = async (data) => {
    const result = await bd.Offers.create(data);
    if (result) {
        return result.get({plain: true});
    }
    throw new ServerError('Cannot create new Offer');
};

module.exports.getOffersData = async (filter) => await bd.Offers.findAll(filter);

module.exports.getUserIdByContestId = async (contestId) => {
    const result = await bd.Contests.findOne({
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
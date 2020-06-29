const bd = require('../../models');
const ServerError = require('../../errors/ServerError');
const NotFoundError = require('../../errors/UserNotFoundError');

module.exports.updateContest = async (data, predicate, transaction) => {
    const [updatedRowsCount, [updatedContest]] = await bd.Contests.update(data,
        {where: predicate, returning: true, transaction});
    if (updatedRowsCount !== 1) {
        throw new ServerError('cannot update Contest');
    } else {
        return updatedContest.dataValues;
    }
};

module.exports.updateContestStatus = async (data, predicate, transaction) => {
    const updateResult = await bd.Contests.update(data,
        {where: predicate, returning: true, transaction});
    if (updateResult[0] < 1) {
        throw new ServerError('cannot update Contest');
    } else {
        return updateResult[1][0].dataValues;
    }
};

module.exports.updateOffer = async (data, predicate, transaction) => {
    const [updatedCount, [updatedOffer]] = await bd.Offers.update(data,
        {where: predicate, returning: true, transaction});
    if (updatedCount !== 1) {
        throw new ServerError('cannot update offer!');
    } else {
        return updatedOffer.dataValues;
    }
};

module.exports.updateOfferStatus = async (data, predicate, transaction) => {
    const result = await bd.Offers.update(data,
        {where: predicate, returning: true, transaction});
    if (result[0] < 1) {
        throw new ServerError('cannot update offer!');
    } else {
        return result[1];
    }
};

module.exports.createOffer = async (data) => {
    const result = await bd.Offers.create(data);
    if (!result) {
        throw new ServerError('cannot create new Offer');
    } else {
        return result.get({plain: true});
    }
};

module.exports.getOffersData = async (filter) => {
    const result = await bd.Offers.findAll(filter);
    if (result.length > 0) {
        return result;
    }
    throw new NotFoundError('cannot get offers files');
};

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
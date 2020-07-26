const db = require('../../models');
const ServerError = require('../../errors/ServerError');

module.exports.updateRating = async (data, predicate, transaction) => {
    const [updatedRowsCount, [updatedRating]] = await db.Ratings.update(data,
        {where: predicate, returning: true, transaction, raw: true});
    if (updatedRowsCount) {
        return updatedRating;
    }
    throw new ServerError('Cannot update mark on this offer');
};

module.exports.createRating = async (data, transaction) => {
    const result = await db.Ratings.create(data, {transaction});
    if (result) {
        return result.get({plain: true});
    }
    throw new ServerError('Cannot mark offer');
};

module.exports.getRatingsWithOffers = async (userId, transaction) => (
    await db.Ratings.findAll({
        include: [
            {
                model: db.Offers,
                required: true,
                where: {userId},
                attributes: ['id'],
            },
        ],
        raw: true,
        nest: true,
        transaction,
    })
);
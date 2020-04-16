const bd = require('../../models');
const NotFoundError = require('../../errors/UserNotFoundError');

module.exports.getTransactions = async (filter) => {
    const result = await bd.TransactionHistory.findAll(filter);
    if (result.length > 0) {
        return result;
    }
    throw new NotFoundError('cannot get transactions');
};
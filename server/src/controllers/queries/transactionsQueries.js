const bd = require('../../models');
const NotFoundError = require('../../errors/UserNotFoundError');
const ServerError = require('../../errors/ServerError');

module.exports.getTransactions = async (filter) => {
    const result = await bd.TransactionHistory.findAll(filter);
    if (result.length > 0) {
        return result;
    }
    throw new NotFoundError('cannot get transactions');
};

module.exports.newIncomeTransaction = async (data) => {
    const result = await bd.TransactionHistory.create(data);
    if (result) {
        return result;
    }
    throw new ServerError('cannot create new income transaction')
};

module.exports.newConsumptionTransaction = async (data) => {
    const result = await bd.TransactionHistory.create(data);
    if (result) {
        return result;
    }
    throw new ServerError('cannot create new consumption transaction')
};
const bd = require('../../models');
const ServerError = require('../../errors/ServerError');

module.exports.getTransactions = async (filter) => {
    try {
        return await bd.TransactionHistory.findAll(filter);
    } catch (e) {
        throw e;
    }
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
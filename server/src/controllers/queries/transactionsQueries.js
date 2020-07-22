const bd = require('../../models');
const ServerError = require('../../errors/ServerError');

module.exports.getTransactions = async (filter) => await bd.TransactionHistory.findAll(filter);

module.exports.newIncomeTransaction = async (data, transaction) => {
    const result = await bd.TransactionHistory.create(data, {transaction});
    if (result) {
        return result;
    }
    throw new ServerError('Cannot create new income transaction')
};

module.exports.newConsumptionTransaction = async (data, transaction) => {
    const result = await bd.TransactionHistory.create(data, {transaction});
    if (result) {
        return result;
    }
    throw new ServerError('Cannot create new consumption transaction')
};
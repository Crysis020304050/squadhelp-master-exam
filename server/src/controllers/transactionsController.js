const db = require('../models');
const bankQueries = require('./queries/bankQueries');
const {CONSUMPTION_TRANSACTION} = require('../constants/constants');
const userQueries = require('./queries/userQueries');
const contestQueries = require('./queries/contestQueries');
const transactionsQueries = require('./queries/transactionsQueries.js');
const money = require('money-math');

module.exports.paymentForContestOrContests = async (req, res, next) => {
    try {
        const {tokenData: {id}, body: {contests, number, cvc, expiry, price}} = req;
        const priceToMoney = money.floatToAmount(price);
        await db.sequelize.transaction(async transaction => {
            await bankQueries.updateBankBalance(number, cvc, expiry, priceToMoney, false, transaction);
            await contestQueries.createContestOrContests(contests, priceToMoney, id, transaction);
        });
        res.end();
    } catch (e) {
        next(e);
    }
};

module.exports.cashOut = async (req, res, next) => {
    try {
        const {tokenData: {id}, body: {number, cvc, expiry, sum}} = req;
        const sumToMoney = money.floatToAmount(sum);
        const updatedBalance = await db.sequelize.transaction(async transaction => {
            const updatedUser = await userQueries.updateUser(
                { balance: db.sequelize.literal(`balance-${sumToMoney}`) },
                id, transaction);
            await bankQueries.updateBankBalance(number, cvc, expiry, sumToMoney, true, transaction);
            await transactionsQueries.newConsumptionTransaction({
                typeOperation: CONSUMPTION_TRANSACTION,
                sum: sumToMoney,
                userId: updatedUser.id,
            }, transaction);
            return updatedUser.balance;
        });
        res.send({ balance: updatedBalance });
    } catch (e) {
        next(e);
    }
};

module.exports.getUserTransactionsHistory = async (req, res, next) => {
    try {
        const {tokenData: {id}} = req;
        const searchFilter = {
            where: {
                userId: id,
            }
        };
        const result = await transactionsQueries.getTransactions(searchFilter);
        return res.send(result);
    } catch (e) {
        next(e);
    }
};

module.exports.getUserTransactionsStatement = async (req, res, next) => {
    try {
        const {tokenData: {id}} = req;
        const searchFilter = {
            where: {
                userId: id,
            },
            raw: true,
            attributes: ['typeOperation', [db.Sequelize.fn('sum', db.Sequelize.col('sum')), 'sum']],
            group: ['typeOperation'],
        };
        const result = await transactionsQueries.getTransactions(searchFilter);
        return res.send(result);
    } catch (e) {
        next(e);
    }
};
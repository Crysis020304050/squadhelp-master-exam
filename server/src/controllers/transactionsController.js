const bd = require('../models');
const moment = require('moment');
const uuid = require('uuid/v1');
const bankQueries = require('./queries/bankQueries');
const {SQUADHELP_BANK_NUMBER, SQUADHELP_BANK_CVC, SQUADHELP_BANK_EXPIRY, CONTEST_STATUS_ACTIVE, CONTEST_STATUS_PENDING, CONSUMPTION_TRANSACTION} = require('../constants/constants');
const userQueries = require('./queries/userQueries');
const transactionsQueries = require('./queries/transactionsQueries.js');
const money = require('money-math');

module.exports.payment = async (req, res, next) => {
    const {tokenData: {id}, body: {contests, number, cvc, expiry, price}} = req;
    const priceToMoney = money.floatToAmount(price);
    let transaction;
    try {
        transaction = await bd.sequelize.transaction();
        await bankQueries.updateBankBalance({
                balance: bd.sequelize.literal(`
                CASE
            WHEN "cardNumber"='${ number.replace(/ /g,
                    '') }' AND "cvc"='${ cvc }' AND "expiry"='${ expiry }'
                THEN "balance"-${ priceToMoney }
            WHEN "cardNumber"='${ SQUADHELP_BANK_NUMBER }' AND "cvc"='${ SQUADHELP_BANK_CVC }' AND "expiry"='${ SQUADHELP_BANK_EXPIRY }'
                THEN "balance"+${ priceToMoney } END
        `),
            },
            {
                cardNumber: {
                    [ bd.sequelize.Op.in ]: [
                        SQUADHELP_BANK_NUMBER,
                        number.replace(/ /g, ''),
                    ],
                },
            },
            transaction);
        const orderId = uuid();
        const preparedContests = contests.map((contest, index) => ({
            ...contest,
            status: index === 0 ? CONTEST_STATUS_ACTIVE : CONTEST_STATUS_PENDING,
            userId: id,
            priority: index + 1,
            orderId,
            createdAt: moment().format('YYYY-MM-DD HH:mm'),
            prize: money.floatToAmount(money.div(priceToMoney, money.floatToAmount(contests.length))),
        }));

        await bd.Contests.bulkCreate(preparedContests, transaction);
        transaction.commit();
        res.end();
    } catch (err) {
        transaction.rollback();
        next(err);
    }
};

module.exports.cashout = async (req, res, next) => {
    const {tokenData: {id}, body: {number, cvc, expiry, sum}} = req;
    const sumToMoney = money.floatToAmount(sum);
    let transaction;
    try {
        transaction = await bd.sequelize.transaction();
        const updatedUser = await userQueries.updateUser(
            { balance: bd.sequelize.literal('balance - ' + sumToMoney) },
            id, transaction);
        await bankQueries.updateBankBalance({
                balance: bd.sequelize.literal(`CASE 
                WHEN "cardNumber"='${ number.replace(/ /g,
                    '') }' AND "expiry"='${ expiry }' AND "cvc"='${ cvc }'
                    THEN "balance"+${ sumToMoney }
                WHEN "cardNumber"='${ SQUADHELP_BANK_NUMBER }' AND "expiry"='${ SQUADHELP_BANK_EXPIRY }' AND "cvc"='${ SQUADHELP_BANK_CVC }'
                    THEN "balance"-${ sumToMoney }
                 END
                `),
            },
            {
                cardNumber: {
                    [ bd.sequelize.Op.in ]: [
                        SQUADHELP_BANK_NUMBER,
                        number.replace(/ /g, ''),
                    ],
                },
            },
            transaction);
        transaction.commit();
        await transactionsQueries.newConsumptionTransaction({
            typeOperation: CONSUMPTION_TRANSACTION,
            sum: sumToMoney,
            userId: updatedUser.id,
        });
        res.send({ balance: updatedUser.balance });
    } catch (err) {
        transaction.rollback();
        next(err);
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
            attributes: ['typeOperation', [bd.Sequelize.fn('sum', bd.Sequelize.col('sum')), 'sum']],
            group: ['typeOperation'],
        };
        const result = await transactionsQueries.getTransactions(searchFilter);
        return res.send(result);
    } catch (e) {
        next(e);
    }
};
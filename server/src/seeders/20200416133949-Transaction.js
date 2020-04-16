'use strict';
const {INCOME_TRANSACTION, CONSUMPTION_TRANSACTION} = require('../constants/constants.js');

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.bulkInsert('TransactionHistories', [
            {
                typeOperation: INCOME_TRANSACTION,
                sum: 100,
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                typeOperation: CONSUMPTION_TRANSACTION,
                sum: 50,
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                typeOperation: INCOME_TRANSACTION,
                sum: 500,
                userId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('TransactionHistories', null, {});
    }
};

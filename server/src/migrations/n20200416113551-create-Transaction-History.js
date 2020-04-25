'use strict';
const {INCOME_TRANSACTION, CONSUMPTION_TRANSACTION} = require('../constants/constants.js');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TransactionHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      typeOperation: {
        type: Sequelize.ENUM(INCOME_TRANSACTION, CONSUMPTION_TRANSACTION),
        allowNull: false,
      },
      sum: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('TransactionHistories');
  }
};
'use strict';

const {MODERATION_STATUS_MODERATION, MODERATION_STATUS_RESOLVED, MODERATION_STATUS_REJECTED} = require("../constants/constants.js");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Offers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      contestId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Contests',
          key: 'id',
        },
      },
      text: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fileName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      originalFileName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'pending',
      },
      moderationStatus: {
        type: Sequelize.ENUM(MODERATION_STATUS_MODERATION, MODERATION_STATUS_RESOLVED, MODERATION_STATUS_REJECTED),
        allowNull: false,
        defaultValue: MODERATION_STATUS_MODERATION,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Offers');
  },
};

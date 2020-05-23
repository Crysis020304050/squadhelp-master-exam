'use strict';
const {CUSTOMER, CREATOR, MODERATOR} = require('../constants/constants.js');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      displayName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'anon.png',
      },
      role: {
        type: Sequelize.ENUM(CUSTOMER, CREATOR, MODERATOR),
        allowNull: false,
      },
      balance: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
      rating: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
    })
      .then(() => queryInterface.addConstraint('Users', ['balance'], {
        type: 'check',
        where: {
          balance: {
            [ Sequelize.Op.gte ]: 0,
          },
        },
      }));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  },
};
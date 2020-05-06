'use strict';
const bcrypt = require('bcrypt');
const CONSTANTS = require('../constants/constants');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashPassword = await bcrypt.hash('moderator1', CONSTANTS.SALT_ROUNDS);
    const moderator = {
      firstName: 'moderator1',
      lastName: 'moderator1',
      displayName: 'moderator1',
      email: 'moderator1@gmail.com',
      role: CONSTANTS.MODERATOR,
      password: hashPassword,

    };
    return queryInterface.bulkInsert('Users', [moderator], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};


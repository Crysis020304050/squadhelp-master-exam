'use strict';
const bcrypt = require('bcrypt');
const constants = require('../constants/constants');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashPassword = await bcrypt.hash('moderator', constants.SALT_ROUNDS);
    const moderator = {
      firstName: 'moderator',
      lastName: 'moderator',
      displayName: 'moderator',
      email: 'moderator@gmail.com',
      role: constants.MODERATOR,
      password: hashPassword,

    };
    return queryInterface.bulkInsert('Users', [moderator], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};


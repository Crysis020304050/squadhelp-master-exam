'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('BlackLists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        unique: 'owner_blocked_user_pair',
      },
      blockedUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        unique: 'owner_blocked_user_pair',
      },
    }).then(() => (
        queryInterface.sequelize.query('alter table "BlackLists" add constraint "owner_blocked_user_pair" unique ("userId", "blockedUserId")')
    ));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('BlackLists');
  }
};
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FavoriteLists', {
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
        unique: 'owner_favorite_user_pair',
      },
      favoriteUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        unique: 'owner_favorite_user_pair',
      },
    }).then(() => (
        queryInterface.sequelize.query('alter table "FavoriteLists" add constraint "owner_favorite_user_pair" unique ("userId", "favoriteUserId")')
    ));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('FavoriteLists');
  }
};
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Catalogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: 'catalog_name_user_pair',
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        unique: 'catalog_name_user_pair',
      },
    }).then(() => (
        queryInterface.sequelize.query('alter table "Catalogs" add constraint "catalog_name_user_pair" unique ("name", "userId")')
    ));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Catalogs');
  }
};
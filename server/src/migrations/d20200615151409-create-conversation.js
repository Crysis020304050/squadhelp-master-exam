'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Conversations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      participantFirstId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        unique: 'participants_pair',
      },
      participantSecondId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        unique: 'participants_pair',
      },
    }).then(() => (
        queryInterface.sequelize.query('alter table "Conversations" add constraint "participants_pair" unique ("participantFirstId", "participantSecondId")')
    ));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Conversations');
  }
};
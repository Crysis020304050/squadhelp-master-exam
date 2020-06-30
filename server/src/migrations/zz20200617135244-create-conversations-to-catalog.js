'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ConversationsToCatalogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      catalogId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Catalogs',
          key: 'id',
        },
        onDelete: 'CASCADE',
        unique: 'catalog_conversation_pair',
      },
      conversationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Conversations',
          key: 'id',
        },
        onDelete: 'CASCADE',
        unique: 'catalog_conversation_pair',
      },
    }).then(() => (
        queryInterface.sequelize.query('alter table "ConversationsToCatalogs" add constraint "catalog_conversation_pair" unique ("catalogId", "conversationId")')
    ));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ConversationsToCatalogs');
  }
};
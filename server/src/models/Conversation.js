'use strict';
module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define('Conversation', {
    participant1: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    participant2: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: false
  });
  Conversation.associate = function(models) {
    Conversation.belongsTo(models.User, {foreignKey: 'participant1', sourceKey: 'participant1'});
  };
  Conversation.associate = function(models) {
    Conversation.belongsTo(models.User, {foreignKey: 'participant2', sourceKey: 'participant2'});
  };
  Conversation.associate = function(models) {
    Conversation.belongsToMany(models.Catalog, {through: 'ConversationsToCatalogs'});
  };
  Conversation.associate = function(models) {
    Conversation.hasMany(models.Message, {foreignKey: 'conversation_id', targetKey: 'id'});
  };
  return Conversation;
};
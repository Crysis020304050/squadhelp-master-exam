'use strict';
module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define('Conversation', {
    participantFirstId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    participantSecondId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['participantFirstId', 'participantSecondId']
      }
    ]
  });
  Conversation.associate = function(models) {
    Conversation.belongsTo(models.User, {as: 'owner', foreignKey: 'participantFirstId', sourceKey: 'id'});
    Conversation.belongsTo(models.User, {as: 'interlocutor', foreignKey: 'participantSecondId', sourceKey: 'id'});
    Conversation.belongsToMany(models.Catalog, {through: models.ConversationsToCatalogs, foreignKey: 'conversationId', onDelete: 'cascade', hooks: true});
    Conversation.hasMany(models.Message, {as: 'conversationMessages', foreignKey: 'conversationId', targetKey: 'id'});
  };
  return Conversation;
};
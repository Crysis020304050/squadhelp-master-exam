'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    body: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }
  }, {
    timestamps: true
  });
  Message.associate = function(models) {
    Message.belongsTo(models.Conversation, {as: 'conversationMessages', foreignKey: 'conversationId', sourceKey: 'id'});
    Message.belongsTo(models.User, {as: 'userMessages', foreignKey: 'userId', sourceKey: 'id'});
  };
  return Message;
};
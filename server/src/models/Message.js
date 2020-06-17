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
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    timestamps: true
  });
  Message.associate = function(models) {
    Message.belongsTo(models.User, {foreignKey: 'user_id', sourceKey: 'id'});
  };
  Message.associate = function(models) {
    Message.belongsTo(models.Conversation, {foreignKey: 'conversation_id', sourceKey: 'id'});
  };
  return Message;
};
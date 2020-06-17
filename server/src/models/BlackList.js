'use strict';
module.exports = (sequelize, DataTypes) => {
  const BlackList = sequelize.define('BlackList', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    blockedUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    timestamps: true
  });
  BlackList.associate = function(models) {
    BlackList.belongsTo(models.User, {foreignKey: 'user_id', sourceKey: 'userId'});
  };
  BlackList.associate = function(models) {
    BlackList.belongsTo(models.User, {foreignKey: 'blocked_user_id', sourceKey: 'blockedUserId'});
  };

  return BlackList;
};
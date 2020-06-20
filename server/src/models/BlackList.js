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
    timestamps: false
  });
  BlackList.associate = function(models) {
    BlackList.belongsTo(models.User, {as: 'blackListOwner', foreignKey: 'userId', sourceKey: 'id'});
    BlackList.belongsTo(models.User, {as: 'blockedUser', foreignKey: 'blockedUserId', sourceKey: 'id'});
  };

  return BlackList;
};
'use strict';
module.exports = (sequelize, DataTypes) => {
  const FavoriteList = sequelize.define('FavoriteList', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    favoriteUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'favoriteUserId']
      }
    ]
  });
  FavoriteList.associate = function(models) {
    FavoriteList.belongsTo(models.User, {as: 'favoriteListOwner', foreignKey: 'userId', sourceKey: 'id'});
    FavoriteList.belongsTo(models.User, {as: 'favoriteUser', foreignKey: 'favoriteUserId', sourceKey: 'id'});
  };

  return FavoriteList;
};
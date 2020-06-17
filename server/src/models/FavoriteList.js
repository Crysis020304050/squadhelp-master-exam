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
    timestamps: true
  });
  FavoriteList.associate = function(models) {
    FavoriteList.belongsTo(models.User, {foreignKey: 'user_id', sourceKey: 'id'});
  };
  FavoriteList.associate = function(models) {
    FavoriteList.belongsTo(models.User, {foreignKey: 'favorite_user_id', sourceKey: 'id'});
  };
  return FavoriteList;
};
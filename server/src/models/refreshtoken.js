'use strict';
module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define( 'RefreshToken', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    value: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    }
  }, {} );
  RefreshToken.associate = function (models) {
    RefreshToken.belongsTo( models.User, {
      foreignKey: 'userId',
    } );
  };

  return RefreshToken;
}
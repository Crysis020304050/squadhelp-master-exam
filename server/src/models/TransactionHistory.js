'use strict';
const {INCOME_TRANSACTION, CONSUMPTION_TRANSACTION} = require('../constants/constants.js');

module.exports = (sequelize, DataTypes) => {
  const TransactionHistory = sequelize.define('TransactionHistory', {
    typeOperation: {
      type: DataTypes.ENUM(INCOME_TRANSACTION, CONSUMPTION_TRANSACTION),
      allowNull: false,
    },
    sum: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      }
    }
  }, {
    timestamps: true
  });
  TransactionHistory.associate = function(models) {
    TransactionHistory.belongsTo(models.User, {foreignKey: 'user_id', sourceKey: 'id'});
  };
  return TransactionHistory;
};
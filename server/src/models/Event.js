'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date().toLocaleDateString(),
      }
    },
    reminderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date().toLocaleDateString(),

      }
    },
  }, {
    timestamps: true,
  });
  Event.associate = function(models) {
    Event.belongsTo(models.User, {foreignKey: 'userId', sourceKey: 'id'});
  };
  return Event;
};
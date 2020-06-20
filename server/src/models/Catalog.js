'use strict';
module.exports = (sequelize, DataTypes) => {
    const Catalog = sequelize.define('Catalog', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        timestamps: false,
    });
    Catalog.associate = function (models) {
        Catalog.belongsTo(models.User, {foreignKey: 'userId', sourceKey: 'id'});
        Catalog.belongsToMany(models.Conversation, {through: 'ConversationsToCatalogs'});
    };

    return Catalog;
};
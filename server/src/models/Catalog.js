'use strict';
module.exports = (sequelize, DataTypes) => {
    const Catalog = sequelize.define('Catalog', {
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['name', 'userId']
            }
        ]
    });
    Catalog.associate = function (models) {
        Catalog.belongsTo(models.User, {foreignKey: 'userId', sourceKey: 'id'});
        Catalog.belongsToMany(models.Conversation, {through: models.ConversationsToCatalogs, foreignKey: 'catalogId', onDelete: 'cascade', hooks: true});
    };

    return Catalog;
};
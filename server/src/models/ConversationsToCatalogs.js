'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ConversationsToCatalogs', {
        catalogId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        conversationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: false
    });
};
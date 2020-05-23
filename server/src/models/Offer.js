'use strict';

const {MODERATION_STATUS_MODERATION, MODERATION_STATUS_RESOLVED, MODERATION_STATUS_REJECTED} = require("../constants/constants.js");

module.exports = (sequelize, DataTypes) => {
    const Offer = sequelize.define('Offers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,

            },
            contestId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            text: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            fileName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            originalFileName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'pending',
            },
            createdAt:{
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.fn('now'),
            },
            moderationStatus: {
                type: DataTypes.ENUM(MODERATION_STATUS_MODERATION, MODERATION_STATUS_RESOLVED, MODERATION_STATUS_REJECTED),
                allowNull: false,
                defaultValue: MODERATION_STATUS_MODERATION,
            },
        },
        {
            timestamps: false,
        });

    Offer.associate = function (models) {
        Offer.belongsTo(models.User, {foreignKey: 'user_id', sourceKey: 'id'});
    };

    Offer.associate = function (models) {
        Offer.belongsTo(models.Contest,
            {foreignKey: 'contest_id', sourceKey: 'id'});
    };

    return Offer;
};
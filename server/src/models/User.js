'use strict';

const {CUSTOMER, CREATOR, MODERATOR} = require('../constants/constants.js');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            displayName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            avatar: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'anon.png',
            },
            role: {
                type: DataTypes.ENUM(CUSTOMER, CREATOR, MODERATOR),
                allowNull: false,
            },
            balance: {
                type: DataTypes.DECIMAL,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    min: 0,
                },
            },
            rating: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            timestamps: false,
        });

    User.associate = function (models) {
        User.hasMany(models.Order, {foreignKey: 'user_id', targetKey: 'id'});
        User.hasMany(models.Participant, {foreignKey: 'user_id', targetKey: 'id'});
        User.hasMany(models.Offer, {foreignKey: 'user_id', targetKey: 'id'});
        User.hasMany(models.RefreshToken, {foreignKey: 'user_id', targetKey: 'id'});
        User.hasMany(models.TransactionHistory, {foreignKey: 'user_id', targetKey: 'id'});
        User.hasMany(models.Conversation, {as: 'owner', foreignKey: 'participantFirstId', targetKey: 'id'});
        User.hasMany(models.Conversation, {as: 'interlocutor', foreignKey: 'participantSecondId', targetKey: 'id'});
        User.hasMany(models.Catalog, {foreignKey: 'userId', targetKey: 'id'});
        User.hasMany(models.Message, {as: 'userMessages', foreignKey: 'userId', targetKey: 'id'});
        User.hasMany(models.BlackList, {as: 'blackListOwner', foreignKey: 'userId', targetKey: 'id'});
        User.hasMany(models.BlackList, {as: 'blockedUser', foreignKey: 'blockedUserId', targetKey: 'id'});
        User.hasMany(models.FavoriteList, {as: 'favoriteListOwner', foreignKey: 'userId', targetKey: 'id'});
        User.hasMany(models.FavoriteList, {as: 'favoriteUser', foreignKey: 'favoriteUserId', targetKey: 'id'});
    };

    return User;
};

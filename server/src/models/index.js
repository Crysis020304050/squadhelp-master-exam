'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configPath = env === 'production' ? path.join(__dirname, '..', '..', '..',
    'src/server/config/postgresConfig.json') : path.join(__dirname, '..',
    '/config/postgresConfig.json');
const config = require(configPath)[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username,
    config.password, config);

fs
    .readdirSync(__dirname)
    .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== basename) &&
            (file.slice(-3) === '.js');
    })
    .forEach((file) => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

db['Contests'].belongsTo(db['Users'],
    {foreignKey: 'userId', sourceKey: 'id'});
db['Contests'].hasMany(db['Offers'],
    {foreignKey: 'contestId', targetKey: 'id'});

db['Users'].hasMany(db['Offers'],
    {foreignKey: 'userId', targetKey: 'id'});
db['Users'].hasMany(db['Contests'],
    {foreignKey: 'userId', targetKey: 'id'});
db['Users'].hasMany(db['Ratings'],
    {foreignKey: 'userId', targetKey: 'id'});
db['Users'].hasMany(db['RefreshToken'],
    {foreignKey: 'userId', targetKey: 'id'});
db['Users'].hasMany(db['TransactionHistory'],
    {foreignKey: 'userId', targetKey: 'id'});
db['Users'].hasMany(db['Conversation'],
    {as: 'owner', foreignKey: 'participantFirstId', targetKey: 'id'});
db['Users'].hasMany(db['Conversation'],
    {as: 'interlocutor', foreignKey: 'participantSecondId', targetKey: 'id'});
db['Users'].hasMany(db['Catalog'],
    {foreignKey: 'userId', targetKey: 'id'});
db['Users'].hasMany(db['Message'],
    {as: 'userMessages', foreignKey: 'userId', targetKey: 'id'});
db['Users'].hasMany(db['BlackList'],
    {as: 'blackListOwner', foreignKey: 'userId', targetKey: 'id'});
db['Users'].hasMany(db['BlackList'],
    {as: 'blockedUser', foreignKey: 'blockedUserId', targetKey: 'id'});
db['Users'].hasMany(db['FavoriteList'],
    {as: 'favoriteListOwner', foreignKey: 'userId', targetKey: 'id'});
db['Users'].hasMany(db['FavoriteList'],
    {as: 'favoriteUser', foreignKey: 'favoriteUserId', targetKey: 'id'});

db['Offers'].belongsTo(db['Users'],
    {foreignKey: 'userId', sourceKey: 'id'});
db['Offers'].belongsTo(db['Contests'],
    {foreignKey: 'contestId', sourceKey: 'id'});
db['Offers'].hasOne(db['Ratings'],
    {foreignKey: 'offerId', targetKey: 'id'});

db['Ratings'].belongsTo(db['Users'],
    {foreignKey: 'userId', targetKey: 'id'});
db['Ratings'].belongsTo(db['Offers'],
    {foreignKey: 'offerId', targetKey: 'id'});

db['RefreshToken'].belongsTo(db['Users'],
    {foreignKey: 'userId', targetKey: 'id'});

db['TransactionHistory'].belongsTo(db['Users'],
    {foreignKey: 'userId', targetKey: 'id'});

db['Conversation'].belongsTo(db['Users'],
    {as: 'owner', foreignKey: 'participantFirstId', sourceKey: 'id'});
db['Conversation'].belongsTo(db['Users'],
    {as: 'interlocutor', foreignKey: 'participantSecondId', sourceKey: 'id'});
db['Conversation'].belongsToMany(db['Catalog'],
    {through: db['ConversationsToCatalogs'], foreignKey: 'conversationId'});
db['Conversation'].hasMany(db['Message'],
    {as: 'conversationMessages', foreignKey: 'conversationId', targetKey: 'id', onDelete: 'cascade', hooks: true});

db['Catalog'].belongsTo(db['Users'],
    {foreignKey: 'userId', sourceKey: 'id'});
db['Catalog'].belongsToMany(db['Conversation'],
    {through: db['ConversationsToCatalogs'], foreignKey: 'catalogId', onDelete: 'cascade', hooks: true});

db['Message'].belongsTo(db['Conversation'],
    {as: 'conversationMessages', foreignKey: 'conversationId', sourceKey: 'id'});
db['Message'].belongsTo(db['Users'],
    {as: 'userMessages', foreignKey: 'userId', sourceKey: 'id'});

db['FavoriteList'].belongsTo(db['Users'],
    {as: 'favoriteListOwner', foreignKey: 'userId', sourceKey: 'id'});
db['FavoriteList'].belongsTo(db['Users'],
    {as: 'favoriteUser', foreignKey: 'favoriteUserId', sourceKey: 'id'});

db['BlackList'].belongsTo(db['Users'],
    {as: 'blackListOwner', foreignKey: 'userId', sourceKey: 'id'});
db['BlackList'].belongsTo(db['Users'],
    {as: 'blockedUser', foreignKey: 'blockedUserId', sourceKey: 'id'});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

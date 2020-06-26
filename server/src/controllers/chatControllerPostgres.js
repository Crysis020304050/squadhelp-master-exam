const {findUser} = require('./queries/userQueries');
const chatQueries = require('./queries/chatQueries');
const controller = require('../index.js');
const ServerError = require('../errors/ServerError');

module.exports.getPreview = async (req, res, next) => {
    try {
        const {tokenData: {id}} = req;
        const conversations = await chatQueries.getConversationsData(id);
        res.send(conversations);
    } catch (e) {
        next(e);
    }
};

module.exports.getChat = async (req, res, next) => {
    try {
        const {body: {conversationId, interlocutorId}} = req;
        if (conversationId) {
            const messages = await chatQueries.findMessages({conversationId});
            res.send({messages});
        } else {
            const {id, firstName, lastName, displayName, avatar} = await findUser({id: interlocutorId});
            res.send({
                interlocutor: {
                    id,
                    firstName,
                    lastName,
                    displayName,
                    avatar,
                }
            });
        }
    } catch (e) {
        next(e);
    }
};

module.exports.addMessage = async (req, res, next) => {
    try {
        const {body: {body, conversationId, interlocutor}, tokenData: {id, firstName, lastName, displayName, avatar}} = req;
        if (conversationId) {
            const message = await chatQueries.createMessage({conversationId, userId: id, body});
            controller.controller.chatController.emitNewMessage(interlocutor.id, {message});
            res.send({message});
        } else {
            const conversation = await chatQueries.createConversation({
                participantFirstId: id,
                participantSecondId: interlocutor.id
            });
            const message = await chatQueries.createMessage({conversationId: conversation.id, userId: id, body});
            const chatPreview = {
                _id: conversation.id,
                sender: message.userId,
                text: message.body,
                createAt: message.createdAt,
                participants: [conversation.participantFirstId, conversation.participantSecondId],
                blackList: [false, false],
                favoriteList: [false, false],
                interlocutor,
            };
            controller.controller.chatController.emitNewMessage(interlocutor.id, {
                message, chatPreview: {
                    ...chatPreview, interlocutor: {
                        id,
                        firstName,
                        lastName,
                        displayName,
                        avatar
                    }
                }
            });
            res.send({message, chatPreview});
        }
    } catch (e) {
        next(e);
    }
};

module.exports.changeFavoriteUserStatus = async (req, res, next) => {
    try {
        const {body: {conversationId, participantsToFavoriteListPair, favoriteFlag, interlocutorId}, tokenData: {id}} = req;
        const result = {conversationId};
        const [firstParticipantData, secondParticipantData] = participantsToFavoriteListPair;
        if (favoriteFlag) {
            await chatQueries.addUserToFavoriteList({userId: id, favoriteUserId: interlocutorId});
            if (firstParticipantData.id === id) {
                result.favoriteList = [true, secondParticipantData.flag];
            } else {
                result.favoriteList = [firstParticipantData.flag, true]
            }
        } else {
            await chatQueries.removeUserFromFavoriteList({userId: id, favoriteUserId: interlocutorId});
            if (firstParticipantData.id === id) {
                result.favoriteList = [false, secondParticipantData.flag];
            } else {
                result.favoriteList = [firstParticipantData.flag, false]
            }
        }
        res.send(result);
    } catch (e) {
        next(e);
    }
};

module.exports.changeBlockedUserStatus = async (req, res, next) => {
    try {
        const {body: {conversationId, participantsToBlackListPair, blackListFlag, interlocutorId}, tokenData: {id}} = req;
        const result = {conversationId};
        const [firstParticipantData, secondParticipantData] = participantsToBlackListPair;
        if (blackListFlag) {
            await chatQueries.addUserToBlackList({userId: id, blockedUserId: interlocutorId});
            if (firstParticipantData.id === id) {
                result.blackList = [true, secondParticipantData.flag];
            } else {
                result.blackList = [firstParticipantData.flag, true]
            }
        } else {
            await chatQueries.removeUserFromBlackList({userId: id, blockedUserId: interlocutorId});
            if (firstParticipantData.id === id) {
                result.blackList = [false, secondParticipantData.flag];
            } else {
                result.blackList = [firstParticipantData.flag, false]
            }
        }
        controller.controller.chatController.emitChangeBlockStatus(interlocutorId, {...result});
        res.send(result);
    } catch (e) {
        next(e);
    }
};

module.exports.getCatalogs = async (req, res, next) => {
    try {
        const {tokenData: {id}} = req;
        const catalogsConversationsPairs = await chatQueries.getCatalogsWithConversations(id);
        res.send(catalogsConversationsPairs);
    } catch (e) {
        next(e);
    }
};

module.exports.createCatalog = async (req, res, next) => {
    try {
        const {tokenData: {id}, body: {name, conversationId}} = req;
        const catalog = await chatQueries.createCatalog({name, userId: id});
        await chatQueries.setCatalogConversation(catalog, conversationId);
        const result = {
            _id: catalog.dataValues.id,
            catalogName: name,
            chats: [conversationId],
        };
        res.send(result);
    } catch (e) {
        next(e);
    }
};
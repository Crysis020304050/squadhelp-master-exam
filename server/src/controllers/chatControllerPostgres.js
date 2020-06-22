const {findUser} = require('./queries/userQueries');
const {getConversationsData, findMessages, createMessage, createConversation} = require('./queries/chatQueries');
const controller = require('../index.js');

module.exports.getPreview = async (req, res, next) => {
    try {
        const {tokenData: {id}} = req;
        const conversations = await getConversationsData(id);
        res.send(conversations);
    } catch (e) {
        next(e);
    }
};

module.exports.getChat = async (req, res, next) => {
    try {
        const {body: {conversationId, interlocutorId}} = req;
        if (conversationId) {
            const messages = await findMessages({conversationId});
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
            const message = await createMessage({conversationId, userId: id, body});
            controller.controller.chatController.emitNewMessage(interlocutor.id, {message});
            res.send({message});
        } else {
            const conversation = await createConversation({
                participantFirstId: id,
                participantSecondId: interlocutor.id
            });
            const message = await createMessage({conversationId: conversation.id, userId: id, body});
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
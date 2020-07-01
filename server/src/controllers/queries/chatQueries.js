const db = require('../../models');
const ServerError = require('../../errors/ServerError');

module.exports.getConversationsData = async (userId) => {
    const conversations = await db.sequelize.query(`select C.id,
       C."participantFirstId",
       C."participantSecondId",
       M."userId",
       M.body,
       M."createdAt",
       OWNER.id as "ownerId",
       OWNER."firstName" as "ownerFirstName",
       OWNER."lastName" as "ownerLastName",
       OWNER."displayName" as "ownerDisplayName",
       OWNER.avatar as "ownerAvatar",
       INTERLOCUTOR.id as "interlocutorId",
       INTERLOCUTOR."firstName" as "interlocutorFirstName",
       INTERLOCUTOR."lastName" as "interlocutorLastName",
       INTERLOCUTOR."displayName" as "interlocutorDisplayName",
       INTERLOCUTOR.avatar as "interlocutorAvatar",
       BL_OWNER."userId" as "ownerBL",
       BL_INTERLOCUTOR."userId" as "interlocutorBL",
       FL_OWNER."userId" as "ownerFL",
       FL_INTERLOCUTOR."userId" as "interlocutorFL"
from "Conversations" C
         join "Messages" M on M.id = (select id
                                      from "Messages" M2
                                      where M2."conversationId" = C.id
                                      order by M2.id desc
                                      limit 1)
         join "Users" OWNER on C."participantFirstId" = OWNER.id
         join "Users" INTERLOCUTOR on "participantSecondId" = INTERLOCUTOR.id
         left join "BlackLists" BL_OWNER on BL_OWNER.id = (select id
                                                           from "BlackLists" BL_OWNER2
                                                           where BL_OWNER2."blockedUserId" = C."participantSecondId"
                                                             and BL_OWNER2."userId" = C."participantFirstId")
         left join "BlackLists" BL_INTERLOCUTOR on BL_INTERLOCUTOR.id = (select id
                                                                         from "BlackLists" BL_INTERLOCUTOR2
                                                                         where BL_INTERLOCUTOR2."blockedUserId" = C."participantFirstId"
                                                                           and BL_INTERLOCUTOR2."userId" = C."participantSecondId")
         left join "FavoriteLists" FL_OWNER on FL_OWNER.id = (select id
                                                              from "FavoriteLists" FL_OWNER2
                                                              where FL_OWNER2."favoriteUserId" = C."participantSecondId"
                                                                and FL_OWNER2."userId" = C."participantFirstId")
         left join "FavoriteLists" FL_INTERLOCUTOR on FL_INTERLOCUTOR.id = (select id
                                                                            from "FavoriteLists" FL_INTERLOCUTOR2
                                                                            where FL_INTERLOCUTOR2."favoriteUserId" = C."participantFirstId"
                                                                              and FL_INTERLOCUTOR2."userId" = C."participantSecondId")
                                                        where C."participantFirstId" = ${userId} or C."participantSecondId" = ${userId}`, {
        raw: true,
        nest: true
    });
    return conversations.map(({id, participantFirstId, participantSecondId, body, createdAt, ownerBL, interlocutorBL, ownerFL, interlocutorFL, ...rest}) => ({
        id,
        userId: rest.userId,
        body,
        createdAt,
        participants: [participantFirstId, participantSecondId],
        blackList: [(!!ownerBL), (!!interlocutorBL)],
        favoriteList: [(!!ownerFL), (!!interlocutorFL)],
        interlocutor: userId === participantFirstId
            ? {
                id: rest.interlocutorId,
                firstName: rest.interlocutorFirstName,
                lastName: rest.interlocutorLastName,
                displayName: rest.interlocutorDisplayName,
                avatar: rest.interlocutorAvatar,
            }
            : {
                id: rest.ownerId,
                firstName: rest.ownerFirstName,
                lastName: rest.ownerLastName,
                displayName: rest.ownerDisplayName,
                avatar: rest.ownerAvatar,
            }
    }));
};

module.exports.findMessages = async (predicate, limit, offset) => {
    return await db.Message.findAll({where: predicate, order: [['createdAt', 'desc']], limit: limit || 20, offset: offset || 0, raw: true});
};

module.exports.createMessage = async (data) => {
    const message = await db.Message.create(data);
    if (message) {
        return message.get({plain: true});
    }
    throw new ServerError('Cannot create message');
};

module.exports.createConversation = async (data) => {
    const conversation = await db.Conversation.create(data);
    if (conversation) {
        return conversation.get({plain: true});
    }
    throw new ServerError('Cannot create conversation');
};

module.exports.addUserToFavoriteList = async (data) => {
    const favoriteListItem = await db.FavoriteList.create(data);
    if (favoriteListItem) {
        return favoriteListItem.get({plain: true});
    }
    throw new ServerError('Cannot add user to Favorite list');
};

module.exports.removeUserFromFavoriteList = async (predicate) => {
    const deletedRowCount = await db.FavoriteList.destroy({where: predicate});
    if (deletedRowCount) {
        return true;
    }
    throw new ServerError('Cannot remove user from Favorite list');
};

module.exports.addUserToBlackList = async (data) => {
    const blackListItem = await db.BlackList.create(data);
    if (blackListItem) {
        return blackListItem.get({plain: true});
    }
    throw new ServerError('Cannot add user to Black list');
};

module.exports.removeUserFromBlackList = async (predicate) => {
    const deletedRowCount = await db.BlackList.destroy({where: predicate});
    if (deletedRowCount) {
        return true;
    }
    throw new ServerError('Cannot remove user from Black list');
};

module.exports.getCatalogsWithConversations = async (userId) => {
    const catalogs = await db.Catalog.findAll({
        where: {
            userId,
        },
        include: [
            {
                model: db.Conversation,
                through: {
                    attributes: [],
                },
                attributes: ['id'],
            }
        ],
        attributes: ['id', 'name'],
        raw: true,
        nest: true
    });
    const preparedCatalogs = new Map();
    catalogs.forEach(({id, name, Conversations}) => {
        if (Conversations.id && preparedCatalogs.has(id)) {
            const updatedCatalog = preparedCatalogs.get(id);
            updatedCatalog.conversations = [...updatedCatalog.conversations, Conversations.id];
            preparedCatalogs.set(id, updatedCatalog);
        } else if (Conversations.id) {
            preparedCatalogs.set(id, {
                id,
                name,
                conversations: [Conversations.id],
            })
        } else {
            preparedCatalogs.set(id, {
                id,
                name,
                conversations: [],
            })
        }
    });
    return [...preparedCatalogs.values()];
};

module.exports.createCatalog = async (data) => {
    const catalog = await db.Catalog.create(data);
    if (catalog) {
        return catalog;
    }
    throw new ServerError('Cannot create catalog');
};

module.exports.setCatalogConversation = async (catalogModel, conversationId) => {
    return await catalogModel.setConversations(conversationId);
};

module.exports.deleteCatalog = async (predicate) => {
    const deletedRowCount = await db.Catalog.destroy({where: predicate});
    if (deletedRowCount) {
        return;
    }
    throw new ServerError('Cannot delete catalog');
};

module.exports.addNewConversationToCatalog = async (data) => {
    const newConversation = await db.ConversationsToCatalogs.create(data);
    if (newConversation) {
        return;
    }
    throw new ServerError('Cannot add new conversation to catalog');
};

module.exports.removeConversationFromCatalog = async (predicate) => {
    const deletedRowCount = await db.ConversationsToCatalogs.destroy({where: predicate});
    if (deletedRowCount) {
        return;
    }
    throw new ServerError('Cannot remove conversation from catalog');
};

module.exports.updateCatalog = async (data, predicate) => {
    const [updatedRowCount] = await db.Catalog.update(data,
        {where: predicate});
    if (updatedRowCount) {
        return;
    }
    throw new ServerError('Cannot update catalog');
};


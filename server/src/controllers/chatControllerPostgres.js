const db = require('../models');
const ServerError = require('../errors/ServerError');

module.exports.getPreview = async (req, res, next) => {
    try {
        const {tokenData: {id}} = req;
        const conversations = await db.sequelize.query(`select C.id,
       C."participantFirstId",
       C."participantSecondId",
       M."userId" as "sender",
       M.body as "text",
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
                                                        where C."participantFirstId" = ${id} or C."participantSecondId" = ${id}`, {
            raw: true,
            nest: true
        });
        const preparedConversations = conversations.map(({participantFirstId, participantSecondId, sender, text, createdAt, ownerBL, interlocutorBL, ownerFL, interlocutorFL, ...rest}) => ({
            _id: rest.id,
            sender,
            text,
            createAt: createdAt,
            participants: [participantFirstId, participantSecondId],
            blackList: [(!!ownerBL), (!!interlocutorBL)],
            favoriteList: [(!!ownerFL), (!!interlocutorFL)],
            interlocutor: id === participantFirstId
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
        res.send(preparedConversations);
    } catch (err) {
        next(err);
    }
};

module.exports.getChat = async (req, res, next) => {
    try {
        const {body: {conversationId}} = req;
        const messages = await db.Message.findAll({
            where: {conversationId}
        });
        res.send({messages});
    } catch (e) {
        next(e);
    }
};

module.exports.addMessage = async (req, res, next) => {
  try {
      const {body: {body, conversationId}, tokenData: {id}} = req;
      const message = await db.Message.create({conversationId, userId: id, body});
      res.send({message});
  } catch (e) {
      next(e);
  }
};
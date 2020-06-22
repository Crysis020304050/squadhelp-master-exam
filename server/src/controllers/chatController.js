const Conversation = require('../models/mongoModels/conversation');
const Message = require('../models/mongoModels/Message');
const Catalog = require('../models/mongoModels/Catalog');
const moment = require('moment');
const db = require('../models');
const userQueries = require('./queries/userQueries');
const controller = require('../index.js');
const _ = require('lodash');

module.exports.addMessage = async (req, res, next) => {
  const participants = [req.tokenData.id, req.body.recipient];
  participants.sort(
    (participant1, participant2) => participant1 - participant2);
  try {
    const newConversation = await Conversation.findOneAndUpdate({
        participants,
      },
      { participants, blackList: [false, false], favoriteList: [false, false] },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        useFindAndModify: false,
      });
    const message = new Message({
      sender: req.tokenData.id,
      body: req.body.messageBody,
      conversation: newConversation._id,
    });
    await message.save();
    message._doc.participants = participants;
    const interlocutorId = participants.filter(
      (participant) => participant !== req.tokenData.id)[ 0 ];
    const preview = {
      _id: newConversation._id,
      sender: req.tokenData.id,
      text: req.body.messageBody,
      createAt: message.createdAt,
      participants,
      blackList: newConversation.blackList,
      favoriteList: newConversation.favoriteList,
    };
    controller.controller.chatController.emitNewMessage(interlocutorId, {
      message,
      preview: {
        _id: newConversation._id,
        sender: req.tokenData.id,
        text: req.body.messageBody,
        createAt: message.createdAt,
        participants,
        blackList: newConversation.blackList,
        favoriteList: newConversation.favoriteList,
        interlocutor: {
          id: req.tokenData.id,
          firstName: req.tokenData.firstName,
          lastName: req.tokenData.lastName,
          displayName: req.tokenData.displayName,
          avatar: req.tokenData.avatar,
          email: req.tokenData.email,
        },
      },
    });
    res.send({
      message,
      preview: Object.assign(preview, { interlocutor: req.body.interlocutor }),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getChat = async (req, res, next) => {
  const participants = [req.tokenData.id, req.body.interlocutorId];
  participants.sort(
    (participant1, participant2) => participant1 - participant2);
  try {
    const messages = await Message.aggregate([
      {
        $lookup: {
          from: 'conversations',
          localField: 'conversation',
          foreignField: '_id',
          as: 'conversationData',
        },
      },
      { $match: { 'conversationData.participants': participants } },
      { $sort: { createdAt: 1 } },
      {
        $project: {
          '_id': 1,
          'sender': 1,
          'body': 1,
          'conversation': 1,
          'createdAt': 1,
          'updatedAt': 1,
        },
      },
    ]);

    const interlocutor = await userQueries.findUser(
      { id: req.body.interlocutorId });
    res.send({
      messages,
      interlocutor: {
        firstName: interlocutor.firstName,
        lastName: interlocutor.lastName,
        displayName: interlocutor.displayName,
        id: interlocutor.id,
        avatar: interlocutor.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getPreview = async (req, res, next) => {
  try {
    const conversations = await Message.aggregate([
      {
        $lookup: {
          from: 'conversations',
          localField: 'conversation',
          foreignField: '_id',
          as: 'conversationData',
        },
      },
      {
        $unwind: '$conversationData',
      },
      {
        $match: {
          'conversationData.participants': req.tokenData.id,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $group: {
          _id: '$conversationData._id',
          sender: { $first: '$sender' },
          text: { $first: '$body' },
          createAt: { $first: '$createdAt' },
          participants: { $first: '$conversationData.participants' },
          blackList: { $first: '$conversationData.blackList' },
          favoriteList: { $first: '$conversationData.favoriteList' },
        },
      },
    ]);
    const interlocutors = [];
    conversations.forEach(conversation => {
      interlocutors.push(conversation.participants.find(
        (participant) => participant !== req.tokenData.id));
    });
    const senders = await db.Users.findAll({
      where: {
        id: interlocutors,
      },
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });
    conversations.forEach((conversation) => {
      senders.forEach(sender => {
        if (conversation.participants.includes(sender.dataValues.id)) {
          conversation.interlocutor = {
            id: sender.dataValues.id,
            firstName: sender.dataValues.firstName,
            lastName: sender.dataValues.lastName,
            displayName: sender.dataValues.displayName,
            avatar: sender.dataValues.avatar,
          };
        }
      });
    });
    res.send(conversations);
  } catch (err) {
    next(err);
  }
};

module.exports.blackList = async (req, res, next) => {
  const predicate = 'blackList.' +
    req.body.participants.indexOf(req.tokenData.id);
  try {
    const chat = await Conversation.findOneAndUpdate(
      { participants: req.body.participants },
      { $set: { [ predicate ]: req.body.blackListFlag } }, { new: true });
    res.send(chat);
    const interlocutorId = req.body.participants.filter(
      (participant) => participant !== req.tokenData.id)[ 0 ];
    controller.controller.chatController.emitChangeBlockStatus(interlocutorId, chat);
  } catch (err) {
    res.send(err);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  const predicate = 'favoriteList.' +
    req.body.participants.indexOf(req.tokenData.id);
  try {
    const chat = await Conversation.findOneAndUpdate(
      { participants: req.body.participants },
      { $set: { [ predicate ]: req.body.favoriteFlag } }, { new: true });
    res.send(chat);
  } catch (err) {
    res.send(err);
  }
};

module.exports.createCatalog = async (req, res, next) => {
  console.log(req.body);
  const catalog = new Catalog({
    userId: req.tokenData.id,
    catalogName: req.body.catalogName,
    chats: [req.body.chatId],
  });
  try {
    await catalog.save();
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.updateNameCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalog.findOneAndUpdate({
      _id: req.body.catalogId,
      userId: req.tokenData.id,
    }, { catalogName: req.body.catalogName }, { new: true });
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalog.findOneAndUpdate({
      _id: req.body.catalogId,
      userId: req.tokenData.id,
    }, { $addToSet: { chats: req.body.chatId } }, { new: true });
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalog.findOneAndUpdate({
      _id: req.body.catalogId,
      userId: req.tokenData.id,
    }, { $pull: { chats: req.body.chatId } }, { new: true });
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  try {
    await Catalog.remove(
      { _id: req.body.catalogId, userId: req.tokenData.id });
    res.end();
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  try {
    const catalogs = await Catalog.aggregate([
      { $match: { userId: req.tokenData.id } },
      {
        $project: {
          _id: 1,
          catalogName: 1,
          chats: 1,
        },
      },
    ]);
    res.send(catalogs);
  } catch (err) {
    next(err);
  }
};
const db = require('../models');
const controller = require('../index.js');
const userQueries = require('./queries/userQueries');
const ratingQueries = require('./queries/ratingQueries');
const {prepareUserToSending} = require('../utils/functions');
const ServerError = require('../errors/ServerError');

module.exports.createUser = async (req, res, next) => {
  try {
    const {body, hashPass} = req;
    req.user = await userQueries.userCreation({...body, password: hashPass});
    next();
  } catch (e) {
    next(e);
  }
};

module.exports.changeMark = async (req, res, next) => {
  try {
    const {body: {isFirst, offerId, mark, creatorId}, tokenData: {id: userId}} = req;
    let avg = 0;
    await db.sequelize.transaction(async transaction => {
      if (isFirst) {
        await ratingQueries.createRating({offerId, userId, mark}, transaction);
      } else {
        await ratingQueries.updateRating({mark}, {offerId, userId}, transaction);
      }
      const ratingsWithOffers = await ratingQueries.getRatingsWithOffers(creatorId, transaction);
      avg = ratingsWithOffers.reduce((accumulator, currentValue) => accumulator + currentValue.mark, 0) / ratingsWithOffers.length;
      await userQueries.updateUser({ rating: avg }, creatorId, transaction);
    });
    controller.controller.notificationController.emitChangeMark(creatorId);
    res.send({ userId: creatorId, rating: avg });
  } catch (e) {
    next(e);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const {file, body, tokenData: {id}} = req;
    if (file) {
      body.avatar = file.filename;
    }
    const updatedUser = await userQueries.updateUser(body, id);
    res.send(prepareUserToSending(updatedUser));
  } catch (err) {
    next(err);
  }
};

module.exports.resetUserPassword = async (req, res, next) => {
  try {
    const {tokenData: {id, newPassword}} = req;
    const updatedUser = await userQueries.updateUser({password: newPassword}, id);
    if (updatedUser) {
      req.updatedUser = updatedUser;
      return next();
    }
    new ServerError('Something wrong with updating user password')
  } catch (e) {
    next(e);
  }
};
 
module.exports.verifyUserPassword = async (req, res, next) => {
  try {
    const {body, user: {password}} = req;
    await userQueries.passwordCompare(body.password, password);
    next();
  } catch (e) {
    next(e);
  }
};

module.exports.compareUserPasswords = async (req, res, next) => {
  try {
    const {body: {newPassword}, user: {password}} = req;
    await userQueries.passwordCompareForResetting(newPassword, password);
    next();
  } catch (e) {
    next(e);
  }
};

module.exports.findUserByEmailOrId = async (req, res, next) => {
  try {
    const {body: {email}, updatedContest, updatedOffer} = req;
    req.user = await userQueries.findUser({
      ...(email && {email}),
      ...(updatedContest && {id: updatedContest.userId}),
      ...(updatedOffer && {id: updatedOffer.userId}),
    });
    next()
  } catch (e) {
    next(e);
  }
};

const jwt = require('jsonwebtoken');
const constants = require('../constants/constants');
const bd = require('../models');
const NotUniqueEmail = require('../errors/NotUniqueEmail');
const controller = require('../index.js');
const userQueries = require('./queries/userQueries');
const ratingQueries = require('./queries/ratingQueries');
const {prepareUserToSending} = require('../utils/functions');

module.exports.createUser = async (req, res, next) => {
  try {
    const {body, hashPass} = req;
    req.user = await userQueries.userCreation({...body, password: hashPass});
    next();
  } catch (e) {
    next(e);
  }
};

module.exports.checkIfUserExist = async (req, res, next) => {
  try {
    const {body: {email}} = req;
    const result = await userQueries.findUserToCheckExistence({email});
    if (result) {
      return next(new NotUniqueEmail())
    }
    return next();
  } catch (e) {
    next(e);
  }
};

function getQuery (offerId, userId, mark, isFirst, transaction) {
  const getCreateQuery = () => ratingQueries.createRating({
    offerId,
    mark,
    userId,
  }, transaction);
  const getUpdateQuery = () => ratingQueries.updateRating({ mark },
    { offerId, userId }, transaction);
  return isFirst ? getCreateQuery : getUpdateQuery;
}

module.exports.changeMark = async (req, res, next) => {
  let sum = 0;
  let avg = 0;
  let transaction;
  const { isFirst, offerId, mark, creatorId } = req.body;
  const userId = req.tokenData.id;
  try {
    transaction = await bd.sequelize.transaction(
      { isolationLevel: bd.Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED });
    const query = getQuery(offerId, userId, mark, isFirst, transaction);
    await query();
    const offersArray = await bd.Ratings.findAll({
      include: [
        {
          model: bd.Offers,
          required: true,
          where: { userId: creatorId },
        },
      ],
      transaction,
    });
    for (let i = 0; i < offersArray.length; i++) {
      sum += offersArray[ i ].dataValues.mark;
    }
    avg = sum / offersArray.length;

    await userQueries.updateUser({ rating: avg }, creatorId, transaction);
    transaction.commit();
    controller.controller.notificationController.emitChangeMark(creatorId);
    res.send({ userId: creatorId, rating: avg });
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.avatar = req.file.filename;
    }
    const updatedUser = await userQueries.updateUser(req.body,
      req.tokenData.id);
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
    return next(new ServerError('Something wrong with updating user password'))
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
    req.user = await userQueries.findUser({
      ...(req.body.email && {email: req.body.email}),
      ...(req.updatedContest && {id: req.updatedContest.userId}),
      ...(req.updatedOffer && {id: req.updatedOffer.userId}),
    });
    next()
  } catch (e) {
    next(e);
  }
};
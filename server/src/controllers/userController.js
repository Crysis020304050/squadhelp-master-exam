const jwt = require('jsonwebtoken');
const CONSTANTS = require('../constants/constants');
const bd = require('../models');
const NotUniqueEmail = require('../errors/NotUniqueEmail');
const controller = require('../index.js');
const userQueries = require('./queries/userQueries');
const ratingQueries = require('./queries/ratingQueries');
const {prepareUserToSending} = require('../utils/functions');

module.exports.login = async (req, res, next) => {
  try {
    const foundUser = await userQueries.findUser({ email: req.body.email });
    await userQueries.passwordCompare(req.body.password, foundUser.password);
    const accessToken = jwt.sign(prepareUserToSending(foundUser), CONSTANTS.JWT_SECRET, { expiresIn: CONSTANTS.ACCESS_TOKEN_TIME });
    await userQueries.updateUser({ accessToken }, foundUser.id);
    res.send({ token: accessToken, user: prepareUserToSending(foundUser)});
  } catch (err) {
    next(err);
  }
};
module.exports.registration = async (req, res, next) => {
  try {
    const newUser = await userQueries.userCreation(
      Object.assign(req.body, { password: req.hashPass }));
    const accessToken = jwt.sign(prepareUserToSending(newUser), CONSTANTS.JWT_SECRET, { expiresIn: CONSTANTS.ACCESS_TOKEN_TIME });
    await userQueries.updateUser({ accessToken }, newUser.id);
    res.send({ token: accessToken, user: prepareUserToSending(newUser)});
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      next(new NotUniqueEmail());
    } else {
      next(err);
    }
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
  const userId = req.tokenData.userId;
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
      req.tokenData.userId);
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
    });
    next()
  } catch (e) {
    next(e);
  }
};
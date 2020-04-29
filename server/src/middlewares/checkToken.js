const jwt = require('jsonwebtoken');
const CONSTANTS = require('../constants/constants');
const TokenError = require('../errors/TokenError');
import userQueries from '../controllers/queries/userQueries';

module.exports.checkAuth = async (req, res, next) => {
  const accessToken = req.headers.authorization;
  if ( !accessToken) {
    return next(new TokenError('need token'));
  }
  try {
    const tokenData = jwt.verify(accessToken, CONSTANTS.JWT_SECRET);
    const foundUser = await userQueries.findUser({ id: tokenData.userId });
    res.send({
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      role: foundUser.role,
      id: foundUser.id,
      avatar: foundUser.avatar,
      displayName: foundUser.displayName,
      balance: foundUser.balance,
      email: foundUser.email,
    });
  } catch (err) {
    next(new TokenError());
  }
};

module.exports.checkToken = async (req, res, next) => {
  const accessToken = req.headers.authorization || req.body.token;
  if ( !accessToken) {
    return next(new TokenError('Need token'));
  }
  try {
    const tokenData = jwt.verify(accessToken, CONSTANTS.JWT_SECRET);
    if (tokenData) {
      req.tokenData = tokenData;
      return next()
    }
    return next(new TokenError('Token is invalid or expired'));
  } catch (e) {
    next(e);
  }
};
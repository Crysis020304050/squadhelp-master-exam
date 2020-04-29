const jwt = require('jsonwebtoken');
const TokenError = require('../errors/TokenError');
const CONSTANTS = require("../constants/constants");

module.exports.generateTokenWithNewPassword = async (req, res, next) => {
  try {
      const accessToken = jwt.sign({
          email: req.user.email,
          newPassword: req.hashPass,
      }, CONSTANTS.JWT_SECRET, { expiresIn: CONSTANTS.ACCESS_TOKEN_TIME });
      if (accessToken) {
          req.accessToken = accessToken;
          return next()
      }
      next(new TokenError("Something wrong with creating new user token"))
  } catch (e) {
      next(e);
  }
};
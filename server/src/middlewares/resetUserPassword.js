const userQueries = require('../controllers/queries/userQueries');
const ServerError = require('../errors/ServerError');

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
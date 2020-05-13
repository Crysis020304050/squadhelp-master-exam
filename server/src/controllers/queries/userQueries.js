const bd = require('../../models');
const NotFound = require('../../errors/UserNotFoundError');
const BadRequestError = require('../../errors/BadRequestError');
const ServerError = require('../../errors/ServerError');
const bcrypt = require('bcrypt');

module.exports.updateUser = async (data, userId, transaction) => {
  const [updatedCount, [updatedUser]] = await bd.Users.update(data,
    { where: { id: userId }, returning: true, transaction });
  if (updatedCount !== 1) {
    throw new ServerError('Cannot update user');
  }
  return updatedUser.dataValues;
};

module.exports.findUser = async (predicate, transaction) => {
  const result = await bd.Users.findOne({ where: predicate, transaction });
  if ( !result) {
    throw new NotFound('User with this data does not exist');
  } else {
    return result.get({ plain: true });
  }
};

module.exports.findUserToCheckExistence = async (predicate) => {
  return await bd.Users.findOne({where: predicate});
};

module.exports.userCreation = async (data) => {
  const newUser = await bd.Users.create(data);
  if ( !newUser) {
    throw new ServerError('server error on user creation');
  } else {
    return newUser.get({ plain: true });
  }
};

module.exports.passwordCompare = async (pass1, pass2) => {
  const passwordCompare = await bcrypt.compare(pass1, pass2);
  if ( !passwordCompare) {
    throw new NotFound('Wrong password');
  }
};

module.exports.passwordCompareForResetting = async (pass1, pass2) => {
  const passwordCompare = await bcrypt.compare(pass1, pass2);
  if (passwordCompare) {
    throw new BadRequestError('New password cannot be equal with old');
  }
};
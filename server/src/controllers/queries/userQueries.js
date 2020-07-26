const bd = require('../../models');
const NotFound = require('../../errors/NotFoundError');
const BadRequestError = require('../../errors/BadRequestError');
const ServerError = require('../../errors/ServerError');
const ForbiddenError = require('../../errors/ForbiddenError');
const bcrypt = require('bcrypt');

module.exports.updateUser = async (data, userId, transaction) => {
  const [updatedRowsCount, [updatedUser]] = await bd.Users.update(data,
    { where: { id: userId }, returning: true, transaction, raw: true });
  if (updatedRowsCount) {
    return updatedUser;
  }
  throw new ServerError('Cannot update user');
};

module.exports.findUser = async (predicate, transaction) => {
  const result = await bd.Users.findOne({ where: predicate, transaction });
  if (result) {
    return result.get({ plain: true });
  }
  throw new NotFound('User with this data does not exist');
};

module.exports.userCreation = async (data) => {
  const newUser = await bd.Users.create(data);
  if (newUser) {
    return newUser.get({ plain: true });
  }
  throw new ServerError('Server error on user creation');
};

module.exports.passwordCompare = async (pass1, pass2) => {
  const passwordCompare = await bcrypt.compare(pass1, pass2);
  if ( !passwordCompare) {
    throw new ForbiddenError('Wrong password');
  }
};

module.exports.passwordCompareForResetting = async (pass1, pass2) => {
  const passwordCompare = await bcrypt.compare(pass1, pass2);
  if (passwordCompare) {
    throw new BadRequestError('New password cannot be equal with old');
  }
};
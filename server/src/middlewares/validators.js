const schems = require('../validationSchemes/schems');
const BadRequestError = require('../errors/BadRequestError');

module.exports.validateRegistrationData = async (req, res, next) => {
  const validationResult = await schems.registrationSchem.isValid(req.body);
  if ( !validationResult) {
    return next(new BadRequestError('Invalid data for registration'));
  } else {
    next();
  }
};

module.exports.validateLogin = async (req, res, next) => {
  const validationResult = await schems.loginSchem.isValid(req.body);
  if (validationResult) {
    next();
  } else {
    return next(new BadRequestError('Invalid data for login'));
  }
};

module.exports.validateResetPassword = async (req, res, next) => {
  const validationResult = await schems.resetPasswordSchema.isValid(req.body);
  if (validationResult) {
    next();
  } else {
    return next(new BadRequestError('Invalid data for password resetting'));
  }
};

module.exports.validateGetOffersFilesData = async (req, res, next) => {
  const validationResult = await schems.getOffersFilesDataSchem.isValid(req.body);
  if (validationResult) {
    return next();
  }
  return next(new BadRequestError('Invalid from date value'));
};

module.exports.validateContestCreation = (req, res, next) => {
  const promiseArray = [];
  req.body.contests.forEach(el => {
    promiseArray.push(schems.contestSchem.isValid(el));
  });
  return Promise.all(promiseArray)
    .then(results => {
      results.forEach(result => {
        if ( !result) {
          return next(new BadRequestError());
        }
      });
      next();
    })
    .catch(err => {
      next(err);
    });
};

module.exports.validateAddingMessageToConversation = async (req, res, next) => {
  const validationResult = await schems.sendMessageSchema.isValid(req.body);
  if (validationResult) {
    return next();
  }
  return next(new BadRequestError('Invalid message value'));
};

module.exports.validateSettingCatalogName = async (req, res, next) => {
  const validationResult = await schems.settingCatalogNameSchema.isValid(req.body);
  if (validationResult) {
    return next();
  }
  return next(new BadRequestError('Invalid catalog name value'));
};

module.exports.validateEventCreating = async (req, res, next) => {
  const validationResult = await schems.eventSchema.isValid(req.body);
  if (validationResult) {
    return next();
  }
  return next(new BadRequestError('Invalid data for event creating'));
};
const ApplicationError = require('./ApplicationError');

class BadRequestError extends ApplicationError {
  constructor (message) {
    super(message || 'Bad request', 400);
  }
}

module.exports = BadRequestError;
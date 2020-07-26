const ApplicationError = require('./ApplicationError');

class ForbiddenError extends ApplicationError {
  constructor (message) {
    super(message || 'Access is forbidden', 403);
  }
}

module.exports = ForbiddenError;


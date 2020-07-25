const ApplicationError = require('./ApplicationError');

class NotFoundError extends ApplicationError {
  constructor (message) {
    super(message || 'Record with this data does not exist', 404);
  }
}

module.exports = NotFoundError;
const ApplicationError = require('./ApplicationError');

class NotUniqueEmail extends ApplicationError{
  constructor (message) {
    super(message || 'This email is already in use', 409);
  }
}

module.exports = NotUniqueEmail;
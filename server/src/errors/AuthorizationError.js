const ApplicationError = require('./ApplicationError');

export class AuthorizationError extends ApplicationError {
    constructor (message) {
        super( message || 'The request requires user authentication.', 401 );
    }
}

module.exports = AuthorizationError;
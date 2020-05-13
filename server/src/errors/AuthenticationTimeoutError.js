const ApplicationError = require('./ApplicationError');

export class AuthenticationTimeoutError extends ApplicationError {
    constructor (message) {
        super( message || 'Access token is invalid or expired', 419 );
    }
}

module.exports = AuthenticationTimeoutError;
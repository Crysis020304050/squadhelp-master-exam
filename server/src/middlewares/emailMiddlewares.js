const smtpTransport = require('../index.js');
const ServerError = require('../errors/ServerError.js');

module.exports.sendEmailWithResettingPasswordLink = async (req, res, next) => {
    try {
        const {accessToken, user: {firstName, lastName, email}} = req;
        const data = {
            to: email,
            template: 'resetPasswordRequest',
            subject: 'Password help has arrived!',
            context: {
                url: `http://localhost:3000/confirmPasswordResetting/${accessToken}`,
                name: `${firstName} ${lastName}`
            }
        };
        const result = await smtpTransport.smtpTransport.sendMail(data);
        if (result) {
            return res.send('Link for password resetting sent to your email');
        }
        return next(new ServerError('Something wrong with sending message to your email'))
    } catch (e) {
        e.code = 500;
        next(e);
    }
};

module.exports.notifyUserAboutSuccessfulPasswordResetting = async (req, res, next) => {
    try {
        const {updatedUser: {firstName, lastName, email}} = req;
        const data = {
            to: email,
            template: 'successfulPasswordResetting',
            subject: 'Your password has been successful reset!',
            context: {
                name: `${firstName} ${lastName}`
            }
        };
        const result = await smtpTransport.smtpTransport.sendMail(data);
        if (result) {
            return res.send('Your password has been successful reset, you can now login with your new password');
        }
        return next(new ServerError('Your password has been successful reset, but something wrong with sending message to your email'))
    } catch (e) {
        e.code = 500;
        next(e);
    }
};

module.exports.notifyUserAboutResolvingContest = async (req, res, next) => {
    try {
        const {user: {firstName, lastName, email}, updatedContest: {title, id}} = req;
        const data = {
            to: email,
            template: 'resolvingUserContest',
            subject: 'You contest is resolved',
            context: {
                name: `${firstName} ${lastName}`,
                title,
            }
        };
        const result = await smtpTransport.smtpTransport.sendMail(data);
        if (result) {
            return res.send({id});
        }
        return next(new ServerError('Contest has been successful resolve, but something wrong with sending message to user email'))
    } catch (e) {
        e.code = 500;
        next(e);
    }
};

module.exports.notifyUserAboutRejectingContest = async (req, res, next) => {
    try {
        const {user: {firstName, lastName, email}, updatedContest: {title, id}} = req;
        const data = {
            to: email,
            template: 'rejectingUserContest',
            subject: 'You contest is rejected',
            context: {
                name: `${firstName} ${lastName}`,
                title,
            }
        };
        const result = await smtpTransport.smtpTransport.sendMail(data);
        if (result) {
            return res.send({id});
        }
        return next(new ServerError('Contest has been successful reject, but something wrong with sending message to user email'))
    } catch (e) {
        e.code = 500;
        next(e);
    }
};

//

module.exports.notifyUserAboutResolvingOffer = async (req, res, next) => {
    try {
        const {user: {firstName, lastName, email}, updatedOffer: {id}} = req;
        const data = {
            to: email,
            template: 'resolvingUserOffer',
            subject: 'You offer is resolved',
            context: {
                name: `${firstName} ${lastName}`,
            }
        };
        const result = await smtpTransport.smtpTransport.sendMail(data);
        if (result) {
            return res.send({id});
        }
        return next(new ServerError('Offer has been successful resolve, but something wrong with sending message to user email'))
    } catch (e) {
        e.code = 500;
        next(e);
    }
};

module.exports.notifyUserAboutRejectingOffer = async (req, res, next) => {
    try {
        const {user: {firstName, lastName, email}, updatedOffer: {id}} = req;
        const data = {
            to: email,
            template: 'rejectingUserOffer',
            subject: 'You offer is rejected',
            context: {
                name: `${firstName} ${lastName}`,
            }
        };
        const result = await smtpTransport.smtpTransport.sendMail(data);
        if (result) {
            return res.send({id});
        }
        return next(new ServerError('Offer has been successful reject, but something wrong with sending message to user email'))
    } catch (e) {
        e.code = 500;
        next(e);
    }
};

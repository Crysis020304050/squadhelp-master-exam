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
                url: `http://localhost:3000/http://localhost:3000/confirmPasswordResetting/${accessToken}`,
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
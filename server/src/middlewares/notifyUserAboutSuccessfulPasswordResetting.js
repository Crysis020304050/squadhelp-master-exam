const smtpTransport = require('../index.js');
const ServerError = require('../errors/ServerError.js');

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
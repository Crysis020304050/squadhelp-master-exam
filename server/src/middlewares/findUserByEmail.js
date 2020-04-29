const userQueries = require('../controllers/queries/userQueries');

module.exports.findUserByEmail = async (req, res, next) => {
    try {
        await userQueries.findUser({ email: req.body.email });
        next()
    } catch (e) {
        next(e);
    }
};
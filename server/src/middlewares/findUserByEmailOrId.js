const userQueries = require('../controllers/queries/userQueries');

module.exports.findUserByEmailOrId = async (req, res, next) => {
    try {
        req.user = await userQueries.findUser({
            ...(req.body.email && {email: req.body.email}),
            ...(req.updatedContest && {id: req.updatedContest.userId}),
        });
        next()
    } catch (e) {
        next(e);
    }
};
const eventQueries = require('./queries/eventQueries');

module.exports.createEvent = async (req, res, next) => {
    try {
        const {tokenData: {id}, body} = req;
        const event = await eventQueries.createEvent({...body, userId: id});
        res.send(event);
    } catch (e) {
        next(e);
    }
};

module.exports.getUserEvents = async (req, res, next) => {
    try {
        const {tokenData: {id}} = req;
        const events = await eventQueries.getEvents({userId: id});
        res.send(events);
    } catch (e) {
        next(e);
    }
};
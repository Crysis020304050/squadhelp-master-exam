const db = require('../../models');
const ServerError = require('../../errors/ServerError');

module.exports.createEvent = async (data) => {
    const event = await db.Event.create(data);
    if (event) {
        return event.get({plain: true});
    }
    throw new ServerError('Cannot create event');
};

module.exports.getEvents = async (predicate) => await db.Event.findAll({where: predicate});
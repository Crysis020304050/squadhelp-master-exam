const eventsController = require("../controllers/eventsController");
const validators = require("../middlewares/validators");

const eventsRouter = require('express')();

eventsRouter.post(
    '/createEvent',
    validators.validateEventCreating,
    eventsController.createEvent,
);

eventsRouter.get(
    '/getUserEvents',
    eventsController.getUserEvents,
);

module.exports = eventsRouter;
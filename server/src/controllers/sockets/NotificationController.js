const WebSocket = require('./WebSocket');
const constants = require('../../constants/constants');

class NotificationController extends WebSocket{

  emitEntryCreated (target) {
    this.io.to(target).emit(constants.NOTIFICATION_ENTRY_CREATED);
  }

  emitChangeMark (target) {
    this.io.to(target).emit(constants.NOTIFICATION_CHANGE_MARK);
  }

  emitChangeOfferStatus (target, message, contestId) {
    this.io.to(target).emit(constants.NOTIFICATION_CHANGE_OFFER_STATUS,
      { message, contestId });
  }
}

module.exports = NotificationController;
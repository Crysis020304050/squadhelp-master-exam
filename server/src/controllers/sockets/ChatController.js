const WebSocket = require('./WebSocket');
const constants = require('../../constants/constants');

class ChatController extends WebSocket{

  anotherSubscribes (socket) {
    this.onSubscribeChat(socket);
    this.onUnsubscribeChat(socket);
  }

  onSubscribeChat (socket) {
    socket.on('subscribeChat', (id) => {
      socket.join(id);
    });
  }

  onUnsubscribeChat (socket) {
    socket.on('unsubscribeChat', (id) => {
      socket.leave(id);
    });
  }

  emitNewMessage (target, message) {
    this.io.to(parseInt(target)).emit(constants.NEW_MESSAGE,
      { message });
  }

  emitChangeBlockStatus (target, message) {
    this.io.to(parseInt(target)).emit(constants.CHANGE_BLOCK_STATUS,
      { message });
  }
}

module.exports = ChatController;
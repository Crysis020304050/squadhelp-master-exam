const WebSocket = require('./WebSocket');
const constants = require('../../constants/constants');

class ChatController extends WebSocket{

  /**@override*/
  anotherSubscribes (socket) {
    this.onSubscribeChat(socket);
    this.onUnsubscribeChat(socket);
  }

  onSubscribeChat (socket) {
    socket.on(constants.SUBSCRIBE_CHAT, (id) => {
      socket.join(id);
    });
  }

  onUnsubscribeChat (socket) {
    socket.on(constants.UNSUBSCRIBE_CHAT, (id) => {
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
const constants = require('../../constants/constants');

class WebSocket{
  connect (namespace, io) {
    this.io = io.of(namespace);
    this.listen();
  }

  listen () {
    this.io.on(constants.SOCKET_CONNECTION, (socket) => {
      this.onSubscribe(socket);
      this.onUnsubscribe(socket);
      this.anotherSubscribes(socket);
    });
  }

  //this method should be overridden
  anotherSubscribes (socket) {

  }

  onSubscribe (socket) {
    socket.on(constants.SOCKET_SUBSCRIBE, (id) => {
      socket.join(id);
    });
  }

  onUnsubscribe (socket) {
    socket.on(constants.SOCKET_UNSUBSCRIBE, (id) => {
      socket.leave(id);
    });
  }
}

module.exports = WebSocket;

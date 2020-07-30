const socketio = require('socket.io');
const ChatController = require('./ChatController');
const NotificationController = require(
  './NotificationController');

class ConnectionController {
  constructor(httpServer) {
    this.io = socketio.listen(httpServer);
    this._chatController = new ChatController();
    this._notificationController = new NotificationController();
    this._chatController.connect('/chat', this.io);
    this._notificationController.connect('/notifications', this.io);
  }

  get chatController() {
    return this._chatController;
  }

  get notificationController() {
    return this._notificationController;
  }
}

module.exports = ConnectionController;
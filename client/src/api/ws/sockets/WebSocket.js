import constants from '../../../constants/constants';
import socketIoClient from 'socket.io-client';

class WebSocket {
    constructor(dispatch, getState, room) {
        this.dispatch = dispatch;
        this.getState = getState;
        this.socket = socketIoClient(`${constants.BASE_URL}${room}`, {origins: "localhost:*"});
        this.listen();
    }

    listen = () => {
        this.socket.on('connect', () => {
            this.anotherSubscribes();
        });
    };

    anotherSubscribes = () => {

    };
}

export default WebSocket;
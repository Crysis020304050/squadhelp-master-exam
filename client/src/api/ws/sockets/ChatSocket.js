import WebSocket from './WebSocket';
import CONTANTS from "../../../constants/constants";
import {addMessage, changeBlockStatusInStore} from "../../../actions/actionCreator";

class ChatSocket extends WebSocket {
    constructor(dispatch, getState, room) {
        super(dispatch, getState, room);
    }

    anotherSubscribes = () => {
        this.onNewMessage();
        this.onChangeBlockStatus();
    };
    onChangeBlockStatus = () => {
        this.socket.on(CONTANTS.CHANGE_BLOCK_STATUS, (data) => {
            const {message: {conversationId, blackList}} = data;
            this.dispatch(changeBlockStatusInStore({conversationId, blackList}));
        })
    };

    onNewMessage = () => {
        this.socket.on('newMessage', (data) => {
            const {message: {message, chatPreview}} = data;
            this.dispatch(addMessage({message, chatPreview, isSocketMessage: true}));
        })
    };

    subscribeChat = (id) => {
        this.socket.emit('subscribeChat', id);
    };

    unsubscribeChat = (id) => {
        this.socket.emit('unsubscribeChat', id);
    };
}

export default ChatSocket;
import WebSocket from './WebSocket';
import constants from "../../../constants/constants";
import {addMessage, changeBlockStatusInStore} from "../../../actions/actionCreator";

class ChatSocket extends WebSocket {
    constructor(dispatch, getState, room) {
        super(dispatch, getState, room);
    }

    /**@override*/
    anotherSubscribes = () => {
        this.onNewMessage();
        this.onChangeBlockStatus();
    };

    onChangeBlockStatus = () => {
        this.socket.on(constants.CHANGE_BLOCK_STATUS, (data) => {
            const {message: {conversationId, blackList}} = data;
            this.dispatch(changeBlockStatusInStore({conversationId, blackList}));
        })
    };

    onNewMessage = () => {
        this.socket.on(constants.NEW_MESSAGE, (data) => {
            const {message: {message, chatPreview}} = data;
            this.dispatch(addMessage({message, chatPreview, isSocketMessage: true}));
        })
    };

    subscribeChat = (id) => {
        this.socket.emit(constants.SUBSCRIBE_CHAT, id);
    };

    unsubscribeChat = (id) => {
        this.socket.emit(constants.UNSUBSCRIBE_CHAT, id);
    };
}

export default ChatSocket;
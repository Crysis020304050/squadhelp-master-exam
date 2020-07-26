import WebSocket from './WebSocket';
import React from 'react';
import Notification from '../../../components/Notification/Notification';
import {toast} from 'react-toastify';
import {updateUserBalance} from "../../../actions/actionCreator";

class NotificationSocket extends WebSocket {
    constructor(dispatch, getState, room) {
        super(dispatch, getState, room);
    }

    anotherSubscribes = () => {
        this.onEntryCreated();
        this.onChangeMark();
        this.onChangeOfferStatus();
    };

    onChangeMark = () => {
        this.socket.on('changeMark', () => {
            toast('Someone liked your offer');
        })
    };

    onChangeOfferStatus = () => {
        this.socket.on('changeOfferStatus', ({message, contestId, prize}) => {
            toast(<Notification message={message} contestId={contestId}/>);
            if (prize) {
                this.dispatch(updateUserBalance(prize));
            }
        })
    };

    onEntryCreated = () => {
        this.socket.on('onEntryCreated', () => {
            toast('New Entry');
        })
    };

    subscribe = (id) => {
        this.socket.emit('subscribe', id);
    };

    unsubscribe = (id) => {
        this.socket.emit('unsubscribe', id);
    }
}

export default NotificationSocket;
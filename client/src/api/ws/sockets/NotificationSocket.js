import WebSocket from './WebSocket';
import React from 'react';
import Notification from '../../../components/Notification/Notification';
import {toast} from 'react-toastify';
import {updateUserBalance} from "../../../actions/actionCreator";
import constants from '../../../constants/constants';

class NotificationSocket extends WebSocket {
    constructor(dispatch, getState, room) {
        super(dispatch, getState, room);
    }

    /**@override*/
    anotherSubscribes = () => {
        this.onEntryCreated();
        this.onChangeMark();
        this.onChangeOfferStatus();
    };

    onChangeMark = () => {
        this.socket.on(constants.NOTIFICATION_CHANGE_MARK, () => {
            toast('Someone liked your offer');
        })
    };

    onChangeOfferStatus = () => {
        this.socket.on(constants.NOTIFICATION_CHANGE_OFFER_STATUS, ({message, contestId, prize}) => {
            toast(<Notification message={message} contestId={contestId}/>);
            if (prize) {
                this.dispatch(updateUserBalance(prize));
            }
        })
    };

    onEntryCreated = () => {
        this.socket.on(constants.NOTIFICATION_ENTRY_CREATED, () => {
            toast('New Entry');
        })
    };

    subscribe = (id) => {
        this.socket.emit(constants.SOCKET_SUBSCRIBE, id);
    };

    unsubscribe = (id) => {
        this.socket.emit(constants.SOCKET_UNSUBSCRIBE, id);
    }
}

export default NotificationSocket;
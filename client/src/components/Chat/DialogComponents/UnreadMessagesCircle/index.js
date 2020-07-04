import React, {useEffect} from "react";
import PropTypes from 'prop-types';
import { mdiArrowDown } from '@mdi/js';
import Icon from "@mdi/react";
import { useIsVisible } from "react-is-visible"


const UnreadMessagesCircle = ({conversationUnreadMessages, scrollToBottom, className, unreadMessageRef, clearUnreadMessages}) => {

    const isVisible = useIsVisible(unreadMessageRef, { once: true });

    useEffect(() => {
        if (isVisible) {
            clearUnreadMessages();
        }
    }, [unreadMessageRef, isVisible]);

    return (
        <div onClick={() => scrollToBottom()} className={className}>
            {conversationUnreadMessages.length < 100 && <div>{conversationUnreadMessages.length}</div>}
            <Icon color={'white'} path={mdiArrowDown} size={1}/>
        </div>
    )
};

UnreadMessagesCircle.propTypes = {
    conversationUnreadMessages: PropTypes.array.isRequired,
    scrollToBottom: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
    unreadMessageRef: PropTypes.any.isRequired,
    clearUnreadMessages: PropTypes.func.isRequired,
};

export default UnreadMessagesCircle;
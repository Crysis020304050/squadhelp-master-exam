import React, {useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {
    getConversationMessages,
    newUnreadMessage,
    clearUnreadMessages
} from "../../../../actions/actionCreator";
import ChatHeader from '../../ChatComponents/ChatHeader/ChatHeader';
import styles from './Dialog.module.sass';
import ChatInput from '../../ChatComponents/ChatInut/ChatInput';
import UnreadMessagesCircle from "../UnreadMessagesCircle";
import {usePrevious} from "../../../../utils";
import MainDialogView from "../MainDialogView";
import BlockMessage from "../BlockMessage";


const Dialog = ({getConversation, newUnreadMessage, clearUnreadMessages, chatStore, userId}) => {

    const {messages, isMessagesFetching, haveMoreMessages, conversationUnreadMessages, interlocutor: {id}, conversationData} = chatStore;

    const messagesEnd = useRef();
    const messagesContainer = useRef();
    const visibleMessage = useRef();

    const prevProps = usePrevious({
        prevIsMessagesFetching: isMessagesFetching,
        prevMessagesLength: messages.length,
        prevHaveMoreMessages: haveMoreMessages
    });

    const scrollToBottom = () => {
        if (conversationUnreadMessages && conversationUnreadMessages.length) {
            clearUnreadMessages();
        }
        messagesEnd.current.scrollIntoView({behavior: 'smooth'});
    };

    useEffect(() => {
        if (prevProps) {
            const {prevIsMessagesFetching, prevMessagesLength, prevHaveMoreMessages} = prevProps;
            const messagesLength = messages.length;
            if (messagesEnd.current && prevIsMessagesFetching && !isMessagesFetching && !prevMessagesLength && messagesLength) {
                scrollToBottom();
            } else if (messagesEnd.current && messagesContainer.current && messagesLength > prevMessagesLength) {
                const {current: {infinteRef: {current: {scrollTop, offsetHeight, children}}}} = messagesContainer;
                const {current} = messagesEnd;
                if (current.offsetTop - scrollTop - offsetHeight > 0 && current.offsetTop - scrollTop - offsetHeight < 200) {
                    scrollToBottom();
                } else if (messagesLength - prevMessagesLength === 1 && prevHaveMoreMessages === haveMoreMessages && messages[messagesLength - 1].userId === userId) {
                    scrollToBottom();
                } else if (messagesLength - prevMessagesLength === 1 && prevHaveMoreMessages === haveMoreMessages && messages[messagesLength - 1].userId !== userId) {
                    newUnreadMessage(messages[messagesLength - 1].id);
                    if (conversationUnreadMessages.length < 1) {
                        visibleMessage.current = children[children.length - 1];
                    }
                }
            }
        }
    });

    const loadMoreMessages = (startFrom) => {
        if (!isMessagesFetching) {
            getConversation({
                interlocutorId: id,
                conversationId: conversationData && conversationData.id || null,
                limit: 20,
                offset: startFrom
            });
        }
    };

    return (
        <>
            <ChatHeader userId={userId}/>
            <MainDialogView messages={messages} userId={userId} haveMoreMessages={haveMoreMessages}
                            isMessagesFetching={isMessagesFetching} loadMoreMessages={loadMoreMessages}
                            refLinkMessagesContainer={messagesContainer} refLinkMessagesEnd={messagesEnd}/>
            <div ref={messagesEnd}/>
            {(conversationData && conversationData.blackList && conversationData.blackList.includes(true))
                ? <BlockMessage userId={userId} conversationData={conversationData} className={styles.messageBlock}/>
                : <>
                    {(conversationUnreadMessages && !!conversationUnreadMessages.length) &&
                    <UnreadMessagesCircle clearUnreadMessages={clearUnreadMessages} unreadMessageRef={visibleMessage}
                                          conversationUnreadMessages={conversationUnreadMessages}
                                          scrollToBottom={scrollToBottom}
                                          className={styles.unreadMessagesCircle}/>}
                    <ChatInput/>
                </>
            }
        </>
    );
};

const mapStateToProps = (state) => ({chatStore: state.chatStore});

const mapDispatchToProps = (dispatch) => ({
    getConversation: (data) => dispatch(getConversationMessages(data)),
    newUnreadMessage: (id) => dispatch(newUnreadMessage(id)),
    clearUnreadMessages: () => dispatch(clearUnreadMessages()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dialog);
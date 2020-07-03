import React from 'react';
import {connect} from 'react-redux';
import {
    getConversationMessages,
    clearMessageList,
    newUnreadMessage,
    clearUnreadMessages
} from "../../../../actions/actionCreator";
import ChatHeader from '../../ChatComponents/ChatHeader/ChatHeader';
import moment from 'moment';
import className from 'classnames';
import styles from './Dialog.module.sass';
import ChatInput from '../../ChatComponents/ChatInut/ChatInput';
import InfinityScrollListContainer from "../../../InfinityScrollListContainer";
import UnreadMessagesCircle from "../../../UnreadMessagesCircle";

class Dialog extends React.Component {

    constructor(props) {
        super(props);
        this.messagesEnd = React.createRef();
        this.messagesContainer = React.createRef();
        this.visibleMessage = React.createRef();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {messages, isMessagesFetching, userId, haveMoreMessages, newUnreadMessage, conversationUnreadMessages} = this.props;
        if (this.messagesEnd.current && prevProps.isMessagesFetching && !isMessagesFetching && !prevProps.messages.length && messages.length) {
            this.scrollToBottom();
        } else if (this.messagesEnd.current && this.messagesContainer.current && messages.length > prevProps.messages.length) {
            const {current: {infinteRef: {current: {scrollTop, offsetHeight, children}}}} = this.messagesContainer;
            const {current} = this.messagesEnd;
            if (current.offsetTop - scrollTop - offsetHeight > 0 && current.offsetTop - scrollTop - offsetHeight < 200) {
                this.scrollToBottom();
            } else if (messages.length - prevProps.messages.length === 1 && (prevProps.haveMoreMessages === haveMoreMessages) && messages[messages.length - 1].userId === userId) {
                this.scrollToBottom();
            } else if (messages.length - prevProps.messages.length === 1 && (prevProps.haveMoreMessages === haveMoreMessages) && messages[messages.length - 1].userId !== userId) {
                newUnreadMessage(messages[messages.length - 1].id);
                if (conversationUnreadMessages.length < 1) {
                    this.visibleMessage.current = children[children.length - 1];
                }
            }
        }
    }

    scrollToBottom = () => {
        const {conversationUnreadMessages, clearUnreadMessages} = this.props;
        if (conversationUnreadMessages && conversationUnreadMessages.length) {
            clearUnreadMessages();
        }
        this.messagesEnd.current.scrollIntoView({behavior: 'smooth'});
    };

    componentWillUnmount() {
        const {clearMessageList, clearUnreadMessages} = this.props;
        clearMessageList();
        clearUnreadMessages();
    }

    loadMoreMessages = (startFrom) => {
        const {interlocutor: {id}, conversationData, getConversation, isMessagesFetching} = this.props;
        if (!isMessagesFetching) {
            getConversation({
                interlocutorId: id,
                conversationId: conversationData && conversationData.id || null,
                limit: 20,
                offset: startFrom
            });
        }
    };

    renderMainDialog = () => {
        const messagesArray = [];
        const {messages, userId, isMessagesFetching, haveMoreMessages} = this.props;
        let currentTime = moment();
        messages.forEach((message) => {
            if (!currentTime.isSame(message.createdAt, 'date')) {
                messagesArray.push(
                    <div key={message.createdAt} className={styles.date}>
                        {moment(message.createdAt).format('MMMM DD, YYYY')}
                    </div>
                );
                currentTime = moment(message.createdAt);
            }
            messagesArray.push(
                <div key={message.id}
                     className={className(userId === message.userId ? styles.ownMessage : styles.message)}>
                    <span>{message.body}</span>
                    <span className={styles.messageTime}>{moment(message.createdAt).format('HH:mm')}</span>
                    <div ref={this.messagesEnd}/>
                </div>
            )
        });
        return (
            <InfinityScrollListContainer refLink={this.messagesContainer} className={styles.messageList}
                                         haveMore={haveMoreMessages}
                                         isFetching={isMessagesFetching} loadMore={this.loadMoreMessages}
                                         isReverse={true}>
                {messagesArray}
            </InfinityScrollListContainer>
        )
    };

    blockMessage = () => {
        const {userId, conversationData} = this.props;
        const {blackList, participants} = conversationData;
        const userIndex = participants.indexOf(userId);
        let message;
        if (conversationData && blackList[userIndex]) {
            message = 'You block him';
        } else if (conversationData && conversationData.blackList && blackList.includes(true)) {
            message = 'He block you';
        }
        return (
            <span className={styles.messageBlock}>{message}</span>
        )
    };

    render() {
        const {userId, conversationData, conversationUnreadMessages, clearUnreadMessages} = this.props;
        return (
            <>
                <ChatHeader userId={userId}/>
                {this.renderMainDialog()}
                <div ref={this.messagesEnd}/>
                {(conversationData && conversationData.blackList && conversationData.blackList.includes(true)) ? this.blockMessage() :
                    <>
                        {(conversationUnreadMessages && !!conversationUnreadMessages.length) &&
                        <UnreadMessagesCircle clearUnreadMessages={clearUnreadMessages} unreadMessageRef={this.visibleMessage} conversationUnreadMessages={conversationUnreadMessages}
                                              scrollToBottom={this.scrollToBottom}
                                              className={styles.unreadMessagesCircle}/>}
                        <ChatInput/>
                    </>
                }
            </>
        )
    }
}

const mapStateToProps = (state) => state.chatStore;

const mapDispatchToProps = (dispatch) => ({
    getConversation: (data) => dispatch(getConversationMessages(data)),
    clearMessageList: () => dispatch(clearMessageList()),
    newUnreadMessage: (id) => dispatch(newUnreadMessage(id)),
    clearUnreadMessages: () => dispatch(clearUnreadMessages()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dialog);
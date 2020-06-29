import React from 'react';
import {connect} from 'react-redux';
import {getConversationMessages, clearMessageList} from "../../../../actions/actionCreator";
import ChatHeader from '../../ChatComponents/ChatHeader/ChatHeader';
import moment from 'moment';
import className from 'classnames';
import styles from './Dialog.module.sass';
import ChatInput from '../../ChatComponents/ChatInut/ChatInput';

class Dialog extends React.Component {

    constructor(props) {
        super(props);
        this.messagesEnd = React.createRef();
    }

    componentDidMount() {
        const {interlocutor: {id}, conversationData, getConversation} = this.props;
        getConversation({interlocutorId: id, conversationId: conversationData && conversationData.id || null});
        this.scrollToBottom();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.messagesEnd.current)
            this.scrollToBottom();
    }

    scrollToBottom = () => {
        this.messagesEnd.current.scrollIntoView({behavior: 'smooth'})
    };

    componentWillUnmount() {
        this.props.clearMessageList();
    }

    renderMainDialog = () => {
        const messagesArray = [];
        const {messages, userId} = this.props;
        let currentTime = moment();
        messages.forEach((message, i) => {
            if (!currentTime.isSame(message.createdAt, 'date')) {
                messagesArray.push(
                    <div key={message.createdAt} className={styles.date}>
                        {moment(message.createdAt).format('MMMM DD, YYYY')}
                    </div>
                );
                currentTime = moment(message.createdAt);
            }
            messagesArray.push(
                <div key={i}
                     className={className(userId === message.userId ? styles.ownMessage : styles.message)}>
                    <span>{message.body}</span>
                    <span className={styles.messageTime}>{moment(message.createdAt).format('HH:mm')}</span>
                    <div ref={this.messagesEnd}/>
                </div>
            )
        });
        return (
            <div className={styles.messageList}>
                {messagesArray}
            </div>
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
        const {conversationData, userId} = this.props;
        return (
            <>
                <ChatHeader userId={userId}/>
                {this.renderMainDialog()}
                <div ref={this.messagesEnd}/>
                {(conversationData && conversationData.blackList && conversationData.blackList.includes(true)) ? this.blockMessage() : <ChatInput/>}
            </>
        )
    }
}

const mapStateToProps = (state) => state.chatStore;

const mapDispatchToProps = (dispatch) => ({
    getConversation: (data) => dispatch(getConversationMessages(data)),
    clearMessageList: () => dispatch(clearMessageList())
});

export default connect(mapStateToProps, mapDispatchToProps)(Dialog);
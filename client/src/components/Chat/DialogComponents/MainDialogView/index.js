import React from "react";
import styles from './MainDialogView.module.sass'
import className from 'classnames';
import moment from "moment";
import PropTypes from 'prop-types';
import InfinityScrollListContainer from "../../../InfinityScrollListContainer";

const MainDialogView = ({messages, userId, isMessagesFetching, haveMoreMessages, loadMoreMessages, refLinkMessagesContainer, refLinkMessagesEnd}) => {

    const renderMainDialog = () => {
        const messagesArray = [];
        let currentTime = moment();
        messages.forEach(message => {
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
                    className={className(styles.message, {[styles.ownMessage]: userId === message.userId})}>
                   <span>{message.body}</span>
                   <span className={styles.messageTime}>{moment(message.createdAt).format('HH:mm')}</span>
                   <div ref={refLinkMessagesEnd}/>
               </div>
           );
        });
        return messagesArray;
    };

    return (
        <InfinityScrollListContainer refLink={refLinkMessagesContainer} className={styles.messageList}
                                     haveMore={haveMoreMessages}
                                     isFetching={isMessagesFetching} loadMore={loadMoreMessages}
                                     isReverse={true}>
            {renderMainDialog()}
        </InfinityScrollListContainer>
    );
};

MainDialogView.propTypes = {
    messages: PropTypes.array.isRequired,
    userId: PropTypes.number.isRequired,
    isMessagesFetching: PropTypes.bool.isRequired,
    haveMoreMessages: PropTypes.bool.isRequired,
    loadMoreMessages: PropTypes.func.isRequired,
    refLinkMessagesContainer: PropTypes.any.isRequired,
    refLinkMessagesEnd: PropTypes.any.isRequired,
};

export default MainDialogView;
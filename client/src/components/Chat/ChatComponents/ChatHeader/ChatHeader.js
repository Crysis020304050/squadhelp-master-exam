import React from 'react';
import {connect} from 'react-redux';
import {backToDialogList, changeChatFavorite, changeChatBlock} from "../../../../actions/actionCreator";
import styles from './ChatHeader.module.sass';
import constants from '../../../../constants/constants';
import classNames from 'classnames';

const ChatHeader = ({interlocutor: {id, avatar, firstName}, backToDialogList, chatData, userId, changeChatFavorite, changeChatBlock}) => {

    const changeFavorite = (data, event) => {
        changeChatFavorite(data);
        event.stopPropagation();
    };

    const changeBlackList = (data, event) => {
        changeChatBlock(data);
        event.stopPropagation();
    };

    const isFavorite = (userId) => chatData.favoriteList[chatData.participants.indexOf(userId)];

    const isBlocked = (userId) => chatData.blackList[chatData.participants.indexOf(userId)];

    return (
        <div className={styles.chatHeader}>
            <div className={styles.buttonContainer} onClick={() => backToDialogList()}>
                <img src={`${constants.STATIC_IMAGES_PATH}arrow-left-thick.png`} alt='back'/>
            </div>
            <div className={styles.infoContainer}>
                <div>
                    <img src={avatar === 'anon.png' ? constants.ANONYM_IMAGE_PATH : `${constants.publicURL}${avatar}`} alt='user'/>
                    <span>{firstName}</span>
                </div>
                {chatData &&
                <div>
                    <i onClick={(event) => changeFavorite({
                        conversationId: chatData._id,
                        participantsToFavoriteListPair: [{id: chatData.participants[0], flag: chatData.favoriteList[0]}, {id: chatData.participants[1], flag: chatData.favoriteList[1]}],
                        favoriteFlag: !isFavorite(userId),
                        interlocutorId: id,
                    }, event)}
                       className={classNames({
                           ['far fa-heart']: !isFavorite(userId),
                           ['fas fa-heart']: isFavorite(userId)
                       })}/>
                    <i onClick={(event) => changeBlackList({
                        conversationId: chatData._id,
                        participantsToBlackListPair: [{id: chatData.participants[0], flag: chatData.blackList[0]}, {id: chatData.participants[1], flag: chatData.blackList[1]}],
                        blackListFlag: !isBlocked(userId),
                        interlocutorId: id,
                    }, event)}
                       className={classNames({
                           ['fas fa-user-lock']: !isBlocked(userId),
                           ['fas fa-unlock']: isBlocked(userId)
                       })}/>
                </div>
                }
            </div>
        </div>
    )
};

const mapStateToProps = (state) => {
    const {interlocutor, chatData} = state.chatStore;
    return {interlocutor, chatData};
};

const mapDispatchToProps = (dispatch) => ({
    backToDialogList: () => dispatch(backToDialogList()),
    changeChatFavorite: (data) => dispatch(changeChatFavorite(data)),
    changeChatBlock: (data) => dispatch(changeChatBlock(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatHeader);
import React from 'react';
import {connect} from 'react-redux';
import {backToDialogList, changeChatFavorite, changeChatBlock} from "../../../../actions/actionCreator";
import styles from './ChatHeader.module.sass';
import constants from '../../../../constants/constants';
import classNames from 'classnames';

const ChatHeader = ({interlocutor: {id, avatar, firstName}, backToDialogList, conversationData, userId, changeChatFavorite, changeChatBlock}) => {

    const changeFavorite = (data, event) => {
        changeChatFavorite(data);
        event.stopPropagation();
    };

    const changeBlackList = (data, event) => {
        changeChatBlock(data);
        event.stopPropagation();
    };

    const isFavorite = (userId) => conversationData.favoriteList[conversationData.participants.indexOf(userId)];

    const isBlocked = (userId) => conversationData.blackList[conversationData.participants.indexOf(userId)];

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
                {conversationData &&
                <div>
                    <i onClick={(event) => changeFavorite({
                        conversationId: conversationData.id,
                        participantsToFavoriteListPair: [{id: conversationData.participants[0], flag: conversationData.favoriteList[0]}, {id: conversationData.participants[1], flag: conversationData.favoriteList[1]}],
                        favoriteFlag: !isFavorite(userId),
                        interlocutorId: id,
                    }, event)}
                       className={classNames({
                           ['far fa-heart']: !isFavorite(userId),
                           ['fas fa-heart']: isFavorite(userId)
                       })}/>
                    <i onClick={(event) => changeBlackList({
                        conversationId: conversationData.id,
                        participantsToBlackListPair: [{id: conversationData.participants[0], flag: conversationData.blackList[0]}, {id: conversationData.participants[1], flag: conversationData.blackList[1]}],
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
    const {interlocutor, conversationData} = state.chatStore;
    return {interlocutor, conversationData};
};

const mapDispatchToProps = (dispatch) => ({
    backToDialogList: () => dispatch(backToDialogList()),
    changeChatFavorite: (data) => dispatch(changeChatFavorite(data)),
    changeChatBlock: (data) => dispatch(changeChatBlock(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatHeader);
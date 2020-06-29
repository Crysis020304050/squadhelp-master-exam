import React from 'react';
import styles from "./DialogBox.module.sass";
import constants from "../../../../constants/constants";
import classNames from 'classnames';

const DialogBox = ({chatPreview, userId, getTimeStr, changeFavorite, changeBlackList, catalogOperation, goToExpandedDialog, chatMode, interlocutor}) => {

    const {favoriteList, participants, blackList, id, body, createdAt} = chatPreview;
    const isFavorite = favoriteList[participants.indexOf(userId)];
    const isBlocked = blackList[participants.indexOf(userId)];

    if (interlocutor) {
        return (
            <div className={styles.previewChatBox} onClick={() => goToExpandedDialog({
                interlocutor,
                conversationData: {
                    participants: participants,
                    id,
                    blackList: blackList,
                    favoriteList: favoriteList
                }
            })}>
                <img src={interlocutor.avatar === 'anon.png' ? constants.ANONYM_IMAGE_PATH : `${constants.publicURL}${interlocutor.avatar}`} alt='user'/>
                <div className={styles.infoContainer}>
                    <div className={styles.interlocutorInfo}>
                        <span className={styles.interlocutorName}>{interlocutor.firstName}</span>
                        <span className={styles.interlocutorMessage}>{body}</span>
                    </div>
                    <div className={styles.buttonsContainer}>
                        <span className={styles.time}>{getTimeStr(createdAt)}</span>
                        <i onClick={(event) => changeFavorite({
                            conversationId: id,
                            participantsToFavoriteListPair: [{id: participants[0], flag: favoriteList[0]}, {id: participants[1], flag: favoriteList[1]}],
                            favoriteFlag: !isFavorite,
                            interlocutorId: interlocutor.id,
                        }, event)} className={classNames({['far fa-heart']: !isFavorite, ['fas fa-heart']: isFavorite})}/>
                        <i onClick={(event) => changeBlackList({
                            conversationId: id,
                            participantsToBlackListPair: [{id: participants[0], flag: blackList[0]}, {id: participants[1], flag: blackList[1]}],
                            blackListFlag: !isBlocked,
                            interlocutorId: interlocutor.id,
                        }, event)}
                           className={classNames({['fas fa-user-lock']: !isBlocked, ['fas fa-unlock']: isBlocked})}/>
                        <i onClick={(event) => catalogOperation(event, id)} className={classNames({
                            ['far fa-plus-square']: chatMode !== constants.CATALOG_PREVIEW_CHAT_MODE,
                            ['fas fa-minus-circle']: chatMode === constants.CATALOG_PREVIEW_CHAT_MODE
                        })}/>
                    </div>
                </div>
            </div>
        )
    }
    return null;
};

export default DialogBox;

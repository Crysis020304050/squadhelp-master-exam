import React from 'react';
import {connect} from 'react-redux';
import constants from '../../../../constants/constants';
import {
    goToExpandedDialog,
    changeChatFavorite,
    changeChatBlock,
    changeShowAddChatToCatalogMenu
} from "../../../../actions/actionCreator";
import moment from 'moment';
import DialogBox from '../DialogBox/DialogBox';
import styles from './DialogList.module.sass';


const DialogList = ({changeChatFavorite, changeChatBlock, changeShowAddChatToCatalogMenu, chatMode, userId, preview, goToExpandedDialog, removeChat}) => {

    const changeFavorite = (data, event) => {
        changeChatFavorite(data);
        event.stopPropagation();
    };

    const changeBlackList = (data, event) => {
        changeChatBlock(data);
        event.stopPropagation();
    };

    const changeShowCatalogCreation = (event, conversationId) => {
        changeShowAddChatToCatalogMenu(conversationId);
        event.stopPropagation();
    };

    const onlyFavoriteDialogs = (chatPreview, userId) => chatPreview.favoriteList[chatPreview.participants.indexOf(userId)];

    const onlyBlockDialogs = (chatPreview, userId) => chatPreview.blackList[chatPreview.participants.indexOf(userId)];

    const getTimeStr = (time) => {
        const currentTime = moment();
        if (currentTime.isSame(time, 'day'))
            return moment(time).format('HH:mm');
        else if (currentTime.isSame(time, 'week'))
            return moment(time).format('dddd');
        else if (currentTime.isSame(time, 'year'))
            return moment(time).format('MM DD');
        else
            return moment(time).format('MMMM DD, YYYY');
    };

    const renderPreview = (filterFunc) => {
        const arrayList = [];
        preview.forEach((chatPreview, index) => {
            const dialogNode = <DialogBox
                interlocutor={chatPreview.interlocutor}
                chatPreview={chatPreview} userId={userId} key={index} getTimeStr={getTimeStr}
                changeFavorite={changeFavorite} changeBlackList={changeBlackList} chatMode={chatMode}
                catalogOperation={chatMode === constants.CATALOG_PREVIEW_CHAT_MODE ? removeChat : changeShowCatalogCreation}
                goToExpandedDialog={goToExpandedDialog}/>;
            if (filterFunc && filterFunc(chatPreview, userId)) {
                arrayList.push(dialogNode);
            } else if (!filterFunc) {
                arrayList.push(dialogNode);
            }
        });
        return arrayList.length ? arrayList : <span className={styles.notFound}>Not found</span>;
    };

    const renderChatPreview = () => {
        switch (chatMode) {
            case constants.FAVORITE_PREVIEW_CHAT_MODE: {
                return renderPreview(onlyFavoriteDialogs);
            }
            case constants.BLOCKED_PREVIEW_CHAT_MODE: {
                return renderPreview(onlyBlockDialogs);
            }
            default: {
                return renderPreview();
            }
        }
    };

    return (
        <div className={styles.previewContainer}>
            {renderChatPreview()}
        </div>
    )
};

const mapStateToProps = (state) => state.chatStore;

const mapDispatchToProps = (dispatch) => ({
    goToExpandedDialog: (data) => dispatch(goToExpandedDialog(data)),
    changeChatFavorite: (data) => dispatch(changeChatFavorite(data)),
    changeChatBlock: (data) => dispatch(changeChatBlock(data)),
    changeShowAddChatToCatalogMenu: (data) => dispatch(changeShowAddChatToCatalogMenu(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(DialogList);
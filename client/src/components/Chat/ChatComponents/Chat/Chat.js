import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import DialogListContainer from '../../DialogComponents/DialogListContainer/DialogListContainer';
import styles from './Chat.module.sass';
import Dialog from '../../DialogComponents/Dialog/Dialog';
import classNames from 'classnames';
import {changeChatShow, setPreviewChatMode, changeShowModeCatalog, clearChatError, getPreview} from "../../../../actions/actionCreator";
import {chatController} from '../../../../api/ws/socketController';
import CatalogListContainer from '../../CatalogComponents/CatalogListContainer/CatalogListContainer';
import CatalogCreation from '../../CatalogComponents/CatalogCreation/CatalogCreation';
import CatalogListHeader from '../../CatalogComponents/CatalogListHeader/CatalogListHeader';
import ChatError from '../../../ChatError/ChatError';
import constants from "../../../../constants/constants";

const Chat = ({userStore: {data: {id, role}}, chatStore: {chatMode, isShowChatsInCatalog, isExpanded, isShow, isShowCatalogCreation, error}, getPreview, setChatPreviewMode, changeShow, clearChatError}) => {

    const {NORMAL_PREVIEW_CHAT_MODE, FAVORITE_PREVIEW_CHAT_MODE, BLOCKED_PREVIEW_CHAT_MODE, CATALOG_PREVIEW_CHAT_MODE, STATIC_IMAGES_PATH, MODERATOR} = constants;

    useEffect(() => {
        chatController.subscribeChat(id);
        getPreview();

        return () =>  chatController.unsubscribeChat(id);
    }, []);

    const renderDialogList = () => (
        <div>
            {isShowChatsInCatalog && <CatalogListHeader/>}
            {!isShowChatsInCatalog && <div className={styles.chatHeader}>
                <img src={`${STATIC_IMAGES_PATH}logo.png`} alt='logo'/>
            </div>}
            {!isShowChatsInCatalog && <div className={styles.buttonsContainer}>
                    <span onClick={() => setChatPreviewMode(NORMAL_PREVIEW_CHAT_MODE)}
                          className={classNames(styles.button, {[styles.activeButton]: chatMode === NORMAL_PREVIEW_CHAT_MODE})}>Normal</span>
                <span onClick={() => setChatPreviewMode(FAVORITE_PREVIEW_CHAT_MODE)}
                      className={classNames(styles.button, {[styles.activeButton]: chatMode === FAVORITE_PREVIEW_CHAT_MODE})}>Favorite</span>
                <span onClick={() => setChatPreviewMode(BLOCKED_PREVIEW_CHAT_MODE)}
                      className={classNames(styles.button, {[styles.activeButton]: chatMode === BLOCKED_PREVIEW_CHAT_MODE})}>Blocked</span>
                <span onClick={() => setChatPreviewMode(CATALOG_PREVIEW_CHAT_MODE)}
                      className={classNames(styles.button, {[styles.activeButton]: chatMode === CATALOG_PREVIEW_CHAT_MODE})}>Catalog</span>
            </div>}
            {chatMode === CATALOG_PREVIEW_CHAT_MODE ? <CatalogListContainer userId={id}/> : <DialogListContainer userId={id}/>}
        </div>
    );

    return (
        role !== MODERATOR && (<div className={classNames(styles.chatContainer, {[styles.showChat]: isShow})}>
            {error && <ChatError error={error} getData={getPreview} clearChatError={clearChatError}/>}
            {isShowCatalogCreation && <CatalogCreation/>}
            {isExpanded ? <Dialog userId={id}/> : renderDialogList()}
            <div className={styles.toggleChat}
                 onClick={() => changeShow()}>{isShow ? 'Hide Chat' : 'Show Chat'}</div>
        </div>)
    )
};

const mapStateToProps = (state) => {
    const {chatStore, userStore} = state;
    return {chatStore, userStore}
};

const mapDispatchToProps = (dispatch) => ({
    changeShow: () => dispatch(changeChatShow()),
    setChatPreviewMode: (mode) => dispatch(setPreviewChatMode(mode)),
    changeShowModeCatalog: () => dispatch(changeShowModeCatalog()),
    clearChatError: ()=>dispatch(clearChatError()),
    getPreview: ()=>dispatch(getPreview())
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
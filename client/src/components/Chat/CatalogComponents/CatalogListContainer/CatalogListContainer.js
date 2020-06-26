import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {getCatalogList, removeChatFromCatalog} from '../../../../actions/actionCreator';
import CatalogList from '../CatalogList/CatalogList';
import DialogList from '../../DialogComponents/DialogList/DialogList';

const CatalogListContainer = ({getCatalogList, removeChatFromCatalog, chatStore: {currentCatalog, catalogList, messagesPreview, isShowChatsInCatalog}, userStore: {id}}) => {

    useEffect(() => {
        if (!catalogList.length) {
            getCatalogList();
        }
    }, []);

    const removeChat = (event, chatId) => {
        removeChatFromCatalog({chatId, catalogId: currentCatalog._id});
        event.stopPropagation();
    };

    const getDialogsPreview = () => {
        const {chats} = currentCatalog;
        const dialogsInCatalog = [];
        for (let i = 0; i < messagesPreview.length; i++) {
            for (let j = 0; j < chats.length; j++) {
                if (chats[j] === messagesPreview[i]._id) {
                    dialogsInCatalog.push(messagesPreview[i]);
                }
            }
        }
        return dialogsInCatalog;
    };

    return (
        <>
            {isShowChatsInCatalog ? <DialogList userId={id} preview={getDialogsPreview()}
                                                removeChat={removeChat}/> :
                <CatalogList catalogList={catalogList}/>}
        </>
    );
};

const mapStateToProps = (state) => {
    const {chatStore, userStore} = state;
    return {chatStore, userStore};
};

const mapDispatchToProps = (dispatch) => ({
    getCatalogList: (data) => dispatch(getCatalogList(data)),
    removeChatFromCatalog: (data) => dispatch(removeChatFromCatalog(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(CatalogListContainer);
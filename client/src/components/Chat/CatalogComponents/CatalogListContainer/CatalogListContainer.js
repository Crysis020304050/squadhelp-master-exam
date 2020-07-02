import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {getCatalogList, removeConversationFromCatalog} from '../../../../actions/actionCreator';
import CatalogList from '../CatalogList/CatalogList';
import DialogList from '../../DialogComponents/DialogList/DialogList';

const CatalogListContainer = ({getCatalogList, removeConversationFromCatalog, currentCatalog, catalogList, messagesPreview, isShowChatsInCatalog, userId, isCatalogsLoaded}) => {

    useEffect(() => {
        if (!isCatalogsLoaded) {
            getCatalogList();
        }
    }, []);

    const removeChat = (event, conversationId) => {
        removeConversationFromCatalog({conversationId, catalogId: currentCatalog.id});
        event.stopPropagation();
    };

    const getConversationsPreview = () => {
        const {conversations} = currentCatalog;
        const dialogsInCatalog = [];
        for (let i = 0; i < messagesPreview.length; i++) {
            for (let j = 0; j < conversations.length; j++) {
                if (conversations[j] === messagesPreview[i].id) {
                    dialogsInCatalog.push(messagesPreview[i]);
                }
            }
        }
        return dialogsInCatalog;
    };

    return (
        <>
            {isShowChatsInCatalog ? <DialogList userId={userId} preview={getConversationsPreview()}
                                                removeChat={removeChat}/> :
                <CatalogList catalogList={catalogList}/>}
        </>
    );
};

const mapStateToProps = (state) => state.chatStore;

const mapDispatchToProps = (dispatch) => ({
    getCatalogList: (data) => dispatch(getCatalogList(data)),
    removeConversationFromCatalog: (data) => dispatch(removeConversationFromCatalog(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(CatalogListContainer);
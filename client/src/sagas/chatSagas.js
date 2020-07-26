import {put, select} from 'redux-saga/effects';
import ACTION from '../actions/actionTypes';
import * as restController from '../api/rest/restController';


export function* previewSaga() {
    try {
        const {data} = yield  restController.getPreview();
        yield  put({type: ACTION.GET_PREVIEW_CHAT, data: data});
    } catch (err) {
        yield  put({type: ACTION.GET_PREVIEW_CHAT_ERROR, error: err.response});
    }
}

export function* getConversation(action) {
    try {
        const {data} = yield  restController.getConversation(action.data);
        yield put({type: ACTION.GET_DIALOG_MESSAGES, data});
    } catch (err) {
        yield put({type: ACTION.GET_DIALOG_MESSAGES_ERROR, error: err.response});
    }
}

export function* sendMessage(action) {
    try {
        const {data} = yield restController.newMessage(action.data);
        yield put({type: ACTION.SEND_MESSAGE, data});
    } catch (err) {
        yield put({type: ACTION.SEND_MESSAGE_ERROR, error: err.response});
    }
}

export function* changeChatFavorite({data}) {
    try {
        yield restController.changeChatFavorite(data);
        const {conversationId, participantsToFavoriteListPair, favoriteFlag, interlocutorId} = data;
        const [firstParticipantData, secondParticipantData] = participantsToFavoriteListPair;
        let favoriteList;
        if (favoriteFlag) {
            if (firstParticipantData.id === interlocutorId) {
                favoriteList = [firstParticipantData.flag, true]
            } else {
                favoriteList = [true, secondParticipantData.flag];
            }
        } else {
            if (firstParticipantData.id === interlocutorId) {
                favoriteList = [firstParticipantData.flag, false]
            } else {
                favoriteList = [false, secondParticipantData.flag];
            }
        }
        const {messagesPreview, conversationData} = yield select(state => state.chatStore);
        const updatedMessagesPreview = [...messagesPreview];
        const updatedConversationData = (conversationData && conversationData.id === conversationId) ? {...conversationData, favoriteList} : null;
        updatedMessagesPreview.forEach(preview => {
            if (preview.id === conversationId) {
                preview.favoriteList = favoriteList;
            }
        });
        yield put({type: ACTION.CHANGE_CHAT_FAVORITE, data: {messagesPreview: updatedMessagesPreview, conversationData: updatedConversationData}});
    } catch (err) {
        yield put({type: ACTION.SET_CHAT_FAVORITE_ERROR, error: err.response});
    }
}

export function* changeChatBlock(action) {
    try {
        const {data} = yield restController.changeChatBlock(action.data);
        yield put({type: ACTION.CHANGE_CHAT_BLOCK, data});
    } catch (err) {
        yield put({type: ACTION.SET_CHAT_BLOCK_ERROR, error: err.response})
    }
}

export function* getCatalogListSaga(action) {
    try {
        const {data} = yield restController.getCatalogList(action.data);
        yield put({type: ACTION.RECEIVE_CATALOG_LIST, data: data});
    } catch (err) {
        yield put({type: ACTION.RECEIVE_CATALOG_LIST_ERROR, error: err.response});
    }
}

export function* addConversationToCatalog({data}) {
    try {
        yield restController.addConversationToCatalog(data);
        const {catalogList} = yield select(state => state.chatStore);
        const updatedCatalogList = [...catalogList];
        updatedCatalogList.forEach(catalog => {
            if (catalog.id === data.catalogId) {
                catalog.conversations = [...catalog.conversations, data.conversationId];
            }
        });
        yield put({type: ACTION.ADD_CHAT_TO_CATALOG, data: {catalogList: updatedCatalogList}});
    } catch (err) {
        yield put({type: ACTION.ADD_CHAT_TO_CATALOG_ERROR, error: err.response});
    }
}

export function* createCatalog(action) {
    try {
        const {data} = yield restController.createCatalog(action.data);
        yield put({type: ACTION.CREATE_CATALOG_SUCCESS, data: data});
    } catch (err) {
        yield  put({type: ACTION.CREATE_CATALOG_ERROR, error: err.response});
    }
}

export function* deleteCatalog(action) {
    try {
        yield restController.deleteCatalog(action.data);
        const {catalogList} = yield select(state => state.chatStore);
        const updatedCatalogList = catalogList.filter(catalog => action.data.catalogId !== catalog.id);
        yield put({type: ACTION.DELETE_CATALOG_SUCCESS, data: {catalogList: updatedCatalogList}});
    } catch (err) {
        yield put({type: ACTION.DELETE_CATALOG_ERROR, error: err.response});
    }
}

export function* removeConversationFromCatalogSaga({data}) {
    try {
        yield restController.removeConversationFromCatalog(data);
        const {catalogList, currentCatalog} = yield select(state => state.chatStore);
        const updatedCurrentCatalog = {...currentCatalog};
        const updatedCatalogList = [...catalogList];
        updatedCatalogList.forEach(catalog => {
            if (catalog.id === data.catalogId) {
                const updatedConversations = catalog.conversations.filter(conversation => conversation !== data.conversationId);
                catalog.conversations = updatedConversations;
                updatedCurrentCatalog.conversations = updatedConversations;
            }
        });
        yield put({type: ACTION.REMOVE_CHAT_FROM_CATALOG_SUCCESS, data: {catalogList: updatedCatalogList, currentCatalog: updatedCurrentCatalog}});
    } catch (err) {
        yield put({type: ACTION.REMOVE_CHAT_FROM_CATALOG_ERROR, error: err.response});
    }
}

export function* changeCatalogName({data}) {
    try {
        yield restController.changeCatalogName(data);
        const {catalogList, currentCatalog} = yield select(state => state.chatStore);
        const updatedCurrentCatalog = {...currentCatalog};
        const updatedCatalogList = [...catalogList];
        updatedCatalogList.forEach(catalog => {
           if (catalog.id === data.catalogId) {
               catalog.name = data.name;
               updatedCurrentCatalog.name = data.name;
           }
        });
        yield put({type: ACTION.CHANGE_CATALOG_NAME_SUCCESS, data: {catalogList: updatedCatalogList, currentCatalog: updatedCurrentCatalog}});
    } catch (err) {
        yield put({type: ACTION.CHANGE_CATALOG_NAME_ERROR, error: err.response});
    }
}
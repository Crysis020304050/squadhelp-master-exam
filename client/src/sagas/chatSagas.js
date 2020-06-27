import {put, select} from 'redux-saga/effects';
import ACTION from '../actions/actionTypes';
import * as restController from '../api/rest/restController';
import remove from 'lodash/remove';
import isEqual from 'lodash/isEqual';


export function* previewSaga() {
    try {
        const {data} = yield  restController.getPreviewChat();
        yield  put({type: ACTION.GET_PREVIEW_CHAT, data: data});
    } catch (err) {
        yield  put({type: ACTION.GET_PREVIEW_CHAT_ERROR, error: err.response});
    }
}


export function* getDialog(action) {
    try {
        const {data} = yield  restController.getDialog(action.data);
        yield put({type: ACTION.GET_DIALOG_MESSAGES, data});
    } catch (err) {
        yield put({type: ACTION.GET_DIALOG_MESSAGES_ERROR, error: err.response});
    }
}

/*export function* sendMessage(action) {
    try {
        const {data} = yield restController.newMessage(action.data);
        const {messagesPreview} = yield select(state => state.chatStore);
        let isNew = true;
        messagesPreview.forEach(preview => {
            if (isEqual(preview.participants, data.message.participants)) {
                preview.text = data.message.body;
                preview.sender = data.message.sender;
                preview.createAt = data.message.createdAt;
                isNew = false;
            }
        });
        if (isNew) {
            messagesPreview.push(data.preview);
        }
        yield put({
            type: ACTION.SEND_MESSAGE,
            data: {
                message: data.message,
                messagesPreview,
                chatData: {
                    _id: data.preview._id,
                    participants: data.preview.participants,
                    favoriteList: data.preview.favoriteList,
                    blackList: data.preview.blackList
                }
            }
        });
    } catch (err) {
        yield put({type: ACTION.SEND_MESSAGE_ERROR, error: err.response});
    }
}*/

export function* sendMessage(action) {
    try {
        const {data} = yield restController.newMessage(action.data);
        yield put({type: ACTION.SEND_MESSAGE, data});
    } catch (err) {
        yield put({type: ACTION.SEND_MESSAGE_ERROR, error: err.response});
    }
}

export function* changeChatFavorite(action) {
    try {
        const {data} = yield restController.changeChatFavorite(action.data);
        yield put({type: ACTION.CHANGE_CHAT_FAVORITE, data});
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

export function* addChatToCatalog(action) {
    try {
        const {data} = yield restController.addChatToCatalog(action.data);
        yield put({type: ACTION.ADD_CHAT_TO_CATALOG, data});
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
        const updatedCatalogList = catalogList.filter(catalog => action.data.catalogId !== catalog._id);
        yield put({type: ACTION.DELETE_CATALOG_SUCCESS, data: {catalogList: updatedCatalogList}});
    } catch (err) {
        yield put({type: ACTION.DELETE_CATALOG_ERROR, error: err.response});
    }
}

export function* removeChatFromCatalogSaga({data}) {
    try {
        yield restController.removeChatFromCatalog(data);
        const {catalogList, currentCatalog} = yield select(state => state.chatStore);
        catalogList.forEach(catalog => {
            if (catalog._id === data.catalogId) {
                const updatedChats = catalog.chats.filter(chat => chat !== data.conversationId);
                catalog.chats = updatedChats;
                currentCatalog.chats = updatedChats;
            }
        });
        yield put({type: ACTION.REMOVE_CHAT_FROM_CATALOG_SUCCESS, data: {catalogList, currentCatalog}});
    } catch (err) {
        yield put({type: ACTION.REMOVE_CHAT_FROM_CATALOG_ERROR, error: err.response});
    }
}


export function* changeCatalogName(action) {
    try {
        const {data} = yield restController.changeCatalogName(action.data);
        const {catalogList} = yield select(state => state.chatStore);
        for (let i = 0; i < catalogList.length; i++) {
            if (catalogList[i]._id === data._id) {
                catalogList[i].catalogName = data.catalogName;
                break;
            }
        }
        yield put({type: ACTION.CHANGE_CATALOG_NAME_SUCCESS, data: {catalogList, currentCatalog: data}});
    } catch (err) {
        yield put({type: ACTION.CHANGE_CATALOG_NAME_ERROR, error: err.response});
    }
}
import ACTION from '../actions/actionTypes';
import constants from '../constants/constants';


const initialState = {
    isFetching: false,
    addConversationId: null,
    isShowCatalogCreation: false,
    currentCatalog: null,
    conversationData: null,
    messages: [],
    error: null,
    isExpanded: false,
    interlocutor: null,
    messagesPreview: [],
    isShow: false,
    chatMode: constants.NORMAL_PREVIEW_CHAT_MODE,
    catalogList: [],
    isRenameCatalog: false,
    isShowChatsInCatalog: false,
    catalogCreationMode: constants.ADD_CHAT_TO_OLD_CATALOG,
    haveMoreMessages: true,
    isCatalogsLoaded: false,
    conversationUnreadMessages: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION.GET_PREVIEW_CHAT_ASYNC:
        case ACTION.GET_DIALOG_MESSAGES_ASYNC:
        case ACTION.SEND_MESSAGE_ACTION:
        case ACTION.SET_CHAT_FAVORITE_FLAG:
        case ACTION.SET_CHAT_BLOCK_FLAG:
        case ACTION.GET_CATALOG_LIST_ASYNC:
        case ACTION.ADD_CHAT_TO_CATALOG_ASYNC:
        case ACTION.CREATE_CATALOG_REQUEST:
        case ACTION.DELETE_CATALOG_REQUEST:
        case ACTION.REMOVE_CHAT_FROM_CATALOG_REQUEST:
        case ACTION.CHANGE_CATALOG_NAME_REQUEST: {
            return {
                ...state,
                isFetching: true,
            }
        }
        case ACTION.GET_PREVIEW_CHAT: {
            return {
                ...state,
                messagesPreview: action.data,
                isFetching: false,
            }
        }
        case ACTION.RECEIVE_CATALOG_LIST_ERROR: {
            return {
                ...state,
                isFetching: false,
                error: action.error
            }
        }
        case ACTION.GET_PREVIEW_CHAT_ERROR: {
            return {
                ...state,
                error: action.error,
                messagesPreview: [],
                isFetching: false,
            }
        }
        case ACTION.SET_CHAT_BLOCK_ERROR: {
            return {
                ...state,
                error: action.error,
                isFetching: false,
            }
        }
        case ACTION.ADD_CHAT_TO_CATALOG_ERROR: {
            return {
                ...state,
                error: action.error,
                isShowCatalogCreation: false,
                isFetching: false,
            }
        }
        case ACTION.SET_CHAT_FAVORITE_ERROR: {
            return {
                ...state,
                error: action.error,
                isFetching: false,
            }
        }
        case ACTION.BACK_TO_DIALOG_LIST: {
            return {
                ...state,
                isExpanded: false,
            }
        }
        case ACTION.GO_TO_EXPANDED_DIALOG: {
            const {data: {interlocutor, conversationData}} = action;
            return {
                ...state,
                interlocutor,
                conversationData,
                isShow: true,
                isExpanded: true,
                messages: [],
                haveMoreMessages: true,
                conversationUnreadMessages: [],
            }
        }
        case ACTION.GET_DIALOG_MESSAGES: {
            const {data: {messages, interlocutor, haveMore}} = action;
            return {
                ...state,
                ...(messages && {messages: [...messages, ...state.messages]}),
                ...(interlocutor && {interlocutor}),
                ...(haveMore !== undefined && {haveMoreMessages: haveMore}),
                isFetching: false,
            }
        }
        case ACTION.GET_DIALOG_MESSAGES_ERROR: {
            return {
                ...state,
                messages: [],
                interlocutor: null,
                error: action.error,
                isFetching: false,
            }
        }
        case ACTION.SEND_MESSAGE: {
            const {data: {message, chatPreview, isSocketMessage}} = action;
            const updatedPreview = [...state.messagesPreview];
            let updatedConversationData;
            if (chatPreview) {
                const prepareChatData = ({body, createdAt, userId, interlocutor, ...rest}) => rest;
                updatedPreview.push(chatPreview);
                updatedConversationData = !state.conversationData && !isSocketMessage && prepareChatData(chatPreview);
            }
            updatedPreview.forEach(preview => {
                if (preview.id === message.conversationId) {
                    preview.userId = message.userId;
                    preview.body = message.body;
                    preview.createdAt = message.createdAt;
                }
            });
            return {
                ...state,
                messagesPreview: updatedPreview,
                ...((!state.messages[0] || state.messages[0].conversationId === message.conversationId) && {messages: [...state.messages, message]}),
                ...(updatedConversationData && {conversationData: updatedConversationData}),
                isFetching: false,
            }
        }
        case ACTION.SEND_MESSAGE_ERROR: {
            return {
                ...state,
                error: action.error,
                isFetching: false,
            }
        }
        case ACTION.NEW_UNREAD_MESSAGE: {
            return {
                ...state,
                conversationUnreadMessages: [...state.conversationUnreadMessages, action.id],
            }
        }
        case ACTION.CLEAR_UNREAD_MESSAGES: {
            return {
                ...state,
                conversationUnreadMessages: [],
            }
        }
        case ACTION.CHANGE_CHAT_SHOW: {
            return {
                ...state,
                isShowCatalogCreation: false,
                isShow: !state.isShow
            }
        }
        case ACTION.SET_CHAT_PREVIEW_MODE: {
            return {
                ...state,
                chatMode: action.mode
            }
        }
        case ACTION.CHANGE_CHAT_FAVORITE: {
            const {data: {messagesPreview, conversationData}} = action;
            return {
                ...state,
                messagesPreview,
                ...(conversationData && {conversationData}),
                isFetching: false,
            }
        }
        case ACTION.CHANGE_CHAT_BLOCK: {
            const {data: {conversationId, blackList}} = action;
            const updatedPreview = [...state.messagesPreview];
            updatedPreview.forEach(preview => {
                if (preview.id === conversationId) {
                    preview.blackList = blackList;
                }
            });
            const updatedConversationData = (state.conversationData && state.conversationData.id === conversationId) ? {...state.conversationData, blackList} : null;
            return {
                ...state,
                messagesPreview: updatedPreview,
                ...(updatedConversationData && {conversationData: updatedConversationData}),
                isFetching: false,
            }
        }
        case ACTION.RECEIVE_CATALOG_LIST: {
            return {
                ...state,
                isFetching: false,
                catalogList: [...action.data],
                isCatalogsLoaded: true,
            }
        }
        case ACTION.CHANGE_SHOW_MODE_CATALOG: {
            return {
                ...state,
                currentCatalog: {...state.currentCatalog, ...action.data},
                isShowChatsInCatalog: !state.isShowChatsInCatalog,
                isRenameCatalog: false
            }
        }
        case ACTION.CHANGE_TYPE_ADDING_CHAT_IN_CATALOG: {
            return {
                ...state,
                catalogCreationMode: action.data
            }
        }
        case ACTION.CHANGE_SHOW_ADD_CHAT_TO_CATALOG: {
            return {
                ...state,
                addConversationId: action.data,
                isShowCatalogCreation: !state.isShowCatalogCreation
            }
        }
        case ACTION.ADD_CHAT_TO_CATALOG: {
            const {data: {catalogList}} = action;
            return {
                ...state,
                isShowCatalogCreation: false,
                catalogList,
                isFetching: false,
            }
        }
        case ACTION.CREATE_CATALOG_ERROR: {
            return {
                ...state,
                isShowCatalogCreation: false,
                error: action.error,
                isFetching: false,
            }
        }
        case ACTION.CREATE_CATALOG_SUCCESS: {
            return {
                ...state,
                catalogList: [...state.catalogList, action.data],
                isShowCatalogCreation: false,
                isFetching: false,
            }
        }
        case ACTION.DELETE_CATALOG_ERROR: {
            return {
                ...state,
                error: action.error,
                isFetching: false,
            }
        }
        case ACTION.DELETE_CATALOG_SUCCESS: {
            const {data: {catalogList}} = action;
            return {
                ...state,
                catalogList,
                isFetching: false,
            }
        }
        case ACTION.REMOVE_CHAT_FROM_CATALOG_ERROR: {
            return {
                ...state,
                error: action.error,
                isFetching: false,
            }
        }
        case ACTION.REMOVE_CHAT_FROM_CATALOG_SUCCESS: {
            const {data: {catalogList, currentCatalog}} = action;
            return {
                ...state,
                catalogList,
                currentCatalog,
                isFetching: false,
            }
        }
        case ACTION.CHANGE_RENAME_CATALOG_MODE: {
            return {
                ...state,
                isRenameCatalog: !state.isRenameCatalog
            }
        }
        case ACTION.CHANGE_CATALOG_NAME_ERROR: {
            return {
                ...state,
                isRenameCatalog: false,
                error: action.error,
                isFetching: false,
            }
        }
        case ACTION.CHANGE_CATALOG_NAME_SUCCESS: {
            const {data: {catalogList, currentCatalog}} = action;
            return {
                ...state,
                catalogList,
                currentCatalog,
                isRenameCatalog: false,
                isFetching: false,
            }
        }
        case ACTION.CLEAR_CHAT_ERROR: {
            return {
                ...state,
                error: null,
                isCatalogsLoaded: false,
            }
        }
        case ACTION.LOGOUT_RESPONSE: {
            return initialState;
        }
        default:
            return state;
    }
}
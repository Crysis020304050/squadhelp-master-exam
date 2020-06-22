import ACTION from '../actions/actionTypes';
import constants from '../constants/constants';


const initialState = {
    isFetching: true,
    addChatId: null,
    isShowCatalogCreation: false,
    currentCatalog: null,
    chatData: null,
    messages: [],
    error: null,
    isExpanded: false,
    interlocutor: {},
    messagesPreview: [],
    isShow: false,
    chatMode: constants.NORMAL_PREVIEW_CHAT_MODE,
    catalogList: [],
    isRenameCatalog: false,
    isShowChatsInCatalog: false,
    catalogCreationMode: constants.ADD_CHAT_TO_OLD_CATALOG
};

const prepareChatData = ({sender, text, createAt, userId, createdAt, interlocutor, ...rest}) => rest;

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION.GET_PREVIEW_CHAT: {
            return {
                ...state,
                messagesPreview: action.data,
                error: null,
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
                messagesPreview: []
            }
        }
        case ACTION.SET_CHAT_BLOCK_ERROR: {
            return {
                ...state,
                error: action.error
            }
        }
        case ACTION.ADD_CHAT_TO_CATALOG_ERROR: {
            return {
                ...state,
                error: action.error,
                isShowCatalogCreation: false
            }
        }
        case ACTION.SET_CHAT_FAVORITE_ERROR: {
            return {
                ...state,
                error: action.error
            }
        }
        case ACTION.BACK_TO_DIALOG_LIST: {
            return {
                ...state,
                isExpanded: false
            }
        }
        case ACTION.GO_TO_EXPANDED_DIALOG: {
            return {
                ...state,
                interlocutor: {...state.interlocutor, ...action.data.interlocutor},
                chatData: action.data.conversationData,
                isShow: true,
                isExpanded: true,
                messages: []
            }
        }
        case ACTION.GET_DIALOG_MESSAGES: {
            const {data: {messages, interlocutor}} = action;
            return {
                ...state,
                ...(messages && {messages}),
                ...(interlocutor && {interlocutor}),
            }
        }
        case ACTION.GET_DIALOG_MESSAGES_ERROR: {
            return {
                ...state,
                messages: [],
                interlocutor: null,
                error: action.error
            }
        }
        case ACTION.SEND_MESSAGE: {
            const {data: {message, chatPreview, isSocketMessage}} = action;
            const updatedPreview = [...state.messagesPreview];
            let updatedChatData;
            if (chatPreview) {
                updatedPreview.push(chatPreview);
                updatedChatData = !state.chatData && !isSocketMessage && prepareChatData(chatPreview);
            }
            updatedPreview.forEach(preview => {
                if (preview._id === message.conversation || preview._id === message.conversationId) {
                    preview.sender = message.sender || message.userId;
                    preview.text = message.body;
                    preview.createAt = message.createdAt;
                }
            });
            return {
                ...state,
                messagesPreview: updatedPreview,
                ...((!state.messages[0] || state.messages[0].conversationId === message.conversationId) && {messages: [...state.messages, message]}),
                ...(updatedChatData && {chatData: updatedChatData}),
            }
        }
        case ACTION.SEND_MESSAGE_ERROR: {
            return {
                ...state,
                error: action.error
            }
        }
        case ACTION.CLEAR_MESSAGE_LIST: {
            return {
                ...state,
                messages: []
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
            return {
                ...state,
                chatData: action.data.changedPreview,
                messagesPreview: action.data.messagesPreview
            }
        }
        case ACTION.CHANGE_CHAT_BLOCK: {
            return {
                ...state,
                chatData: action.data.chatData,
                messagesPreview: action.data.messagesPreview
            }
        }
        case ACTION.RECEIVE_CATALOG_LIST: {
            return {
                ...state,
                isFetching: false,
                catalogList: [...action.data]
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
                addChatId: action.data,
                isShowCatalogCreation: !state.isShowCatalogCreation
            }
        }
        case ACTION.ADD_CHAT_TO_CATALOG: {
            return {
                ...state,
                isShowCatalogCreation: false,
                catalogList: [...action.data]
            }
        }
        case ACTION.CREATE_CATALOG_ERROR: {
            return {
                ...state,
                isShowCatalogCreation: false,
                error: action.error
            }
        }
        case ACTION.CREATE_CATALOG_SUCCESS: {
            return {
                ...state,
                catalogList: [...state.catalogList, action.data],
                isShowCatalogCreation: false
            }
        }
        case ACTION.DELETE_CATALOG_ERROR: {
            return {
                ...state,
                error: action.error
            }
        }
        case ACTION.DELETE_CATALOG_SUCCESS: {
            return {
                ...state,
                catalogList: [...action.data]
            }
        }
        case ACTION.REMOVE_CHAT_FROM_CATALOG_ERROR: {
            return {
                ...state,
                error: action.error
            }
        }
        case ACTION.REMOVE_CHAT_FROM_CATALOG_SUCCESS: {
            return {
                ...state,
                currentCatalog: action.data.currentCatalog,
                catalogList: [...action.data.catalogList]
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
                isRenameCatalog: false
            }
        }
        case ACTION.CHANGE_CATALOG_NAME_SUCCESS: {
            return {
                ...state,
                catalogList: [...action.data.catalogList],
                currentCatalog: action.data.currentCatalog,
                isRenameCatalog: false
            }
        }
        case ACTION.CLEAR_CHAT_ERROR: {
            return {
                ...state,
                error: null
            }
        }
        default:
            return state;
    }
}
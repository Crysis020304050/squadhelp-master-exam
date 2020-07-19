import ACTION from './actionTypes';


export const authActionRequest = data => ({
    type: ACTION.AUTH_ACTION_REQUEST,
    data
});

export const authActionSuccess = () => ({
    type: ACTION.AUTH_ACTION_SUCCESS,
});

export const authActionError = error => ({
    type: ACTION.AUTH_ACTION_ERROR,
    error
});

export const clearErrorSignUpAndLogin = () => ({
    type: ACTION.AUTH_ACTION_CLEAR_ERROR
});

export const logoutRequest = (data) => ({
    type: ACTION.LOGOUT_REQUEST,
    data,
});

export const logoutResponse = () => ({
    type: ACTION.LOGOUT_RESPONSE,
});

export const clearAddOfferError = () => ({
    type: ACTION.CLEAR_ADD_OFFER_ERROR
});

export const clearChangeMarkError = () => ({
    type: ACTION.CLEAR_CHANGE_MARK_ERROR
});

export const clearSetOfferStatusError = () => ({
    type: ACTION.CLEAR_SET_OFFER_STATUS_ERROR
});

export const getUserSuccess = data => ({
    type: ACTION.GET_USER_SUCCESS,
    data,
});

export const updateUserBalance = prize => ({
    type: ACTION.UPDATE_USER_BALANCE,
    prize,
});

export const getDataForContest = data => ({
    type: ACTION.GET_DATA_FOR_CONTEST_ACTION,
    data
});

export const clearDataForContest = () => ({
    type: ACTION.CLEAR_DATA_FOR_SELECTS
});

export const payRequest = data => ({
    type: ACTION.PAYMENT_ACTION,
    data
});

export const getContestsForCreative = data => ({
    type: ACTION.GET_CONTESTS_FOR_CREATIVE,
    data
});

export const getContestsForCustomer = data => ({
    type: ACTION.GET_CONTESTS_FOR_CUSTOMER,
    data
});

export const getContestById = data => ({
    type: ACTION.GET_CONTEST_BY_ID_ACTION,
    data
});

export const selectBundle = bundle => ({
    type: ACTION.SELECT_BUNDLE_ACTION,
    bundle
});

export const clearBundle = () => ({
    type: ACTION.CLEAR_BUNDLE_ACTION
});

export const updateContest = data => ({
    type: ACTION.UPDATE_CONTEST_ACTION,
    data
});

export const saveContestToStore = data => ({
    type: ACTION.SAVE_CONTEST_TO_STORE,
    data
});

export const changeMark = data => ({
    type: ACTION.CHANGE_MARK_ACTION,
    data
});

export const setOffer = data => ({
    type: ACTION.SET_OFFER_ACTION,
    data
});

export const setOfferStatus = data => ({
    type: ACTION.SET_OFFER_STATUS_ACTION,
    data
});

export const createCatalog = data => ({
    type: ACTION.CREATE_CATALOG_REQUEST,
    data
});

export const updateUserData = data => ({
    type: ACTION.UPDATE_USER_DATA,
    data
});

export const cashOut = data => ({
    type: ACTION.CASHOUT_ACTION,
    data
});

export const clearContestList = () => ({
    type: ACTION.CLEAR_CONTESTS_LIST
});

export const clearAuth = () => ({
    type: ACTION.AUTH_ACTION_CLEAR
});

export const getPreview = () => ({
    type: ACTION.GET_PREVIEW_CHAT_ASYNC
});

export const backToDialogList = () => ({
    type: ACTION.BACK_TO_DIALOG_LIST
});

export const goToExpandedDialog = data => ({
    type: ACTION.GO_TO_EXPANDED_DIALOG,
    data
});

export const getConversationMessages = data => ({
    type: ACTION.GET_DIALOG_MESSAGES_ASYNC,
    data
});

export const sendMessageAction = data => ({
    type: ACTION.SEND_MESSAGE_ACTION,
    data
});

export const addMessage = data => ({
    type: ACTION.SEND_MESSAGE,
    data
});

export const newUnreadMessage = (id) => ({
   type: ACTION.NEW_UNREAD_MESSAGE,
   id,
});

export const clearUnreadMessages = () => ({
   type: ACTION.CLEAR_UNREAD_MESSAGES,
});

export const changeChatShow = () => ({
    type: ACTION.CHANGE_CHAT_SHOW
});

export const setNewCustomerFilter = filter => ({
    type: ACTION.SET_NEW_CUSTOMER_FILTER,
    filter
});

export const setNewCreatorFilter = filter => ({
    type: ACTION.SET_NEW_CREATOR_FILTER,
    filter
});

export const setPreviewChatMode = mode => ({
    type: ACTION.SET_CHAT_PREVIEW_MODE,
    mode
});

export const changeChatFavorite = data => ({
    type: ACTION.SET_CHAT_FAVORITE_FLAG,
    data
});

export const changeChatBlock = data => ({
    type: ACTION.SET_CHAT_BLOCK_FLAG,
    data
});

export const changeBlockStatusInStore = data => ({
    type: ACTION.CHANGE_CHAT_BLOCK,
    data
});

export const getCatalogList = data => ({
    type: ACTION.GET_CATALOG_LIST_ASYNC,
    data
});


export const changeShowModeCatalog = data => ({
    type: ACTION.CHANGE_SHOW_MODE_CATALOG,
    data
});

export const changeTypeOfChatAdding = data => ({
    type: ACTION.CHANGE_TYPE_ADDING_CHAT_IN_CATALOG,
    data
});

export const changeShowAddChatToCatalogMenu = data => ({
    type: ACTION.CHANGE_SHOW_ADD_CHAT_TO_CATALOG,
    data
});

export const addConversationToCatalog = data => ({
    type: ACTION.ADD_CHAT_TO_CATALOG_ASYNC,
    data
});

export const deleteCatalog = data => ({
    type: ACTION.DELETE_CATALOG_REQUEST,
    data
});

export const removeConversationFromCatalog = data => ({
    type: ACTION.REMOVE_CHAT_FROM_CATALOG_REQUEST,
    data
});

export const changeRenameCatalogMode = () => ({
    type: ACTION.CHANGE_RENAME_CATALOG_MODE
});

export const changeCatalogName = data => ({
    type: ACTION.CHANGE_CATALOG_NAME_REQUEST,
    data
});

export const changeEditContest = data => ({
    type: ACTION.CHANGE_EDIT_CONTEST,
    data
});

export const changeContestViewMode = data => ({
    type: ACTION.CHANGE_CONTEST_VIEW_MODE,
    data
});

export const changeShowImage = data => ({
    type: ACTION.CHANGE_SHOW_IMAGE,
    data
});

export const changeFocusOnCard = data => ({
    type: ACTION.CHANGE_FOCUS_ON_CARD,
    data
});

export const changeProfileModeView = data => ({
    type: ACTION.CHANGE_PROFILE_MODE_VIEW,
    data
});

export const changeEditModeOnUserProfile = data => ({
    type: ACTION.CHANGE_EDIT_MODE_ON_USER_PROFILE,
    data
});

export const clearPaymentStore = () => ({
    type: ACTION.CLEAR_PAYMENT_STORE
});

export const clearUpdateContestStore = () => ({
    type: ACTION.CLEAR_UPDATE_CONTEST_STORE
});

export const clearUserError = () => ({
    type: ACTION.CLEAR_USER_ERROR
});

export const clearChatError = () => ({
    type: ACTION.CLEAR_CHAT_ERROR
});

export const changeModalShow = data => ({
    type: ACTION.CHANGE_SHOW_MODAL,
    data
});

export const selectContestType = data => ({
    type: ACTION.SELECT_CONTEST_TYPE,
    data,
});

export const unSelectContestType = data => ({
    type: ACTION.UNSELECT_CONTEST_TYPE,
    data,
});

export const getUserTransactionsHistoryRequest = () => ({
    type: ACTION.GET_USER_TRANSACTIONS_HISTORY_REQUEST,
});

export const getUserTransactionsHistorySuccess = data => ({
    type: ACTION.GET_USER_TRANSACTIONS_HISTORY_SUCCESS,
    transactionHistory: data,
});

export const getUserTransactionsHistoryError = data => ({
    type: ACTION.GET_USER_TRANSACTIONS_HISTORY_ERROR,
    error: data,
});

export const getUserTransactionsStatementRequest = () => ({
    type: ACTION.GET_USER_TRANSACTIONS_STATEMENT_REQUEST,
});

export const getUserTransactionsStatementSuccess = data => ({
    type: ACTION.GET_USER_TRANSACTIONS_STATEMENT_SUCCESS,
    transactionStatement: data,
});

export const getUserTransactionsStatementError = data => ({
    type: ACTION.GET_USER_TRANSACTIONS_STATEMENT_ERROR,
    error: data,
});

export const clearTransactionsStoreError = () => ({
    type: ACTION.CLEAR_TRANSACTIONS_STORE_ERROR,
});

export const createNewEventRequest = data => ({
    type: ACTION.CREATE_EVENT_REQUEST,
    data,
});

export const createNewEventSuccess = event => ({
    type: ACTION.CREATE_EVENT_SUCCESS,
    event,
});

export const createNewEventError = error => ({
    type: ACTION.CREATE_EVENT_ERROR,
    error,
});

export const getUserEventsRequest = () => ({
    type: ACTION.GET_USER_EVENTS_REQUEST,
});

export const getUserEventsSuccess = events => ({
    type: ACTION.GET_USER_EVENTS_SUCCESS,
    events,
});

export const getUserEventsError = error => ({
    type: ACTION.GET_USER_EVENTS_ERROR,
    error,
});

export const setStartedEvent = id => ({
    type: ACTION.SET_STARTED_EVENT,
    id,
});

export const clearEventsStoreError = () => ({
   type: ACTION.CLEAR_EVENTS_STORE_ERROR,
});

export const resetPasswordRequest = data => ({
    type: ACTION.RESET_PASSWORD_REQUEST,
    data,
});

export const resetPasswordRequestSuccess = message => ({
    type: ACTION.RESET_PASSWORD_REQUEST_SUCCESS,
    message,
});

export const resetPasswordRequestError = error => ({
    type: ACTION.RESET_PASSWORD_REQUEST_ERROR,
    error,
});

export const clearResetPasswordError = () => ({
    type: ACTION.CLEAR_RESET_PASSWORD_ERROR,
});

export const confirmResettingPasswordRequest = token => ({
    type: ACTION.CONFIRM_RESETTING_PASSWORD_REQUEST,
    token,
});

export const confirmResettingPasswordSuccess = message => ({
    type: ACTION.CONFIRM_RESETTING_PASSWORD_SUCCESS,
    message,
});

export const confirmResettingPasswordError = error => ({
    type: ACTION.CONFIRM_RESETTING_PASSWORD_ERROR,
    error,
});

export const clearConfirmResettingPasswordError = () => ({
    type: ACTION.CLEAR_CONFIRM_RESETTING_PASSWORD_ERROR,
});

export const getContestsForModeratorRequest = filter => ({
    type: ACTION.GET_CONTESTS_FOR_MODERATOR_REQUEST,
    filter,
});

export const getContestsForModeratorSuccess = data => ({
    type: ACTION.GET_CONTESTS_FOR_MODERATOR_SUCCESS,
    data,
});

export const getContestsForModeratorError = error => ({
    type: ACTION.GET_CONTESTS_FOR_MODERATOR_ERROR,
    error,
});

export const moderateContestResolveRequest = id => ({
    type: ACTION.MODERATE_CONTEST_RESOLVE_REQUEST,
    id,
});

export const moderateContestResolveSuccess = id => ({
    type: ACTION.MODERATE_CONTEST_RESOLVE_SUCCESS,
    id,
});

export const moderateContestResolveError = error => ({
    type: ACTION.MODERATE_CONTEST_RESOLVE_ERROR,
    error,
});

export const moderateContestRejectRequest = id => ({
    type: ACTION.MODERATE_CONTEST_REJECT_REQUEST,
    id,
});

export const moderateContestRejectSuccess = id => ({
    type: ACTION.MODERATE_CONTEST_REJECT_SUCCESS,
    id,
});

export const moderateContestRejectError = error => ({
    type: ACTION.MODERATE_CONTEST_REJECT_ERROR,
    error,
});

export const setNewContestsModerationFilter = filter => ({
    type: ACTION.SET_NEW_CONTESTS_MODERATION_FILTER,
    filter,
});

export const getOffersForModeratorRequest = filter => ({
    type: ACTION.GET_OFFERS_FOR_MODERATOR_REQUEST,
    filter,
});

export const getOffersForModeratorSuccess = data => ({
    type: ACTION.GET_OFFERS_FOR_MODERATOR_SUCCESS,
    data,
});

export const getOffersForModeratorError = error => ({
    type: ACTION.GET_OFFERS_FOR_MODERATOR_ERROR,
    error,
});

export const moderateOfferResolveRequest = id => ({
    type: ACTION.MODERATE_OFFER_RESOLVE_REQUEST,
    id,
});

export const moderateOfferResolveSuccess = id => ({
    type: ACTION.MODERATE_OFFER_RESOLVE_SUCCESS,
    id,
});

export const moderateOfferResolveError = error => ({
    type: ACTION.MODERATE_OFFER_RESOLVE_ERROR,
    error,
});

export const moderateOfferRejectRequest = id => ({
    type: ACTION.MODERATE_OFFER_REJECT_REQUEST,
    id,
});

export const moderateOfferRejectSuccess = id => ({
    type: ACTION.MODERATE_OFFER_REJECT_SUCCESS,
    id,
});

export const moderateOfferRejectError = error => ({
    type: ACTION.MODERATE_OFFER_REJECT_ERROR,
    error,
});

export const setNewOffersModerationFilter = filter => ({
    type: ACTION.SET_NEW_OFFERS_MODERATION_FILTER,
    filter,
});

export const clearOffersList = () => ({
   type: ACTION.CLEAR_OFFERS_LIST,
});
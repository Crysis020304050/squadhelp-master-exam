import {takeLatest, takeLeading, takeEvery} from 'redux-saga/effects';
import ACTION from '../actions/actionTypes';
import {authSaga, logoutSaga} from './authSagas';
import {updateUserData} from './userSaga';
import {paymentSaga, cashoutSaga} from './paymentSaga';
import {
    activeContestsSaga,
    customerContestsSaga,
    updateContestSaga,
    dataForContestSaga,
    getContestByIdSaga,
    downloadContestFileSaga
} from './contestsSagas'
import {changeMarkSaga, setOfferStatusSaga, addOfferSaga} from './offerSagas';
import {
    previewSaga,
    getConversation,
    sendMessage,
    changeChatFavorite,
    changeChatBlock,
    getCatalogListSaga,
    addConversationToCatalog,
    createCatalog,
    deleteCatalog,
    removeConversationFromCatalogSaga,
    changeCatalogName
} from './chatSagas';
import {getUserTransactionsHistorySaga, getUserTransactionsStatementSaga} from './transactionsSaga';
import {resetPasswordRequestSaga, confirmPasswordResettingSaga} from './resetPasswordSaga';
import {getContestsForModeratorSaga, rejectContestSaga, resolveContestSaga} from "./moderateContestsSaga";
import {getOffersForModeratorSaga, resolveOfferSaga, rejectOfferSaga} from './moderateOffersSaga';
import {createNewEventSaga, getUserEventsSaga} from './eventsSaga';

function* rootSaga() {
    yield  takeLatest(ACTION.AUTH_ACTION_REQUEST, authSaga);
    yield takeLatest(ACTION.LOGOUT_REQUEST, logoutSaga);
    yield  takeEvery(ACTION.GET_DATA_FOR_CONTEST_ACTION, dataForContestSaga);
    yield  takeLatest(ACTION.PAYMENT_ACTION, paymentSaga);
    yield  takeLatest(ACTION.CASHOUT_ACTION, cashoutSaga);
    yield  takeLeading(ACTION.GET_CONTESTS_FOR_CUSTOMER, customerContestsSaga);
    yield  takeLatest(ACTION.GET_CONTEST_BY_ID_ACTION, getContestByIdSaga);
    yield  takeEvery(ACTION.GET_CONTESTS_FOR_CREATIVE, activeContestsSaga);
    yield  takeLatest(ACTION.DOWNLOAD_CONTEST_FILE_ACTION, downloadContestFileSaga);
    yield  takeLatest(ACTION.UPDATE_CONTEST_ACTION, updateContestSaga);
    yield  takeEvery(ACTION.SET_OFFER_ACTION, addOfferSaga);
    yield  takeLatest(ACTION.SET_OFFER_STATUS_ACTION, setOfferStatusSaga);
    yield  takeLatest(ACTION.CHANGE_MARK_ACTION, changeMarkSaga);
    yield  takeLatest(ACTION.UPDATE_USER_DATA_REQUEST, updateUserData);
    yield  takeLatest(ACTION.GET_PREVIEW_CHAT_ASYNC, previewSaga);
    yield  takeLatest(ACTION.GET_DIALOG_MESSAGES_ASYNC, getConversation);
    yield  takeLatest(ACTION.SEND_MESSAGE_ACTION, sendMessage);
    yield  takeLatest(ACTION.SET_CHAT_FAVORITE_FLAG, changeChatFavorite);
    yield  takeLatest(ACTION.SET_CHAT_BLOCK_FLAG, changeChatBlock);
    yield  takeLatest(ACTION.GET_CATALOG_LIST_ASYNC, getCatalogListSaga);
    yield  takeLatest(ACTION.ADD_CHAT_TO_CATALOG_ASYNC, addConversationToCatalog);
    yield  takeLatest(ACTION.CREATE_CATALOG_REQUEST, createCatalog);
    yield  takeLatest(ACTION.DELETE_CATALOG_REQUEST, deleteCatalog);
    yield  takeLatest(ACTION.REMOVE_CHAT_FROM_CATALOG_REQUEST, removeConversationFromCatalogSaga);
    yield  takeLatest(ACTION.CHANGE_CATALOG_NAME_REQUEST, changeCatalogName);
    yield  takeLatest(ACTION.GET_USER_TRANSACTIONS_HISTORY_REQUEST, getUserTransactionsHistorySaga);
    yield  takeLatest(ACTION.GET_USER_TRANSACTIONS_STATEMENT_REQUEST, getUserTransactionsStatementSaga);
    yield  takeLatest(ACTION.RESET_PASSWORD_REQUEST, resetPasswordRequestSaga);
    yield  takeLatest(ACTION.CONFIRM_RESETTING_PASSWORD_REQUEST, confirmPasswordResettingSaga);
    yield  takeLatest(ACTION.GET_CONTESTS_FOR_MODERATOR_REQUEST, getContestsForModeratorSaga);
    yield  takeLatest(ACTION.SET_NEW_CONTESTS_MODERATION_FILTER, getContestsForModeratorSaga);
    yield  takeLatest(ACTION.MODERATE_CONTEST_RESOLVE_REQUEST, resolveContestSaga);
    yield  takeLatest(ACTION.MODERATE_CONTEST_REJECT_REQUEST, rejectContestSaga);
    yield  takeLatest(ACTION.GET_OFFERS_FOR_MODERATOR_REQUEST, getOffersForModeratorSaga);
    yield  takeLatest(ACTION.SET_NEW_OFFERS_MODERATION_FILTER, getOffersForModeratorSaga);
    yield  takeLatest(ACTION.MODERATE_OFFER_RESOLVE_REQUEST, resolveOfferSaga);
    yield  takeLatest(ACTION.MODERATE_OFFER_REJECT_REQUEST, rejectOfferSaga);
    yield  takeLatest(ACTION.CREATE_EVENT_REQUEST, createNewEventSaga);
    yield  takeLatest(ACTION.GET_USER_EVENTS_REQUEST, getUserEventsSaga);
}

export default rootSaga;
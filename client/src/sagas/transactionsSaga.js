import {put} from 'redux-saga/effects';
import {getUserTransactionsHistory, getUserTransactionsStatement} from '../api/rest/restController';
import {getUserTransactionsHistorySuccess, getUserTransactionsHistoryError, getUserTransactionsStatementSuccess, getUserTransactionsStatementError} from '../actions/actionCreator.js';

export function* getUserTransactionsHistorySaga(action) {
    try {
        const {data} = yield getUserTransactionsHistory();
        yield put(getUserTransactionsHistorySuccess(data));
    } catch (e) {
        yield put(getUserTransactionsHistoryError(e.response || e));
    }
}

export function* getUserTransactionsStatementSaga(action) {
    try {
        const {data} = yield getUserTransactionsStatement();
        yield put(getUserTransactionsStatementSuccess(data));
    } catch (e) {
        yield put(getUserTransactionsStatementError(e.response || e));
    }
}
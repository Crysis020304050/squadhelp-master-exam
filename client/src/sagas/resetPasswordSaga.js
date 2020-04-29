import {put} from 'redux-saga/effects';
import {resetUserPasswordRequest, confirmPasswordResetting} from '../api/rest/restController';
import {resetPasswordRequestSuccess, resetPasswordRequestError, confirmResettingPasswordSuccess, confirmResettingPasswordError} from '../actions/actionCreator.js';
import {toast} from "react-toastify";
import history from '../browserHistory';

export function* resetPasswordRequestSaga(action) {
    try {
        const {data} = yield resetUserPasswordRequest(action.data);
        yield put(resetPasswordRequestSuccess(data));
        toast(data);
    } catch (e) {
        yield put(resetPasswordRequestError(e.response || e));
    }
}

export function* confirmPasswordResettingSaga(action) {
    try {
        const {data} = yield confirmPasswordResetting({token: action.token});
        yield put(confirmResettingPasswordSuccess(data));
        toast(data);
        history.replace('/login');
    } catch (e) {
        yield put(confirmResettingPasswordError(e.response || e))
    }
}
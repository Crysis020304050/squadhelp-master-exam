import {put} from 'redux-saga/effects';
import * as restController from '../api/rest/auth';
import {getUserSuccess, authActionSuccess, authActionError, logoutResponse} from '../actions/actionCreator';
import {controller} from '../api/ws/socketController';
import history from "../browserHistory";
import {clearStorage} from "../utils";

export function* authSaga(action) {
    try {
        const {data} = Object.keys(action.data).length > 1
            ? Object.keys(action.data).length > 2
                ? yield restController.registerRequest(action.data)
                : yield restController.loginRequest(action.data)
            : yield restController.loginUserByRefreshToken(action.data);
        yield put(authActionSuccess());
        yield put(getUserSuccess(data.user));
        controller.subscribe(data.user.id);
    } catch (e) {
        yield put(authActionError(e.response || e));
    }
}

export function* logoutSaga(action) {
    try {
        yield restController.logout(action.data);
    } catch (e) {
        throw e;
    } finally {
        yield put(logoutResponse());
        clearStorage();
        history.replace('/login');
    }
}
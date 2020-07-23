import {put} from 'redux-saga/effects';
import * as restController from '../api/rest/auth';
import {authActionSuccess, authActionError, logoutResponse} from '../actions/actionCreator';
import {controller} from '../api/ws/socketController';
import history from "../browserHistory";
import {clearStorage} from "../utils";

export function* authSaga({data}) {
    try {
        const keysLength = Object.keys(data).length;
        const response = keysLength > 1
            ? keysLength > 2
                ? yield restController.registerRequest(data)
                : yield restController.loginRequest(data)
            : yield restController.loginUserByRefreshToken(data);
        const {data: {user}} = response;
        yield put(authActionSuccess(user));
        controller.subscribe(user.id);
    } catch (e) {
        yield put(authActionError(e.response || e));
    }
}

export function* logoutSaga({data: {refreshToken, id}}) {
    try {
        yield restController.logout({refreshToken});
    } catch (e) {
        throw e;
    } finally {
        yield put(logoutResponse());
        controller.unsubscribe(id);
        clearStorage();
        history.replace('/login');
    }
}
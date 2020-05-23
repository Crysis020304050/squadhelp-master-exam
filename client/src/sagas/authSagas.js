import {put} from 'redux-saga/effects';
import history from '../browserHistory';
import * as restController from '../api/rest/auth';
import {getUserSuccess, authActionSuccess, authActionError} from '../actions/actionCreator';
import {controller} from '../api/ws/socketController';

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
        history.replace('/');
    } catch (e) {
        yield put(authActionError(e.response || e));
    }
}
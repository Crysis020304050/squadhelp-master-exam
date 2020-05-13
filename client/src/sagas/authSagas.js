import {put} from 'redux-saga/effects';
import ACTION from '../actions/actionTypes';
import history from '../browserHistory';
import React from 'react';
import * as restController from '../api/rest/auth';
import {getUserSuccess} from '../actions/actionCreator';
import {controller} from '../api/ws/socketController';

export  function* loginSaga(action){
    yield put({type: ACTION.AUTH_ACTION_REQUEST});
    try{
        const {data} = yield  restController.loginRequest(action.data);
        history.replace('/');
        yield  put({type: ACTION.AUTH_ACTION_SUCCESS});
        yield put(getUserSuccess(data.user));
        controller.subscribe(data.user.id);
    }
    catch (e) {
        yield  put({type: ACTION.AUTH_ACTION_ERROR, error: e.response});
    }
}

export  function* registerSaga(action){
    yield put({type: ACTION.AUTH_ACTION_REQUEST});
    try{
        const {data} = yield  restController.registerRequest(action.data);
        history.replace('/');
        yield put({type: ACTION.AUTH_ACTION_SUCCESS});
        yield put(getUserSuccess(data.user));
        controller.subscribe(data.user.id);
    }
    catch (e) {
        yield put({type: ACTION.AUTH_ACTION_ERROR, error: e.response});
    }
}

export  function* refreshLoginSaga(action){
    yield put({type: ACTION.AUTH_ACTION_REQUEST});
    try{
        const {data} = yield  restController.loginUserByRefreshToken(action.data);
        history.replace('/');
        yield  put({type: ACTION.AUTH_ACTION_SUCCESS});
        yield put(getUserSuccess(data.user));
        controller.subscribe(data.user.id);
    }
    catch (e) {
        yield  put({type: ACTION.AUTH_ACTION_ERROR, error: e.response});
    }
}

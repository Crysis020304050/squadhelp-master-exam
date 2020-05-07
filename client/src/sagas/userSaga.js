import {put} from 'redux-saga/effects';
import ACTION from '../actions/actionTypes';
import * as restController from '../api/rest/restController';
import {controller} from '../api/ws/socketController';
import {getUserSuccess, getUserError} from '../actions/actionCreator';



export  function* getUserSaga(action){
    try{
        const {data}=yield  restController.getUser();
        yield put(getUserSuccess(data));
        controller.subscribe(data.id);
    }
    catch (e) {
        yield put(getUserError(e.response || e));
    }
}

export  function* updateUserData(action){
    try{
        const {data}=yield restController.updateUser(action.data);
        yield put({type: ACTION.UPDATE_USER_DATA_SUCCESS,data: data});
        yield put({type: ACTION.CHANGE_EDIT_MODE_ON_USER_PROFILE,data: false});
    }
    catch (e) {
        yield  put({type: ACTION.UPDATE_USER_DATA_ERROR, error: e.response});
    }
}

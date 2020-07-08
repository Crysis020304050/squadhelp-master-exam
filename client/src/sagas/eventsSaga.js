import {put} from 'redux-saga/effects';
import {createNewEvent, getUserEvents} from '../api/rest/restController';
import {createNewEventSuccess, createNewEventError, getUserEventsSuccess, getUserEventsError} from '../actions/actionCreator.js';

export function* createNewEventSaga(action) {
    try {
        const {data} = yield createNewEvent(action.data);
        yield put(createNewEventSuccess(data));
    } catch (e) {
        yield put(createNewEventError(e.response || e));
    }
}

export function* getUserEventsSaga(action) {
    try {
        const {data} = yield getUserEvents();
        yield put(getUserEventsSuccess(data));
    } catch (e) {
        yield put(getUserEventsError(e.response || e));
    }
}
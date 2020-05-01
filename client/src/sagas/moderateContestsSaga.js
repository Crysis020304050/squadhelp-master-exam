import {put} from 'redux-saga/effects';
import {getContestForModerator} from '../api/rest/restController';
import {getContestsForModeratorSuccess, getContestsForModeratorError} from '../actions/actionCreator.js';

export function* getContestsForModeratorSaga(action) {
    try {
        const {data} = yield getContestForModerator(action.filter);
        yield put(getContestsForModeratorSuccess(data));
    } catch (e) {
        yield put(getContestsForModeratorError(e.response || e));
    }
}

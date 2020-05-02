import {put} from 'redux-saga/effects';
import {getContestForModerator, resolveContest, rejectContest} from '../api/rest/restController';
import {
    getContestsForModeratorSuccess,
    getContestsForModeratorError,
    moderateContestResolveSuccess,
    moderateContestResolveError,
    moderateContestRejectSuccess,
    moderateContestRejectError
} from '../actions/actionCreator.js';

export function* getContestsForModeratorSaga(action) {
    try {
        const {data} = yield getContestForModerator(action.filter);
        yield put(getContestsForModeratorSuccess(data));
    } catch (e) {
        yield put(getContestsForModeratorError(e.response || e));
    }
}

export function* resolveContestSaga(action) {
    try {
        const {data} = yield resolveContest(action.id);
        yield put(moderateContestResolveSuccess(data.id));
    } catch (e) {
        yield put(moderateContestResolveError(e.response || e));
    }
}

export function* rejectContestSaga(action) {
    try {
        const {data} = yield rejectContest(action.id);
        yield put(moderateContestRejectSuccess(data.id))
    } catch (e) {
        yield put(moderateContestRejectError(e.response || e));
    }
}
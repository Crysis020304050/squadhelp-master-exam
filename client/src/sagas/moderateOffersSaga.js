import {put} from 'redux-saga/effects';
import {getOffersForModerator, resolveOffer, rejectOffer} from '../api/rest/restController';
import {
    getOffersForModeratorSuccess,
    getOffersForModeratorError,
    moderateOffersResolveSuccess,
    moderateOffersResolveError,
    moderateOffersRejectSuccess,
    moderateOffersRejectError
} from '../actions/actionCreator.js';

export function* getOffersForModeratorSaga(action) {
    try {
        const {data} = yield getOffersForModerator(action.filter);
        yield put(getOffersForModeratorSuccess(data));
    } catch (e) {
        yield put(getOffersForModeratorError(e.response || e));
    }
}

export function* resolveOfferSaga(action) {
    try {
        const {data} = yield resolveOffer(action.id);
        yield put(moderateOffersResolveSuccess(data.id));
    } catch (e) {
        yield put(moderateOffersResolveError(e.response || e));
    }
}

export function* rejectOfferSaga(action) {
    try {
        const {data} = yield rejectOffer(action.id);
        yield put(moderateOffersRejectSuccess(data.id))
    } catch (e) {
        yield put(moderateOffersRejectError(e.response || e));
    }
}
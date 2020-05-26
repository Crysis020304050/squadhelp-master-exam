import {put} from 'redux-saga/effects';
import {getOffersForModerator, resolveOffer, rejectOffer} from '../api/rest/restController';
import {
    getOffersForModeratorSuccess,
    getOffersForModeratorError,
    moderateOfferResolveSuccess,
    moderateOfferResolveError,
    moderateOfferRejectSuccess,
    moderateOfferRejectError
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
        yield put(moderateOfferResolveSuccess(data.id));
    } catch (e) {
        yield put(moderateOfferResolveError(e.response || e));
    }
}

export function* rejectOfferSaga(action) {
    try {
        const {data} = yield rejectOffer(action.id);
        yield put(moderateOfferRejectSuccess(data.id))
    } catch (e) {
        yield put(moderateOfferRejectError(e.response || e));
    }
}
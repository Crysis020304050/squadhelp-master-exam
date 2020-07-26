import {put, select} from 'redux-saga/effects';
import ACTION from '../actions/actionTypes';
import * as restController from '../api/rest/restController';
import constants from "../constants/constants";


export function* changeMarkSaga(action) {
    try {
        const {data} = yield  restController.changeMark(action.data);
        const offers = yield select(state => state.contestByIdStore.offers);
        offers.forEach(offer => {
            if (offer.User.id === data.userId) {
                offer.User.rating = data.rating;
            }
            if (offer.id === action.data.offerId) {
                offer.mark = action.data.mark;
            }
        });
        yield  put({type: ACTION.CHANGE_MARK_SUCCESS, data: offers});
    } catch (err) {
        yield  put({type: ACTION.CHANGE_MARK_ERROR, error: err.response});
    }
}

export function* addOfferSaga(action) {
    try {
        const {data} = yield restController.setNewOffer(action.data);
        const offers = yield select(state => state.contestByIdStore.offers);
        offers.unshift(data);
        yield put({type: ACTION.ADD_NEW_OFFER_TO_STORE, data: offers});
    } catch (e) {
        yield put({type: ACTION.ADD_OFFER_ERROR, error: e.response});
    }
}

export function* setOfferStatusSaga(action) {
    try {
        const {OFFER_STATUS_WON, CONTEST_STATUS_FINISHED, OFFER_STATUS_REJECTED} = constants;
        const {data} = yield  restController.setOfferStatus(action.data);
        const offers = yield  select(state => state.contestByIdStore.offers);
        const contestData = yield  select(state => state.contestByIdStore.contestData);
        offers.forEach(offer => {
            if (data.status === OFFER_STATUS_WON) {
                contestData.status = CONTEST_STATUS_FINISHED;
                offer.status = data.id === offer.id ? OFFER_STATUS_WON : OFFER_STATUS_REJECTED;
            } else if (data.id === offer.id) {
                offer.status = OFFER_STATUS_REJECTED;
            }
        });
        yield  put({type: ACTION.CHANGE_STORE_FOR_STATUS, data: offers});
    } catch (e) {
        yield  put({type: ACTION.SET_OFFER_STATUS_ERROR, error: e.response});
    }
}



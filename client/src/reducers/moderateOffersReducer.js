import ACTION from '../actions/actionTypes';
import CONSTANTS from '../constants';
import {loadDataToMap, removeItemFromMap} from "../utils";

const initialState = {
    offers: new Map(),
    isFetching: false,
    error: null,
    haveMore: true,
    filter: {
        limit: 8,
        offset: 0,
        moderationStatus: CONSTANTS.MODERATION_STATUS_MODERATION,
    },
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION.GET_OFFERS_FOR_MODERATOR_REQUEST: {
            return {
                ...state,
                isFetching: true,
            }
        }
        case ACTION.GET_OFFERS_FOR_MODERATOR_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                offers: loadDataToMap(state.offers, action.data.offers),
                haveMore: action.data.haveMore,
            }
        }
        case ACTION.GET_OFFERS_FOR_MODERATOR_ERROR: {
            return {
                ...state,
                isFetching: false,
                error: action.error,
            }
        }
        case ACTION.SET_NEW_OFFERS_MODERATION_FILTER: {
            return {
                ...initialState,
                filter: action.filter,
                isFetching: true,
            }
        }
        case ACTION.CLEAR_OFFERS_LIST: {
            return {
                ...state,
                error: null,
                offers: new Map(),
            }
        }
        case ACTION.MODERATE_OFFERS_RESOLVE_REQUEST:
        case ACTION.MODERATE_OFFERS_REJECT_REQUEST:
            return {
                ...state,
                isFetching: true,
            };

        case ACTION.MODERATE_OFFERS_RESOLVE_SUCCESS:
        case ACTION.MODERATE_OFFERS_REJECT_SUCCESS:
            return {
                ...state,
                isFetching: false,
                offers: removeItemFromMap(state.offers, action.id),
            };

        case ACTION.MODERATE_OFFERS_RESOLVE_ERROR:
        case ACTION.MODERATE_OFFERS_REJECT_ERROR:
            return {
                ...state,
                isFetching: false,
                error: action.error,
            };
        default: {
            return state
        }
    }
}
import ACTION from '../actions/actionTypes';
import constants from '../constants/constants';
import {loadDataToMap, removeItemFromMap} from "../utils";

const initialState = {
    offers: new Map(),
    isFetching: false,
    moderateActionIsFetching: false,
    error: null,
    haveMore: true,
    filter: {
        limit: 8,
        offset: 0,
        moderationStatus: constants.MODERATION_STATUS_MODERATION,
    },
    isShowOnFull: false,
    imagePath: null,
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
        case ACTION.MODERATE_OFFER_RESOLVE_REQUEST:
        case ACTION.MODERATE_OFFER_REJECT_REQUEST:
            return {
                ...state,
                moderateActionIsFetching: true,
            };

        case ACTION.MODERATE_OFFER_RESOLVE_SUCCESS:
        case ACTION.MODERATE_OFFER_REJECT_SUCCESS:
            return {
                ...state,
                moderateActionIsFetching: false,
                offers: removeItemFromMap(state.offers, action.id),
            };

        case ACTION.MODERATE_OFFER_RESOLVE_ERROR:
        case ACTION.MODERATE_OFFER_REJECT_ERROR:
            return {
                ...state,
                moderateActionIsFetching: false,
                error: action.error,
            };

        case ACTION.CHANGE_SHOW_IMAGE:{
            return{
                ...state,
                isShowOnFull: action.data.isShowOnFull,
                imagePath: action.data.imagePath
            }
        }
        default: {
            return state
        }
    }
}
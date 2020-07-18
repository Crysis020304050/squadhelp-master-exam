import ACTION from '../actions/actionTypes';
import constants from '../constants/constants';
import {loadDataToMap, removeItemFromMap} from "../utils";

const initialState = {
    contests: new Map(),
    isFetching: false,
    moderateActionIsFetching: false,
    error: null,
    haveMore: true,
    filter: {
        limit: 8,
        offset: 0,
        moderationStatus: constants.MODERATION_STATUS_MODERATION,
    },
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION.GET_CONTESTS_FOR_MODERATOR_REQUEST: {
            return {
                ...state,
                isFetching: true,
            }
        }
        case ACTION.GET_CONTESTS_FOR_MODERATOR_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                contests: loadDataToMap(state.contests, action.data.contests),
                haveMore: action.data.haveMore,
            }
        }
        case ACTION.GET_CONTESTS_FOR_MODERATOR_ERROR: {
            return {
                ...state,
                isFetching: false,
                error: action.error,
            }
        }
        case ACTION.SET_NEW_CONTESTS_MODERATION_FILTER: {
            return {
                ...initialState,
                filter: action.filter,
                isFetching: true,
            }
        }
        case ACTION.CLEAR_CONTESTS_LIST: {
            return {
                ...state,
                error: null,
                contests: new Map(),
            }
        }
        case ACTION.MODERATE_CONTEST_RESOLVE_REQUEST:
        case ACTION.MODERATE_CONTEST_REJECT_REQUEST:
            return {
                ...state,
                moderateActionIsFetching: true,
            };

        case ACTION.MODERATE_CONTEST_RESOLVE_SUCCESS:
        case ACTION.MODERATE_CONTEST_REJECT_SUCCESS:
            return {
                ...state,
                moderateActionIsFetching: false,
                contests: removeItemFromMap(state.contests, action.id),
            };

        case ACTION.MODERATE_CONTEST_RESOLVE_ERROR:
        case ACTION.MODERATE_CONTEST_REJECT_ERROR:
            return {
                ...state,
                moderateActionIsFetching: false,
                error: action.error,
            };
        case ACTION.LOGOUT_RESPONSE: {
            return initialState;
        }
        default: {
            return state
        }
    }
}
import ACTION from '../actions/actionTypes';
import CONSTANTS from '../constants';
import _ from 'lodash';

const initialState = {
    contests: new Map(),
    isFetching: false,
    error: null,
    haveMore: true,
    filter: {
        limit: 8,
        offset: 0,
        moderationStatus: CONSTANTS.MODERATION_STATUS_MODERATION,
    },
};

const loadDataToMap = (map, data) => {
  const updatedMap = _.clone(map);
  data.forEach(item => {
      updatedMap.set(item.id, item);
  });
  return updatedMap;
};

const removeItemFromMap = (map, id) => {
    const updatedMap = _.clone(map);
    updatedMap.delete(id);
    return updatedMap;
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
        case ACTION.SET_NEW_MODERATOR_FILTER: {
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
                isFetching: true,
            };

        case ACTION.MODERATE_CONTEST_RESOLVE_SUCCESS:
        case ACTION.MODERATE_CONTEST_REJECT_SUCCESS:
            return {
                ...state,
                isFetching: false,
                contests: removeItemFromMap(state.contests, action.id),
            };

        case ACTION.MODERATE_CONTEST_RESOLVE_ERROR:
        case ACTION.MODERATE_CONTEST_REJECT_ERROR:
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
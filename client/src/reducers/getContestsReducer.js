import ACTION from '../actions/actionTypes';
import constants from '../constants';
import _ from 'lodash';

const initialState = {
    isFetching: true,
    error: null,
    contests: [],
    customerFilter: constants.CONTEST_STATUS_ACTIVE,
    creatorFilter: {
        selectedContestTypes: new Set(),
        contestId: '',
        industry: '',
        awardSort: 'asc',
        ownEntries: false,
        moderationStatus: constants.MODERATION_STATUS_RESOLVED,

    },
    haveMore: true
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION.GET_CONTESTS_ACTION_REQUEST: {
            return {
                ...state,
                isFetching: true,
                error: null,
            }
        }
        case ACTION.GET_CONTESTS_ACTION_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                error: null,
                contests: [...state.contests,...action.data.contests],
                haveMore: action.data.haveMore
            }
        }
        case ACTION.GET_CONTESTS_ACTION_ERROR: {
            return {
                ...state,
                isFetching: false,
                error: action.error,
                contests: []
            }
        }
        case ACTION.CLEAR_CONTESTS_LIST: {
            return {
                ...state,
                error: null,
                contests: []
            }
        }
        case ACTION.SET_NEW_CUSTOMER_FILTER: {
            return {
                ...initialState,
                isFetching: false,
                customerFilter: action.filter
            }
        }
        case ACTION.SET_NEW_CREATOR_FILTER: {
            const removeSelectedTypesProperty = ({selectedContestTypes, ...rest}) => rest;
            return {
                ...initialState,
                isFetching: false,
                creatorFilter: {...state.creatorFilter, ...removeSelectedTypesProperty(action.filter)}
            }
        }
        case ACTION.SELECT_CONTEST_TYPE: {
            const updatedFilter = _.clone(state.creatorFilter);
            updatedFilter.selectedContestTypes = new Set(updatedFilter.selectedContestTypes).add(action.data);
            return {
                ...initialState,
                creatorFilter: updatedFilter,
            }
        }
        case ACTION.UNSELECT_CONTEST_TYPE: {
            const updatedFilter = _.clone(state.creatorFilter);
            const newSet = new Set(updatedFilter.selectedContestTypes);
            newSet.delete(action.data);
            updatedFilter.selectedContestTypes = newSet;
            return {
                ...initialState,
                creatorFilter: updatedFilter,
            }
        }
        default:
            return state;
    }
}


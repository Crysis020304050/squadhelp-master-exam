import ACTION from '../actions/actionTypes';


const initialState = {
    transactionHistory: [],
    transactionStatement: [],
    isFetching: false,
    error: null,
};


export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION.GET_USER_TRANSACTIONS_HISTORY_REQUEST: {
            return {
                ...state,
                isFetching: true,
            }
        }
        case ACTION.GET_USER_TRANSACTIONS_HISTORY_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                transactionHistory: action.transactionHistory,
            }
        }
        case ACTION.GET_USER_TRANSACTIONS_HISTORY_ERROR: {
            return {
                ...state,
                isFetching: false,
                error: action.error,
            }
        }
        case ACTION.GET_USER_TRANSACTIONS_STATEMENT_REQUEST: {
            return {
                ...state,
                isFetching: true,
            }
        }
        case ACTION.GET_USER_TRANSACTIONS_STATEMENT_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                transactionStatement: action.transactionStatement,
            }
        }
        case ACTION.GET_USER_TRANSACTIONS_STATEMENT_ERROR: {
            return {
                ...state,
                isFetching: false,
                error: action.error,
            }
        }
        default:
            return state;
    }
}

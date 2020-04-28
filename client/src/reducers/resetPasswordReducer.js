import ACTION from '../actions/actionTypes';

const initialState = {
    message: null,
    isFetching: false,
    error: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION.RESET_PASSWORD_REQUEST: {
            return {
                ...state,
                isFetching: true,
            }
        }
        case ACTION.RESET_PASSWORD_REQUEST_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                message: action.message,
            }
        }
        case ACTION.RESET_PASSWORD_REQUEST_ERROR: {
            return {
                ...state,
                isFetching: false,
                error: action.error,
            }
        }
        case ACTION.CLEAR_RESET_PASSWORD_ERROR: {
            return {
                ...state,
                error: null
            }
        }
        default: {
            return state
        }
    }
}
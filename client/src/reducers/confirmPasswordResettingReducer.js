import ACTION from '../actions/actionTypes';

const initialState = {
    message: null,
    isFetching: false,
    error: null
};

export default function (state= initialState, action) {
    switch (action.type) {
        case ACTION.CONFIRM_RESETTING_PASSWORD_REQUEST: {
            return {
                ...state,
                isFetching: true,
            }
        }
        case ACTION.CONFIRM_RESETTING_PASSWORD_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                message: action.message,
            }
        }
        case ACTION.CLEAR_RESET_PASSWORD_ERROR: {
            return {
                isFetching: false,
                error: action.error,
            }
        }
        case ACTION.CLEAR_CONFIRM_RESETTING_PASSWORD_ERROR: {
            return {
                ...state,
                error: null,
            }
        }
        default: {
            return state
        }
    }
}
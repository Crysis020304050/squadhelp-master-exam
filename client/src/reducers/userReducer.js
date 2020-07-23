import ACTION from '../actions/actionTypes';
import money from 'money-math';

const initialState = {
    isFetching: false,
    error: null,
    data: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION.AUTH_ACTION_REQUEST:
        case ACTION.UPDATE_USER_DATA_REQUEST: {
            return {
                ...state,
                isFetching: true,
            }
        }
        case ACTION.AUTH_ACTION_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                data: action.data,
            }
        }
        case ACTION.UPDATE_USER_DATA_SUCCESS: {
            return{
                ...state,
                data: {...state.data,...action.data},
                isFetching: false,
            }
        }
        case ACTION.AUTH_ACTION_ERROR:
        case ACTION.UPDATE_USER_DATA_ERROR: {
            return {
                ...state,
                isFetching: false,
                error: action.error
            }
        }
        case ACTION.LOGOUT_RESPONSE: {
            return initialState;
        }
        case ACTION.UPDATE_USER_BALANCE: {
            const updatedData = {...state.data};
            updatedData.balance = money.add(money.floatToAmount(updatedData.balance), money.floatToAmount(action.prize));
            return {
                ...state,
                data: updatedData,
            }
        }
        case ACTION.CLEAR_USER_ERROR:{
            return{
                ...state,
                error: null
            }
        }
        default:
            return state;
    }
}
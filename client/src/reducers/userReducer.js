import ACTION from '../actions/actionTypes';
import {controller} from '../api/ws/socketController';
import money from 'money-math';

const initialState = {
    isFetching: false,
    error: null,
    data: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION.GET_USER_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                error: null,
                data: action.data
            }
        }
        case ACTION.LOGOUT_RESPONSE: {
            controller.unsubscribe(state.data.id);
            return{
                ...state,
                data: null,
                error: null
            }
        }
        case ACTION.UPDATE_USER_DATA_SUCCESS: {
            return{
                ...state,
                data: {...state.data,...action.data},
                error: null
            }
        }
        case ACTION.UPDATE_USER_DATA_ERROR: {
            return{
                ...state,
                error: action.error
            }
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
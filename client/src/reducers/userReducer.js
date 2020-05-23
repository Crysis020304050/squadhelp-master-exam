import ACTION from '../actions/actionTypes';


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
        case ACTION.CLEAR_USER_STORE:{
            return{
                ...state,
                data: null,
                error: null
            }
        }
        case ACTION.UPDATE_USER_DATA_SUCCESS:{
            return{
                ...state,
                data: {...state.data,...action.data},
                error: null
            }
        }
        case ACTION.UPDATE_USER_DATA_ERROR:{
            return{
                ...state,
                error: action.error
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
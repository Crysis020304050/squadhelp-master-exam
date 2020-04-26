import ACTION from '../actions/actionTypes';

const initialState = {
    events: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION.CREATE_NEW_EVENT: {
            return {
                events: [...state.events, action.event]
            }
        }
        default:
            return state;
    }
}
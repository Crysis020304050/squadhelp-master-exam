import ACTION from '../actions/actionTypes';
import _ from 'lodash';

const initialState = {
    events: [],
    activeEvents: new Set(),
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION.CREATE_NEW_EVENT: {
            const sortedEvents = _.clone(state.events);
            sortedEvents.push(action.event);
            sortedEvents.sort(((a, b) => (a.endTime - b.endTime)));
            sortedEvents.sort((a, b) => {
                if (a.endTime - new Date() < 0 && b.endTime - new Date() > 0) {
                    return 1;
                }
                else if (a.endTime - new Date() > 0 && b.endTime - new Date() < 0) {
                    return -1;
                }
                return 0;
            });
            return {
                ...state,
                events: sortedEvents,
            }
        }
        case ACTION.SET_STARTED_EVENT: {
            const updatedSet = _.clone(state.activeEvents);
            updatedSet.add(action.timestamp);
            return {
                ...state,
                activeEvents: updatedSet,
            }
        }
        default:
            return state;
    }
}
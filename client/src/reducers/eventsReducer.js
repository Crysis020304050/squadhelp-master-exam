import ACTION from '../actions/actionTypes';
import _ from 'lodash';

const initialState = {
    events: [],
    isFetching: false,
    error: null,
    activeEvents: new Set(),
};

const sortEvents = events => {
    const sortedEvents = events.map(({endDate, reminderDate, createdAt, ...rest}) => ({
        ...rest,
        endDate: new Date(endDate),
        reminderDate: new Date(reminderDate),
        createdAt: new Date(createdAt),
    }));
    sortedEvents.sort(((a, b) => (a.endDate - b.endDate)));
    sortedEvents.sort((a, b) => {
        if (a.endDate - new Date() < 0 && b.endDate - new Date() > 0) {
            return 1;
        }
        else if (a.endDate - new Date() > 0 && b.endDate - new Date() < 0) {
            return -1;
        }
        return 0;
    });
    return sortedEvents;
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION.GET_USER_EVENTS_REQUEST:
        case ACTION.CREATE_EVENT_REQUEST: {
            return {
                ...state,
                isFetching: true,
            }
        }
        case ACTION.CREATE_EVENT_SUCCESS: {
            const sortedEvents = sortEvents([...state.events, action.event]);
            return {
                ...state,
                events: sortedEvents,
                isFetching: false,
            }
        }
        case ACTION.GET_USER_EVENTS_SUCCESS: {
            const sortedEvents = sortEvents(action.events);
            const updatedActiveEvents = _.clone(state.activeEvents);
            sortedEvents.forEach(({id, endDate}) => {
               if (endDate < new Date() && !updatedActiveEvents.has(id)) {
                   updatedActiveEvents.add(id);
               }
            });
            return {
                ...state,
                events: sortedEvents,
                activeEvents: updatedActiveEvents,
                isFetching: false,
            }
        }
        case ACTION.GET_USER_EVENTS_ERROR:
        case ACTION.CREATE_EVENT_ERROR: {
            return {
                ...state,
                error: action.error,
                isFetching: false,
            }
        }
        case ACTION.SET_STARTED_EVENT: {
            const updatedActiveEvents = _.clone(state.activeEvents);
            updatedActiveEvents.add(action.id);
            return {
                ...state,
                activeEvents: updatedActiveEvents,
            }
        }
        case ACTION.CLEAR_EVENTS_STORE_ERROR: {
            return {
                ...state,
                error: null,
            }
        }
        default:
            return state;
    }
}
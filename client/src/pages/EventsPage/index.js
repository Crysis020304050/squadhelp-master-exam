import React, {useEffect} from "react";
import styles from './EventsPage.module.sass'
import Header from "../../components/Header/Header";
import EventTimer from "../../components/EventTimer";
import CreateEventForm from "../../components/CreateEventForm";
import {connect} from 'react-redux';
import {getUserEventsRequest, setStartedEvent, clearEventsStoreError} from "../../actions/actionCreator";
import Error from "../../components/Error/Error";

const EventsPage = ({events, activeEvents, error, getUserEvents, setStartedEvent, clearError}) => {

    useEffect(() => {
        getUserEvents();
    }, []);

    return (
        <div className={styles.page}>
            <Header/>
            <div className={styles.contentContainerWrapper}>
                <div className={styles.contentContainer}>
                    {error && <Error error={error} clearError={clearError}/>}
                    <CreateEventForm/>
                    <ul className={styles.timersList}>
                        {
                            events && events.map(event => <EventTimer key={event.id} {...event}
                                                                      setStartedEvent={setStartedEvent}
                                                                      activeEvents={activeEvents}/>)
                        }
                    </ul>
                </div>
            </div>
        </div>

    )
};

const mapStateToProps = state => state.eventsStore;

const mapDispatchToProps = dispatch => ({
    getUserEvents: () => dispatch(getUserEventsRequest()),
    setStartedEvent: id => dispatch(setStartedEvent(id)),
    clearError: () => dispatch(clearEventsStoreError()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventsPage);
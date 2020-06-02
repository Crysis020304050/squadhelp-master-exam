import React from "react";
import styles from './EventsPage.module.sass'
import Header from "../../components/Header/Header";
import EventTimer from "../../components/EventTimer";
import CreateEventForm from "../../components/CreateEventForm";
import {connect} from 'react-redux';
import {setStartedEvent} from "../../actions/actionCreator";

const EventsPage = ({events, setStartedEvent, activeEvents}) => {

    return (
        <div className={styles.page}>
            <Header/>
            <div className={styles.contentContainerWrapper}>
                <div className={styles.contentContainer}>
                    <CreateEventForm/>
                    <ul className={styles.timersList}>
                        {
                            events && events.map(event => <EventTimer key={event.startDate} {...event} setStartedEvent={setStartedEvent} activeEvents={activeEvents}/>)
                        }
                    </ul>
                </div>
            </div>
        </div>

    )
};

const mapStateToProps = state => state.eventsStore;

const mapDispatchToProps = dispatch => ({
   setStartedEvent: timestamp => dispatch(setStartedEvent(timestamp)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventsPage);
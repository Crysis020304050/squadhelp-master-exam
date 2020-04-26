import React from "react";
import styles from './EventsPage.module.sass'
import Header from "../../components/Header/Header";
import Timer from "../../components/EventTimer";
import CreateEventForm from "../../components/CretaeEventForm";
import {connect} from 'react-redux';

const EventsPage = ({events}) => {

    return (
        <div className={styles.page}>
            <Header/>
            <div className={styles.contentContainer}>
                <ul className={styles.timersList}>
                    {
                        events && events.map((event, index) => <Timer index={index} {...event}/>)
                    }
                </ul>
                <CreateEventForm/>
            </div>
        </div>

    )
};

const mapStateToProps = state => state.eventsStore;

export default connect(mapStateToProps)(EventsPage);
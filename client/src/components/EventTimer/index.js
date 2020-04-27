import React, {useEffect, useState} from "react";
import moment from 'moment';
import {toast} from 'react-toastify';
import styles from './EventTimer.module.sass';
import {connect} from 'react-redux';

const EventTimer = ({eventName, endTime, startDate, reminderTime, index, events}) => {

    const calculateTimeLeft = () => {
        const diffTime = moment(endTime).diff(moment());
        const duration = moment.duration(diffTime);
        if (moment(reminderTime).format() === moment().format() && !toast.isActive(1)) {
            toast(`Event '${eventName}' is coming soon`, {
                toastId: 1,
            });
        }
        return duration > 0 ? {
            ...(duration.asDays() > 1 && {d: Math.floor(duration.asDays())}),
            ...(duration.asHours() > 1 && {h: duration.hours()}),
            ...(duration.asMinutes() > 1 && {m: duration.minutes()}),
            ...(duration.asSeconds() > 1 && {s: duration.seconds()}),
        } : {};
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
    });

    const timerComponents = Object.entries(timeLeft).map(([key, value], index) => (
        <span key={index}>{`${value} ${key} `}</span>));

    const countActiveEvents = () => {
        return events.filter(({endTime}) => {
            const diffTime = moment(endTime).diff(moment());
            const duration = moment.duration(diffTime);
            return duration > 0
        }).length;
    };

    return (
        <li key={index} className={styles.container}>
            {timerComponents.length > 0 && <div style={{width: `${Math.round(((new Date() - startDate) / (endTime - startDate)) * 100)}%`}} className={styles.progressBar}/>}
            {timerComponents.length === 0 && <div className={styles.eventsCircle}>{countActiveEvents()}</div> }
            <div>{eventName}</div>
            <div>
                {timerComponents.length ? timerComponents : <span>Time's up!</span>}
            </div>
        </li>
    );
};

const mapStateToProps = state => state.eventsStore;

export default connect(mapStateToProps)(EventTimer);
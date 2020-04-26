import React, {useEffect, useState} from "react";
import moment from 'moment';
import {toast} from 'react-toastify';
import styles from './EventTimer.module.sass';
import {connect} from 'react-redux';

const EventTimer = ({eventName, endTime, reminderTime, index, events}) => {

    const calculateTimeLeft = () => {
        const diffTime = moment(endTime).diff(moment());
        const duration = moment.duration(diffTime);
        if (moment(reminderTime).format() === moment().format() && !toast.isActive(1)) {
            toast(`Event '${eventName}' is coming soon`, {
                toastId: 1,
            });
        }
        return duration > 0 ? {
            ...(duration.days() > 0 && {d: Math.floor(duration.asDays())}),
            ...((duration.days() > 0 ? duration.hours() >= 0 : duration.hours() > 0) && {h: duration.hours()}),
            ...((duration.days() > 0 || duration.days() > 0 ? duration.minutes() >= 0 : duration.minutes() > 0) && {m: duration.minutes()}),
            ...((duration.days() > 0 || duration.days() > 0 || duration.minutes() > 0 ? duration.seconds() >= 0 : duration.seconds() > 0) && {s: duration.seconds()}),
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
            {timerComponents.length ? null : <div className={styles.eventsCircle}>{countActiveEvents()}</div> }
            <div>{eventName}</div>
            <div>
                {timerComponents.length ? timerComponents : <span>Time's up!</span>}
            </div>
        </li>
    );
};

const mapStateToProps = state => state.eventsStore;

export default connect(mapStateToProps)(EventTimer);
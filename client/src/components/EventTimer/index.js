import React, {useEffect, useState} from "react";
import moment from 'moment';
import {toast} from 'react-toastify';
import styles from './EventTimer.module.sass';
import PropTypes from 'prop-types';

const EventTimer = ({id, name, endDate, reminderDate, createdAt, setStartedEvent, activeEvents}) => {

    const calculateTimeLeft = () => {
        const diffTime = moment(endDate).diff(moment());
        const duration = moment.duration(diffTime);
        if (moment(reminderDate).format() === moment().format() && !toast.isActive(id)) {
            toast(`Event '${name}' is coming soon`, {
                toastId: id,
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
        const timeoutId = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        if (Object.keys(timeLeft).length === 0) {
            clearTimeout(timeoutId);
            if (!activeEvents.has(id)) {
                setStartedEvent(id)
            }
        }

        return () => clearTimeout(timeoutId);
    });

    const renderTimerComponents = () => Object.entries(timeLeft).map(([key, value], index) => (
        <span key={index}>{`${value} ${key} `}</span>
    ));

    return (
        <li className={styles.container}>
            {Object.keys(timeLeft).length > 0 && <div style={{width: `${Math.round(((new Date() - createdAt) / (endDate - createdAt)) * 100)}%`}} className={styles.progressBar}/>}
            {Object.keys(timeLeft).length === 0 && <div className={styles.eventsCircle}>{activeEvents.size}</div>}
            <div>{name}</div>
            <div>
                {Object.keys(timeLeft).length ? renderTimerComponents() : <span>Time's up!</span>}
            </div>
        </li>
    );
};

EventTimer.propTypes = {
    name: PropTypes.string.isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    reminderDate: PropTypes.instanceOf(Date).isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    setStartedEvent: PropTypes.func.isRequired,
    activeEvents: PropTypes.instanceOf(Set).isRequired,
};

export default EventTimer;
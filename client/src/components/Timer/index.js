import React, {useEffect, useState} from "react";
import moment from 'moment';

const Timer = props => {

    const calculateTimeLeft = () => {
        const diffTime = moment('2020-04-27').diff(moment());
        const duration = moment.duration(diffTime);
        const timeObject = {
            d: duration.days(),
            h: duration.hours(),
            m: duration.minutes(),
            s: duration.seconds(),
        };

        return duration > 0 ? timeObject : {};
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
    });

    const timerComponents = Object.entries(timeLeft).map(([key, value], index) => (<span key={index}>{`${value} ${key} `}</span>));

    return (
        <div>
            {timerComponents.length ? timerComponents : <span>Time's up!</span>}
        </div>
    );
};

export default Timer;
import React from "react";
import PropTypes from 'prop-types';

const StepCard = ({className, number, stepName, description}) => {

    return (
        <li className={className}>
            <div>{number}</div>
            <h5>{stepName}</h5>
            <p>{description}</p>
        </li>
    );
};

StepCard.propTypes = {
    className: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    stepName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

export default StepCard;
import React from "react";
import PropTypes from 'prop-types';

const StepCard = ({className, index, number, stepName, description}) => {

    return (
        <li key={index} className={className}>
            <div>{number}</div>
            <h5>{stepName}</h5>
            <p>{description}</p>
        </li>
    );
};

StepCard.propTypes = {
    className: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
    stepName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

export default StepCard;
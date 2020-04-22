import React from 'react';
import PropTypes from 'prop-types';


const FieldError = ({className, touched, error}) => {

    return (
        <>
            {
                touched && error && <span className={className}>{error}</span>
            }
        </>
    );
};

FieldError.propTypes = {
    className: PropTypes.string,
    touched: PropTypes.bool,
    error: PropTypes.string,
};

export default FieldError;
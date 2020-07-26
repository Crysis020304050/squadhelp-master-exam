import React from 'react';
import styles from './Error.module.sass';
import PropTypes from 'prop-types';

const Error = ({error: {status, data}, clearError}) => {

    const getMessage = () => {
        switch (status) {
            case 400:
            case 402:
            case 403:
            case 404:
            case 406:
            case 409:
                return data;
            default:
                return 'Server Error';
        }
    };

    return(
        <div className={styles.errorContainer}>
            <span>{getMessage()}</span>
            <i className="far fa-times-circle" onClick={()=>clearError()}/>
        </div>
    )
};

Error.propTypes = {
    error: PropTypes.object.isRequired,
    clearError: PropTypes.func.isRequired,
};

export default Error;
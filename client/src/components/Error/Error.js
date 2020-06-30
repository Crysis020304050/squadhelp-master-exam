import React from 'react';
import styles from './Error.module.sass';
import PropTypes from 'prop-types';

const Error = ({error: {status, data}, clearError}) => {

    const getMessage = () => {
        switch (status) {
            case 404:
                return data;
            case 400:
                return data;
            case 409:
                return data;
            case 403:
                return 'Bank decline transaction';
            case 406:
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
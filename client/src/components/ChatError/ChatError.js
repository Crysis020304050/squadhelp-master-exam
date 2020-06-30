import React from 'react';
import styles from './ChatError.module.sass';
import PropTypes from 'prop-types';

const ChatError = ({getData, error: {status, data}}) => {

    const getMessage = () => {
        switch (status) {
            case 409:
                return data;
            default:
                return 'Server Error';
        }
    };

    return (
        <div className={styles.errorContainer} onClick={()=>getData()}>
            <div className={styles.container}>
                <span>{getMessage()}</span>
                <i className="fas fa-redo"/>
            </div>
        </div>
    );
};

ChatError.propTypes = {
    getData: PropTypes.func.isRequired,
    error: PropTypes.object.isRequired,
};

export default ChatError;
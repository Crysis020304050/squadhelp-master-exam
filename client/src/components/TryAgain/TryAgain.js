import React from 'react';
import styles from './TryAgain.module.sass';
import PropTypes from 'prop-types';

const TryAgain = (props) => {
    const {getData} = props;
    return (
        <div className={styles.container}>
            <span onClick={() => getData()}>Server Error. Try again</span>
            <i className="fas fa-redo" onClick={() => getData()}/>
        </div>
    );
};

TryAgain.propTypes = {
    getData: PropTypes.func.isRequired,
};

export default TryAgain;
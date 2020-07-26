import React from 'react';
import styles from "./ContestInfo.module.sass";
import PropTypes from 'prop-types';

const NameContestSpecialInfo = ({typeOfName, styleName}) => (
    <>
        <div className={styles.dataContainer}>
            <span className={styles.label}>Type of Name</span>
            <span className={styles.data}>{typeOfName}</span>
        </div>
        <div className={styles.dataContainer}>
            <span className={styles.label}>Style of Name</span>
            <span className={styles.data}>{styleName}</span>
        </div>
    </>
);

NameContestSpecialInfo.propTypes = {
    typeOfName: PropTypes.string.isRequired,
    styleName: PropTypes.string.isRequired,
};

export default NameContestSpecialInfo;
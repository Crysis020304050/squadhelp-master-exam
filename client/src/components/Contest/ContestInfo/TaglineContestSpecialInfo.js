import React from 'react';
import styles from "./ContestInfo.module.sass";
import PropTypes from 'prop-types';

const TaglineContestSpecialInfo = ({nameVenture, typeOfTagline}) => (
    <>
        {nameVenture && <div className={styles.dataContainer}>
            <span className={styles.label}>Name ventrure</span>
            <span className={styles.data}>{nameVenture}</span>
        </div>}
        <div className={styles.dataContainer}>
            <span className={styles.label}>Type of Taglinee</span>
            <span className={styles.data}>{typeOfTagline}</span>
        </div>
    </>
);

TaglineContestSpecialInfo.propTypes = {
    nameVenture: PropTypes.string.isRequired,
    typeOfTagline: PropTypes.string.isRequired,
};

export default TaglineContestSpecialInfo;
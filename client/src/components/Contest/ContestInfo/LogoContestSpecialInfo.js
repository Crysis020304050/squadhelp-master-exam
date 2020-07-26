import React from 'react';
import styles from "./ContestInfo.module.sass";
import PropTypes from 'prop-types';

const LogoContestSpecialInfo = ({nameVenture, brandStyle}) => (
    <>
        {nameVenture && <div className={styles.dataContainer}>
            <span className={styles.label}>Name ventrure</span>
            <span className={styles.data}>{nameVenture}</span>
        </div>}
        <div className={styles.dataContainer}>
            <span className={styles.label}>Brand Style</span>
            <span className={styles.data}>{brandStyle}</span>
        </div>
    </>
);

LogoContestSpecialInfo.propTypes = {
    nameVenture: PropTypes.string.isRequired,
    brandStyle: PropTypes.string.isRequired,
};

export default LogoContestSpecialInfo;
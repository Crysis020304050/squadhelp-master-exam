import React from 'react';
import constants from '../../constants/constants';
import classNames from 'classnames';
import styles from './ModeratorFilter.module.sass';
import PropTypes from 'prop-types';

const ModeratorFilter = ({filter: {limit, offset, moderationStatus}, setNewFilter}) => {

    const setFilter = (status) => {
        if (status !== moderationStatus) {
            const newFilter = {
                limit,
                offset,
                moderationStatus: status,
            };
            setNewFilter(newFilter);
        }
    };

    return (
        <div className={styles.filterContainer}>
            <div onClick={() => setFilter(constants.MODERATION_STATUS_MODERATION)}
                 className={classNames(styles.filter, {
                     [styles.activeFilter]: constants.MODERATION_STATUS_MODERATION === moderationStatus,
                 })}>Moderation
            </div>
            <div onClick={() => setFilter(constants.MODERATION_STATUS_RESOLVED)}
                 className={classNames(styles.filter, {
                     [styles.activeFilter]: constants.MODERATION_STATUS_RESOLVED === moderationStatus,
                 })}>Resolved
            </div>
            <div onClick={() => setFilter(constants.MODERATION_STATUS_REJECTED)}
                 className={classNames(styles.filter, {
                     [styles.activeFilter]: constants.MODERATION_STATUS_REJECTED === moderationStatus,
                 })}>Rejected
            </div>
        </div>
    );
};

ModeratorFilter.propTypes = {
    filter: PropTypes.object.isRequired,
    setNewFilter: PropTypes.func.isRequired,
};

export default ModeratorFilter;
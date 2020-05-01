import React from 'react';
import {connect} from 'react-redux';
import CONSTANTS from '../../constants';
import classNames from 'classnames';
import {setNewModeratorFilter} from '../../actions/actionCreator.js';
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
            <div onClick={() => setFilter(CONSTANTS.MODERATION_STATUS_MODERATION)}
                 className={classNames(styles.filter, {
                     [styles.activeFilter]: CONSTANTS.MODERATION_STATUS_MODERATION === moderationStatus,
                 })}>Moderation Contests
            </div>
            <div onClick={() => setFilter(CONSTANTS.MODERATION_STATUS_RESOLVED)}
                 className={classNames(styles.filter, {
                     [styles.activeFilter]: CONSTANTS.MODERATION_STATUS_RESOLVED === moderationStatus,
                 })}>Resolved Contests
            </div>
            <div onClick={() => setFilter(CONSTANTS.MODERATION_STATUS_REJECTED)}
                 className={classNames(styles.filter, {
                     [styles.activeFilter]: CONSTANTS.MODERATION_STATUS_REJECTED === moderationStatus,
                 })}>Rejected Contests
            </div>
        </div>
    );
};

const mapDispatchToProps = dispatch => ({
    setNewFilter: (filter) => dispatch(setNewModeratorFilter(filter)),
});

ModeratorFilter.propTypes = {
    filter: PropTypes.object.isRequired,
};

export default connect(null, mapDispatchToProps)(ModeratorFilter);
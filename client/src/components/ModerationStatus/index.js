import React from "react";
import styles from './ModerationStatus.module.sass';
import constants from "../../constants/constants";
import PropTypes from 'prop-types';
import classNames from "classnames";

const ModerationStatus = ({moderationStatus}) => {

    const moderationStatusClassName = classNames(styles.moderationStatus,
        {[styles.moderation]: moderationStatus === constants.MODERATION_STATUS_MODERATION},
        {[styles.resolved]: moderationStatus === constants.MODERATION_STATUS_RESOLVED},
        {[styles.rejected]: moderationStatus === constants.MODERATION_STATUS_REJECTED},
    );

    return (
        <span className={moderationStatusClassName}>{moderationStatus}</span>
    );
};

ModerationStatus.propTypes = {
    moderationStatus: PropTypes.string.isRequired,
};

export default ModerationStatus;
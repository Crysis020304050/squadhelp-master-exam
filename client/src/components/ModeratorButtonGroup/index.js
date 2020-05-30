import React from "react";
import styles from './ModeratorButtonGroup.module.sass';
import PropTypes from 'prop-types';
import constants from "../../constants";
import classNames from "classnames";

const ModeratorButtonGroup = ({id, moderationStatus, isFetching, resolveFunc, rejectFunc}) => (
    <div className={styles.buttonGroupContainer}>
        {moderationStatus !== constants.MODERATION_STATUS_RESOLVED && <div
            className={classNames(styles.resolveButton, {[styles.singleResolveButton]: moderationStatus === constants.MODERATION_STATUS_REJECTED},
                {[styles.disabledButton]: isFetching}
            )}
            onClick={() => {
                if (!isFetching)
                    resolveFunc(id)
            }
            }>RESOLVE</div>}
        {moderationStatus === constants.MODERATION_STATUS_MODERATION &&
        <div className={classNames(styles.rejectButton, {[styles.disabledButton]: isFetching})} onClick={() => {
            if (!isFetching) {
                rejectFunc(id)
            }
        }}>REJECT</div>}
    </div>
);

ModeratorButtonGroup.propTypes = {
    id: PropTypes.number.isRequired,
    moderationStatus: PropTypes.string.isRequired,
    isFetching: PropTypes.bool.isRequired,
    resolveFunc: PropTypes.func.isRequired,
    rejectFunc: PropTypes.func.isRequired,
};

export default ModeratorButtonGroup;
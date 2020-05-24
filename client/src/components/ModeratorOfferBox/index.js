import React from "react";
import constants from "../../constants";
import PropTypes from 'prop-types';
import classNames from "classnames";
import styles from './ModeratorOfferBox.module.sass';

const ModeratorOfferBox = ({id, isFetching, fileName, text, moderationStatus, Contest: {contestType}, changeShowImage, resolveOffer, rejectOffer}) => {

    const moderationStatusClassName = classNames(styles.moderationStatus,
        {[styles.moderation]: moderationStatus === constants.MODERATION_STATUS_MODERATION},
        {[styles.resolved]: moderationStatus === constants.MODERATION_STATUS_RESOLVED},
        {[styles.rejected]: moderationStatus === constants.MODERATION_STATUS_REJECTED},
    );

    return (
        <div className={styles.container}>
            <div className={styles.boxHeader}>
                <span>{contestType}</span>
                <span className={moderationStatusClassName}>{moderationStatus}</span>
            </div>
            <div className={styles.offerContent}>
                {
                    contestType === constants.LOGO_CONTEST ?
                        <img onClick={() => changeShowImage({imagePath: fileName, isShowOnFull: true})}
                             src={`${constants.publicURL}${fileName}`} alt='logo'/>
                        :
                        <span>{text}</span>
                }
            </div>
            <div className={styles.setContestStatusButtonsContainer}>
                {moderationStatus !== constants.MODERATION_STATUS_RESOLVED && <div
                    className={classNames({[styles.singleResolveContestsButton]: moderationStatus === constants.MODERATION_STATUS_REJECTED})}
                    onClick={() => {
                        if (!isFetching)
                            resolveOffer(id)
                    }
                    }>RESOLVE</div>}
                {moderationStatus === constants.MODERATION_STATUS_MODERATION &&
                <div onClick={() => {
                    if (isFetching) {
                        rejectOffer(id)
                    }
                }}>REJECT</div>}
            </div>
        </div>
    );
};

ModeratorOfferBox.propTypes = {
    fileName: PropTypes.string,
    text: PropTypes.string,
    moderationStatus: PropTypes.string.isRequired,
    Contest: PropTypes.object.isRequired,
    changeShowImage: PropTypes.func.isRequired,
    resolveOffer: PropTypes.func.isRequired,
    rejectOffer: PropTypes.func.isRequired,
};

export default ModeratorOfferBox;
import React from 'react';
import styles from './ContestBox.module.sass';
import moment from 'moment';
import CONSTANTS from '../../constants';
import classNames from 'classnames';
import PropTypes from 'prop-types';


const ContestBox = (props) => {

    const getTimeStr = () => {
        const diff = (moment.duration(moment().diff(moment(props.data.createdAt))));
        let str = '';
        if (diff._data.days !== 0)
            str = `${diff._data.days}d `;
        if (diff._data.hours !== 0)
            str += `${diff._data.hours}h`;
        if (str.length === 0)
            str = 'less than one hour';
        return str;
    };

    const goToExtended = (contest_id) => {
        props.history.push('/contest/' + contest_id);
    };


    const getPreferenceContest = () => {
        const data = props.data;
        if (data.contestType === CONSTANTS.NAME_CONTEST)
            return data.typeOfName;
        else if (data.contestType === CONSTANTS.LOGO_CONTEST)
            return data.brandStyle;
        else
            return data.typeOfTagline;
    };

    const ucFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const {id, title, contestType, prize, count, moderationStatus} = props.data;
    const moderationStatusClassName = props.role === CONSTANTS.CREATOR
        ? null
        : classNames(styles.moderationStatus,
            {[styles.moderation]: moderationStatus === CONSTANTS.MODERATION_STATUS_MODERATION},
            {[styles.resolved]: moderationStatus === CONSTANTS.MODERATION_STATUS_RESOLVED},
            {[styles.rejected]: moderationStatus === CONSTANTS.MODERATION_STATUS_REJECTED},
        );

    return (
        <div className={styles.contestBoxContainerWrapper}>
            {props.role !== CONSTANTS.CREATOR &&
            <span className={moderationStatusClassName}>{moderationStatus}</span>}
            <div key={id} className={styles.contestBoxContainer} onClick={() => goToExtended(id)}>
                <div className={styles.mainContestInfo}>
                    <div className={styles.titleAndIdContainer}>
                        <span className={styles.title}>{title}</span>
                        <span className={styles.id}>{`(#${id})`}</span>
                    </div>
                    <div className={styles.contestType}>
                        <span>{`${ucFirstLetter(contestType)} / ${getPreferenceContest()}`}</span>
                    </div>
                    <div className={styles.contestType}>
                        <span>This is an Invitation Only Contest and is only open to those Creatives who have achieved a Tier A status.</span>
                    </div>
                    <div className={styles.prizeContainer}>
                        <div className={styles.guaranteedContainer}>
                            <div>
                                <img src={`${CONSTANTS.STATIC_IMAGES_PATH}smallCheck.png`} alt='check'/>
                            </div>
                            <span>Guaranteed prize</span>
                        </div>
                        <div className={styles.prize}>
                            <img src={`${CONSTANTS.STATIC_IMAGES_PATH}diamond.png`} alt='diamond'/>
                            <span>{`$${prize}`}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.entryAndTimeContainer}>
                    <div className={styles.entriesContainer}>
                        <div className={styles.entriesCounter}>
                            <img src={`${CONSTANTS.STATIC_IMAGES_PATH}entrieImage.png`} alt='logo'/>
                            <span>{count}</span>
                        </div>
                        <span>Entries</span>
                    </div>
                    <div className={styles.timeContainer}>
                        <span className={styles.timeContest}>{getTimeStr()}</span>
                        <span>Going</span>
                    </div>
                </div>
            </div>
            {props.role === CONSTANTS.MODERATOR && <div className={styles.setContestStatusButtonsContainer}>
                {moderationStatus !== CONSTANTS.MODERATION_STATUS_RESOLVED && <div
                    className={classNames({[styles.singleResolveContestsButton]: moderationStatus === CONSTANTS.MODERATION_STATUS_REJECTED})}
                    onClick={() => props.resolveContest(id)}>RESOLVE</div>}
                {moderationStatus === CONSTANTS.MODERATION_STATUS_MODERATION &&
                <div onClick={() => props.rejectContest(id)}>REJECT</div>}
            </div>}
        </div>
    )
};

ContestBox.propTypes = {
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    role: PropTypes.string,
    resolveContest: PropTypes.func,
    rejectContest: PropTypes.func,
};

export default ContestBox;
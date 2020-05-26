import React from 'react';
import styles from './ContestBox.module.sass';
import moment from 'moment';
import constants from '../../constants';
import PropTypes from 'prop-types';
import ModerationStatus from "../ModerationStatus";
import ModeratorButtonGroup from "../ModeratorButtonGroup";


const ContestBox = ({data: {createdAt, contestType, typeOfName, brandStyle, typeOfTagline, id, title, prize, count, moderationStatus}, history, role, resolveContest, rejectContest, isFetching}) => {

    const getTimeStr = () => {
        const diff = (moment.duration(moment().diff(moment(createdAt))));
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
        history.push('/contest/' + contest_id);
    };

    const getPreferenceContest = () => {
        switch (contestType) {
            case constants.NAME_CONTEST: {
                return typeOfName;
            }
            case constants.LOGO_CONTEST: {
                return brandStyle;
            }
            case constants.TAGLINE_CONTEST: {
                return typeOfTagline;
            }
            default: {
                return null;
            }
        }
    };

    const ucFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div className={styles.contestBoxContainerWrapper}>
            {role !== constants.CREATOR && <ModerationStatus moderationStatus={moderationStatus}/>}
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
                                <img src={`${constants.STATIC_IMAGES_PATH}smallCheck.png`} alt='check'/>
                            </div>
                            <span>Guaranteed prize</span>
                        </div>
                        <div className={styles.prize}>
                            <img src={`${constants.STATIC_IMAGES_PATH}diamond.png`} alt='diamond'/>
                            <span>{`$${prize}`}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.entryAndTimeContainer}>
                    <div className={styles.entriesContainer}>
                        <div className={styles.entriesCounter}>
                            <img src={`${constants.STATIC_IMAGES_PATH}entrieImage.png`} alt='logo'/>
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
            {role === constants.MODERATOR &&
            <ModeratorButtonGroup rejectFunc={rejectContest} isFetching={isFetching} id={id}
                                  resolveFunc={resolveContest} moderationStatus={moderationStatus}/>}
        </div>
    )
};

ContestBox.propTypes = {
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    role: PropTypes.string,
    resolveContest: PropTypes.func,
    rejectContest: PropTypes.func,
    isFetching: PropTypes.bool,
};

export default ContestBox;
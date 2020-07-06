import React from 'react';
import {connect} from 'react-redux';
import styles from './ContestSideBar.module.sass';
import {withRouter} from 'react-router-dom';
import constants from '../../constants/constants';
import moment from 'moment';


const ContestSideBar = ({contestData: {createdAt, User: {id, avatar, firstName, lastName, displayName}, prize, status}, data, totalEntries}) => {

    const {CONTEST_STATUS_FINISHED, STATIC_IMAGES_PATH, MODERATOR, ANONYM_IMAGE_PATH, publicURL} = constants;

    const getTimeStr = () => {
        if (status === CONTEST_STATUS_FINISHED) {
            return 'Finished';
        } else {
            const diff = (moment.duration(moment().diff(moment(createdAt))));
            if (diff.asHours() < 1) {
                return 'Less than one hour';
            } else if (diff.asHours() < 24) {
                return `${diff.hours()} hours`;
            } else if (diff.asDays() > 1) {
                return `${Math.floor(diff.asDays())} days ${diff.hours()} hours`
            }
        }
    };

    return (
        <div className={styles.contestSideBarInfo}>
            <div className={styles.contestInfo}>
                <div className={styles.awardAndTimeContainer}>
                    <div className={styles.prizeContainer}>
                        <img src={`${STATIC_IMAGES_PATH}big-diamond.png`} alt='diamond'/>
                        <span>{`$ ${prize}`}</span>
                    </div>
                    <div className={styles.timeContainer}>
                        <div className={styles.timeDesc}>
                            <img src={`${STATIC_IMAGES_PATH}clock.png`} alt='clock'/>
                            <span>Going</span>
                        </div>
                        <span className={styles.time}>{getTimeStr()}</span>
                    </div>
                    <div className={styles.guaranteedPrize}>
                        <div>
                            <img src={`${STATIC_IMAGES_PATH}smallCheck.png`} alt='check'/>
                        </div>
                        <span>Guaranteed prize</span>
                    </div>
                </div>
                <div className={styles.contestStats}>
                    <span>Contest Stats</span>
                    <div className={styles.totalEntrie}>
                        <span className={styles.totalEntriesLabel}>Total Entries</span>
                        <span>{totalEntries}</span>
                    </div>
                </div>
            </div>
            {data.id !== id && data.role !== MODERATOR && <div className={styles.infoCustomerContainer}>
                <span className={styles.labelCustomerInfo}>About Contest Holder</span>
                <div className={styles.customerInfo}>
                    <img src={avatar === 'anon.png' ? ANONYM_IMAGE_PATH : `${publicURL}${avatar}`} alt='user'/>
                    <div className={styles.customerNameContainer}>
                        <span>{`${firstName} ${lastName}`}</span>
                        <span>{displayName}</span>
                    </div>
                </div>
            </div>}
        </div>
    );
};

const mapStateToProps = (state) => state.userStore;

export default connect(mapStateToProps, null)(ContestSideBar);

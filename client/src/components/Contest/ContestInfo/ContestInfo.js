import React from 'react';
import styles from "../../Brief/Brief.module.sass";
import constants from "../../../constants/constants";
import LogoContestSpecialInfo from './LogoContestSpecialInfo';
import NameContestSpecialInfo from './NameContestSpecialInfo';
import TaglineContestSpecialInfo from './TaglineContestSpecialInfo';
import PropTypes from 'prop-types';

const ContestInfo = ({changeEditContest, userId, contestData, role, goChat}) => {

    const {
        typeOfTagline, brandStyle, typeOfName, styleName, contestType,
        title, focusOfWork, targetCustomer, industry, originalFileName,
        fileName, User, status, nameVenture
    } = contestData;

    const {CONTEST_STATUS_FINISHED, CREATOR, NAME_CONTEST, TAGLINE_CONTEST, publicURL} = constants;

    return (
        <div className={styles.mainContestInfoContainer}>
            <div className={styles.infoContainer}>
                <div className={styles.contestTypeContainer}>
                    <div className={styles.dataContainer}>
                        <span className={styles.label}>Contest Type</span>
                        <span className={styles.data}>{contestType}</span>
                    </div>
                    {
                        (User.id === userId && status !== CONTEST_STATUS_FINISHED)
                        &&
                        <div onClick={() => changeEditContest(true)} className={styles.editBtn}>Edit</div>
                    }
                    {
                        role === CREATOR
                        &&
                        <i onClick={goChat} className='fas fa-comments'/>
                    }
                </div>
                <div className={styles.dataContainer}>
                    <span className={styles.label}>Title of the Project</span>
                    <span className={styles.data}>{title}</span>
                </div>
                {
                    contestType === NAME_CONTEST ?
                        <NameContestSpecialInfo typeOfName={typeOfName} styleName={styleName}/>
                        :
                        (
                            contestType === TAGLINE_CONTEST ?
                                <TaglineContestSpecialInfo typeOfTagline={typeOfTagline}
                                                           nameVenture={nameVenture}/>
                                :
                                <LogoContestSpecialInfo brandStyle={brandStyle} nameVenture={nameVenture}/>
                        )
                }
                <div className={styles.dataContainer}>
                    <span className={styles.label}>What is your Business/ Brand about?</span>
                    <span className={styles.data}>{focusOfWork}</span>
                </div>
                <div className={styles.dataContainer}>
                    <span className={styles.label}>Description target customers of company </span>
                    <span className={styles.data}>{targetCustomer}</span>
                </div>
                <div className={styles.dataContainer}>
                    <span className={styles.label}>Industry  of company</span>
                    <span className={styles.data}>{industry}</span>
                </div>
                {originalFileName && <div className={styles.dataContainer}>
                    <span className={styles.label}>Additional File</span>
                    <a target="_blank" className={styles.file}
                       href={`${publicURL}${fileName}`}
                       download={originalFileName}>{originalFileName}</a>
                </div>}
            </div>
        </div>
    )
};

ContestInfo.propTypes = {
    changeEditContest: PropTypes.func.isRequired,
    userId: PropTypes.number.isRequired,
    contestData: PropTypes.object.isRequired,
    role: PropTypes.string.isRequired,
    goChat: PropTypes.func.isRequired,
};

export default ContestInfo;
import React from "react";
import constants from "../../constants/constants";
import PropTypes from 'prop-types';
import styles from './ModeratorOfferBox.module.sass';
import ModerationStatus from "../ModerationStatus";
import ModeratorButtonGroup from "../ModeratorButtonGroup";

const ModeratorOfferBox = ({id, isFetching, fileName, text, moderationStatus, Contest: {contestType}, changeShowImage, resolveOffer, rejectOffer}) => (
    <div className={styles.container}>
        <ModerationStatus moderationStatus={moderationStatus}/>
        <div className={styles.contestTypeAndIdContainer}>
            <span>{contestType}</span>
            <span>{`(#${id})`}</span>
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
        <ModeratorButtonGroup rejectFunc={rejectOffer} isFetching={isFetching} id={id} resolveFunc={resolveOffer} moderationStatus={moderationStatus}/>
    </div>
);

ModeratorOfferBox.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    fileName: PropTypes.string,
    text: PropTypes.string,
    moderationStatus: PropTypes.string.isRequired,
    Contest: PropTypes.object.isRequired,
    changeShowImage: PropTypes.func.isRequired,
    resolveOffer: PropTypes.func.isRequired,
    rejectOffer: PropTypes.func.isRequired,
};

export default ModeratorOfferBox;
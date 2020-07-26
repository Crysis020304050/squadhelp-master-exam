import React from 'react';
import styles from './OfferBox.module.sass';
import constants from '../../constants/constants';
import {connect} from 'react-redux';
import Rating from 'react-rating';
import {
    changeMark,
    clearChangeMarkError,
    goToExpandedDialog,
    changeShowImage
} from '../../actions/actionCreator';
import {withRouter} from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './confirmStyle.css';
import ModerationStatus from "../ModerationStatus";


const OfferBox = ({messagesPreview, id, data, role, contestType, setOfferStatus, clearError, changeMark, goToExpandedDialog, needButtons, changeShowImage}) => {

    const findConversationInfo = () => {
        const participants = [id, data.User.id];
        participants.sort((participant1, participant2) => participant1 - participant2);
        for (let i = 0; i < messagesPreview.length; i++) {
            if (isEqual(participants, messagesPreview[i].participants)) {
                return {
                    participants: messagesPreview[i].participants,
                    id: messagesPreview[i].id,
                    blackList: messagesPreview[i].blackList,
                    favoriteList: messagesPreview[i].favoriteList
                };
            }
        }
        return null;
    };

    const resolveOffer = () => {
        confirmAlert({
            title: 'confirm',
            message: 'Are u sure?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => setOfferStatus(data.User.id, data.id, 'resolve')
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    const rejectOffer = () => {
        confirmAlert({
            title: 'confirm',
            message: 'Are u sure?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => setOfferStatus(data.User.id, data.id, 'reject')
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    const changeMarkFunc = (value) => {
        const {id, mark, User} = data;
        clearError();
        changeMark({
            mark: value,
            offerId: id,
            isFirst: !mark,
            creatorId: User.id
        });
    };

    const offerStatus = () => {
        switch (data.status) {
            case constants.OFFER_STATUS_REJECTED: {
                return <i className={classNames("fas fa-times-circle reject", styles.reject)}/>
            }
            case constants.OFFER_STATUS_WON: {
                return <i className={classNames("fas fa-check-circle resolve", styles.resolve)}/>
            }
            default: {
                return null;
            }
        }
    };

    const goChat = () => {
        goToExpandedDialog({interlocutor: data.User, conversationData: findConversationInfo()});
    };

    const {avatar, firstName, lastName, email, rating} = data.User;
    return (
        <div className={styles.offerContainer}>
            {role === constants.CREATOR && <ModerationStatus moderationStatus={data.moderationStatus}/>}
            {offerStatus()}
            <div className={styles.mainInfoContainer}>
                <div className={styles.userInfo}>
                    <div className={styles.creativeInfoContainer}>
                        <img
                            src={avatar === 'anon.png' ? constants.ANONYM_IMAGE_PATH : `${constants.publicURL}${avatar}`}
                            alt='user'/>
                        <div className={styles.nameAndEmail}>
                            <span>{firstName + ' ' + lastName}</span>
                            <span>{email}</span>
                        </div>
                    </div>
                    <div className={styles.creativeRating}>
                        <span className={styles.userScoreLabel}>Creative Rating </span>
                        <Rating
                            initialRating={rating}
                            fractions={2}
                            fullSymbol={<img src={`${constants.STATIC_IMAGES_PATH}star.png`} alt='star'/>}
                            placeholderSymbol={<img src={`${constants.STATIC_IMAGES_PATH}star.png`} alt='star'/>}
                            emptySymbol={<img src={`${constants.STATIC_IMAGES_PATH}star-outline.png`}
                                              alt='star-outline'/>}
                            readonly={true}
                        />
                    </div>
                </div>
                <div className={styles.responseConainer}>
                    {
                        contestType === constants.LOGO_CONTEST ?
                            <img onClick={() => changeShowImage({imagePath: data.fileName, isShowOnFull: true})}
                                 className={styles.responseLogo}
                                 src={`${constants.publicURL}${data.fileName}`} alt='logo'/>
                            :
                            <span className={styles.response}>{data.text}</span>
                    }
                    {data.User.id !== id && <Rating
                        fractions={2}
                        fullSymbol={<img src={`${constants.STATIC_IMAGES_PATH}star.png`} alt='star'/>}
                        placeholderSymbol={<img src={`${constants.STATIC_IMAGES_PATH}star.png`} alt='star'/>}
                        emptySymbol={<img src={`${constants.STATIC_IMAGES_PATH}star-outline.png`} alt='star'/>}
                        onClick={changeMarkFunc}
                        placeholderRating={data.mark}
                    />}
                </div>
                {role !== constants.CREATOR && <i onClick={goChat} className="fas fa-comments"/>}
            </div>
            {needButtons(data.status) && <div className={styles.btnsContainer}>
                <div onClick={resolveOffer} className={styles.resolveBtn}>Resolve</div>
                <div onClick={rejectOffer} className={styles.rejectBtn}>Reject</div>
            </div>}
        </div>
    )
};

const mapDispatchToProps = (dispatch) => ({
    changeMark: (data) => dispatch(changeMark(data)),
    clearError: () => dispatch(clearChangeMarkError()),
    goToExpandedDialog: (data) => dispatch(goToExpandedDialog(data)),
    changeShowImage: (data) => dispatch(changeShowImage(data))
});

const mapStateToProps = (state) => {
    const {changeMarkError, isShowModal} = state.contestByIdStore;
    const {id, role} = state.userStore.data;
    const {messagesPreview} = state.chatStore;
    return {changeMarkError, id, role, messagesPreview, isShowModal};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OfferBox));
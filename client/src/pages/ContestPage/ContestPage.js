import React from 'react';
import {
    getContestById,
    setOfferStatus,
    clearSetOfferStatusError,
    goToExpandedDialog,
    changeEditContest,
    changeContestViewMode,
    changeShowImage
} from '../../actions/actionCreator';
import {connect} from 'react-redux';
import Header from "../../components/Header/Header";
import ContestSideBar from '../../components/ContestSideBar/ContestSideBar';
import styles from './ContestPage.module.sass';
import OfferBox from '../../components/OfferBox/OfferBox';
import OfferForm from '../../components/OfferForm/OfferForm';
import constants from '../../constants/constants';
import Brief from '../../components/Brief/Brief';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import LightBox from 'react-image-lightbox';
import Spinner from '../../components/Spinner/Spinner';
import TryAgain from '../../components/TryAgain/TryAgain';
import 'react-image-lightbox/style.css';
import Error from "../../components/Error/Error";

class ContestPage extends React.Component {

    componentWillUnmount() {
        this.props.changeEditContest(false);
    }

    componentDidMount() {
        this.getData();
        this.props.changeContestViewMode(true);
    }

    getData = () => {
        const {params} = this.props.match;
        this.props.getData({contestId: params.id});
    };

    setOffersList = () => {
        const array = [];
        for (let i = 0; i < this.props.contestByIdStore.offers.length; i++) {
            array.push(<OfferBox data={this.props.contestByIdStore.offers[i]}
                                 key={this.props.contestByIdStore.offers[i].id} needButtons={this.needButtons}
                                 setOfferStatus={this.setOfferStatus}
                                 contestType={this.props.contestByIdStore.contestData.contestType} date={new Date()}/>)
        }
        return array.length !== 0 ? array : <div className={styles.notFound}>There is no suggestion at this moment</div>
    };

    needButtons = (offerStatus) => {
        const contestCreatorId = this.props.contestByIdStore.contestData.User.id;
        const userId = this.props.userStore.data.id;
        const contestStatus = this.props.contestByIdStore.contestData.status;
        return (contestCreatorId === userId && contestStatus === constants.CONTEST_STATUS_ACTIVE && offerStatus === constants.OFFER_STATUS_PENDING);
    };

    setOfferStatus = (creatorId, offerId, command) => {
        this.props.clearSetOfferStatusError();
        const {id, orderId, priority} = this.props.contestByIdStore.contestData;
        const obj = {
            command,
            offerId,
            creatorId,
            orderId,
            priority,
            contestId: id
        };
        this.props.setOfferStatus(obj);
    };

    findConversationInfo = (interlocutorId) => {
        const {messagesPreview} = this.props.chatStore;
        const {id} = this.props.userStore.data;
        const participants = [id, interlocutorId];
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

    goChat = () => {
        const {User} = this.props.contestByIdStore.contestData;
        this.props.goToExpandedDialog({
            interlocutor: User,
            conversationData: this.findConversationInfo(User.id)
        });
    };

    render() {
        const {role} = this.props.userStore.data;
        const {contestByIdStore, changeShowImage, changeContestViewMode, clearSetOfferStatusError} = this.props;
        const {isShowOnFull, imagePath, error, isFetching, isBrief, contestData, offers, setOfferStatusError} = contestByIdStore;
        return (
            <div>
                {isShowOnFull && <LightBox
                    mainSrc={`${constants.publicURL}${imagePath}`}
                    onCloseRequest={() => changeShowImage({isShowOnFull: false, imagePath: null})}
                />}
                <Header/>
                {error && <div className={styles.tryContainer}><TryAgain getData={this.getData}/></div>}
                {!error && isFetching && <div className={styles.containerSpinner}>
                    <Spinner/>
                </div>}
                {!error && !isFetching && contestData && (<div className={styles.mainInfoContainer}>
                    <div className={styles.infoContainer}>
                        <div className={styles.buttonsContainer}>
                        <span onClick={() => changeContestViewMode(true)}
                              className={classNames(styles.btn, {[styles.activeBtn]: isBrief})}>Brief</span>
                            {
                                (offers.length > 0 && role !== constants.MODERATOR || role === constants.CREATOR) && <span onClick={() => changeContestViewMode(false)}
                                                                                                                           className={classNames(styles.btn, {[styles.activeBtn]: !isBrief})}>Offer</span>
                            }
                        </div>
                        {
                            isBrief ?
                                <Brief contestData={contestData} role={role} goChat={this.goChat}/>
                                :
                                <div className={styles.offersContainer}>
                                    {(role === constants.CREATOR && contestData.status === constants.CONTEST_STATUS_ACTIVE) &&
                                    <OfferForm contestType={contestData.contestType}
                                               contestId={contestData.id}
                                               customerId={contestData.User.id}/>}
                                    {setOfferStatusError && <Error error={setOfferStatusError} clearError={clearSetOfferStatusError}/>}
                                    <div className={styles.offers}>
                                        {this.setOffersList()}
                                    </div>
                                </div>}
                    </div>
                    <ContestSideBar contestData={contestData}
                                    totalEntries={offers.length}/>
                </div>)}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const {contestByIdStore, userStore, chatStore} = state;
    return {contestByIdStore, userStore, chatStore};
};

const mapDispatchToProps = (dispatch) => ({
    getData: (data) => dispatch(getContestById(data)),
    setOfferStatus: (data) => dispatch(setOfferStatus(data)),
    clearSetOfferStatusError: () => dispatch(clearSetOfferStatusError()),
    goToExpandedDialog: (data) => dispatch(goToExpandedDialog(data)),
    changeEditContest: (data) => dispatch(changeEditContest(data)),
    changeContestViewMode: (data) => dispatch(changeContestViewMode(data)),
    changeShowImage: data => dispatch(changeShowImage(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ContestPage);
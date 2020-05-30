import React, {useEffect} from "react";
import TryAgain from '../../components/TryAgain/TryAgain';
import {connect} from 'react-redux';
import {
    getOffersForModeratorRequest,
    moderateOfferResolveRequest,
    moderateOfferRejectRequest,
    clearOffersList,
    setNewOffersModerationFilter,
    changeShowImage,
} from '../../actions/actionCreator.js';
import ModeratorFilter from "../ModeratorFilter";
import styles from "./OffersModerationSpace.module.sass";
import InfinityScrollListContainer from "../InfinityScrollListContainer";
import LightBox from "react-image-lightbox";
import 'react-image-lightbox/style.css';
import constants from "../../constants";
import ModeratorOfferBox from "../ModeratorOfferBox";

const OffersModerationSpace = ({offers, isFetching, moderateActionIsFetching, error, haveMore, filter, getOffers, clearOffers, resolveOffer, rejectOffer, setNewOffersModerationFilter, isShowOnFull, changeShowImage, imagePath}) => {

    useEffect(() => {
        getOffers(filter);
    }, []);

    const loadMore = (startFrom) => {
        getOffers({
            limit: 8,
            offset: startFrom,
            moderationStatus: filter.moderationStatus,
        })
    };

    const tryToGetOffersAgain = () => {
        clearOffers();
        getOffers(filter);
    };

    const renderOffers = () => (
        [...offers.values()].map(offer => <ModeratorOfferBox isFetching={moderateActionIsFetching} key={offer.id} {...offer} changeShowImage={changeShowImage}
                                                             resolveOffer={resolveOffer} rejectOffer={rejectOffer}/>)
    );

    return (
        <>
            {
                isShowOnFull && <LightBox
                    mainSrc={`${constants.publicURL}${imagePath}`}
                    onCloseRequest={() => changeShowImage({isShowOnFull: false, imagePath: null})}/>
            }
            <ModeratorFilter filter={filter} setNewFilter={setNewOffersModerationFilter}/>
            <div className={styles.offersContainer}>
                {
                    error
                        ? <TryAgain getData={tryToGetOffersAgain}/>
                        : <InfinityScrollListContainer isFetching={isFetching} loadMore={loadMore} haveMore={haveMore}>
                            {
                                renderOffers()
                            }
                        </InfinityScrollListContainer>
                }
            </div>
        </>
    );
};

const mapStateToProps = state => state.moderationOffersStore;

const mapDispatchToProps = dispatch => ({
    getOffers: filter => dispatch(getOffersForModeratorRequest(filter)),
    clearOffers: () => dispatch(clearOffersList()),
    resolveOffer: id => dispatch(moderateOfferResolveRequest(id)),
    rejectOffer: id => dispatch(moderateOfferRejectRequest(id)),
    setNewOffersModerationFilter: filter => dispatch(setNewOffersModerationFilter(filter)),
    changeShowImage: data => dispatch(changeShowImage(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OffersModerationSpace);
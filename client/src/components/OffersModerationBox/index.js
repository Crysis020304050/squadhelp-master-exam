import React, {useEffect} from "react";
import TryAgain from '../../components/TryAgain/TryAgain';
import {connect} from 'react-redux';
import {
    getOffersForModeratorRequest,
    moderateOffersResolveRequest,
    moderateOffersRejectRequest,
    clearOffersList,
    setNewOffersModerationFilter,
} from '../../actions/actionCreator.js';
import PropTypes from 'prop-types';
import ModeratorFilter from "../ModeratorFilter";
import styles from "./OffersModerationBox.module.sass";
import InfinityScrollListContainer from "../InfinityScrollListContainer";

const OffersModerationBox = ({offers, isFetching, error, haveMore, filter, getOffers, clearOffers, history, resolveOffer, rejectOffer, setNewOffersModerationFilter}) => {

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
        [...offers.values()].map(offer => null)
    );

    return (
        <>
            <ModeratorFilter filter={filter} setNewFilter={setNewOffersModerationFilter}/>
           {/* <div className={styles.offersContainer}>
                {
                    error
                        ? <TryAgain getData={tryToGetOffersAgain}/>
                        : <InfinityScrollListContainer isFetching={isFetching} loadMore={loadMore} haveMore={haveMore}>
                            {
                                renderOffers()
                            }
                        </InfinityScrollListContainer>
                }
            </div>*/}
        </>
    );
};

const mapStateToProps = state => state.moderationOffersStore;

const mapDispatchToProps = dispatch => ({
    getOffers: (filter) => dispatch(getOffersForModeratorRequest(filter)),
    clearOffers: () => dispatch(clearOffersList()),
    resolveOffer: (id) => dispatch(moderateOffersResolveRequest(id)),
    rejectOffer: (id) => dispatch(moderateOffersRejectRequest(id)),
    setNewOffersModerationFilter: filter => dispatch(setNewOffersModerationFilter(filter)),
});

OffersModerationBox.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(OffersModerationBox);
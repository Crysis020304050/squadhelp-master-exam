import React, {useEffect} from "react";
import TryAgain from '../../components/TryAgain/TryAgain';
import {connect} from 'react-redux';
import {
    getContestsForModeratorRequest,
    moderateContestResolveRequest,
    moderateContestRejectRequest,
    clearContestList,
    setNewContestsModerationFilter,
} from '../../actions/actionCreator.js';
import ContestBox from "../ContestBox/ContestBox";
import InfinityScrollListContainer from "../InfinityScrollListContainer";
import constants from "../../constants";
import PropTypes from 'prop-types';
import ModeratorFilter from "../ModeratorFilter";
import styles from "./ContestsModerationSpace.module.sass";

const ContestsModerationSpace = ({contests, isFetching, error, haveMore, filter, getContests, clearContests, history, resolveContest, rejectContest, setNewContestsModerationFilter}) => {

    useEffect(() => {
        getContests(filter);
    }, []);

    const loadMore = (startFrom) => {
        getContests({
            limit: 8,
            offset: startFrom,
            moderationStatus: filter.moderationStatus,
        })
    };

    const tryToGetContestsAgain = () => {
        clearContests();
        getContests(filter);
    };

    const renderContests = () => (
        [...contests.values()].map(contest => <ContestBox key={contest.id}
                                                          history={history}
                                                          data={contest}
                                                          role={constants.MODERATOR}
                                                          resolveContest={resolveContest}
                                                          rejectContest={rejectContest}
                                                          isFetching={isFetching}/>)
    );

    return (
        <>
            <ModeratorFilter filter={filter} setNewFilter={setNewContestsModerationFilter}/>
            <div className={styles.contestsContainer}>
                {
                    error
                        ? <TryAgain getData={tryToGetContestsAgain}/>
                        : <InfinityScrollListContainer isFetching={isFetching} loadMore={loadMore} haveMore={haveMore}>
                            {
                                renderContests()
                            }
                        </InfinityScrollListContainer>
                }
            </div>
        </>
    );
};

const mapStateToProps = state => state.moderationContestsStore;

const mapDispatchToProps = dispatch => ({
    getContests: (filter) => dispatch(getContestsForModeratorRequest(filter)),
    clearContests: () => dispatch(clearContestList()),
    resolveContest: (id) => dispatch(moderateContestResolveRequest(id)),
    rejectContest: (id) => dispatch(moderateContestRejectRequest(id)),
    setNewContestsModerationFilter: filter => dispatch(setNewContestsModerationFilter(filter)),
});

ContestsModerationSpace.propTypes = {
    history: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContestsModerationSpace);
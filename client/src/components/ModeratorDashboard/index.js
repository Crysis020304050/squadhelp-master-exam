import React, {useEffect} from "react";
import styles from './ModeratorDashboard.module.sass';
import TryAgain from '../../components/TryAgain/TryAgain';
import {connect} from 'react-redux';
import {
    getContestsForModeratorRequest,
    moderateContestResolveRequest,
    moderateContestRejectRequest,
    clearContestList
} from '../../actions/actionCreator.js';
import ContestBox from "../ContestBox/ContestBox";
import ContestsContainer from "../ContestsContainer/ContestsContainer";
import ModeratorFilter from "../ModeratorFilter";
import constants from "../../constants";

const ModeratorDashboard = ({contests, isFetching, error, haveMore, filter, getContests, clearContests, history, resolveContest, rejectContest}) => {

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
                                                          rejectContest={rejectContest}/>)
    );

    return (
        <div className={styles.mainContainer}>
            <ModeratorFilter filter={filter}/>
            <div className={styles.contestsContainer}>
                {
                    error
                        ? <TryAgain getData={tryToGetContestsAgain}/>
                        : <ContestsContainer isFetching={isFetching} loadMore={loadMore} haveMore={haveMore}>
                            {
                                renderContests()
                            }
                        </ContestsContainer>
                }
            </div>
        </div>
    );
};

const mapStateToProps = state => state.moderationStore;

const mapDispatchToProps = dispatch => ({
    getContests: (filter) => dispatch(getContestsForModeratorRequest(filter)),
    clearContests: () => dispatch(clearContestList()),
    resolveContest: (id) => dispatch(moderateContestResolveRequest(id)),
    rejectContest: (id) => dispatch(moderateContestRejectRequest(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModeratorDashboard);
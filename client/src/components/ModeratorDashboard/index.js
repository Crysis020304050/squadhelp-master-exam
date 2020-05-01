import React, {useEffect} from "react";
import styles from './ModeratorDashboard.module.sass';
import TryAgain from '../../components/TryAgain/TryAgain';
import {connect} from 'react-redux';
import {
    getContestsForModeratorRequest,
    moderateContestResolveRequest,
    moderateContestRejectRequest,
    setNewModeratorFilter,
    clearContestList
} from '../../actions/actionCreator.js';
import ContestBox from "../ContestBox/ContestBox";
import ContestsContainer from "../ContestsContainer/ContestsContainer";

const ModeratorDashboard = ({contests, isFetching, error, haveMore, filter, getContests, clearContests, history}) => {

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
        [...contests.values()].map(contest => <ContestBox key={contest.id} history={history} data={contest}/>)
    );

    return (
        <div>
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
    );
};

const mapStateToProps = state => state.moderationStore;

const mapDispatchToProps = dispatch => ({
    getContests: (filter) => dispatch(getContestsForModeratorRequest(filter)),
    clearContests: () => dispatch(clearContestList()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModeratorDashboard);
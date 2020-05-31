import React from 'react';
import {connect} from 'react-redux';
import {getContestsForCustomer, clearContestList, setNewCustomerFilter} from '../../actions/actionCreator';
import constants from '../../constants/constants';
import InfinityScrollListContainer from '../../components/InfinityScrollListContainer';
import ContestBox from "../ContestBox/ContestBox";
import styles from './CustomerDashboard.module.sass';
import classNames from 'classnames';
import TryAgain from '../../components/TryAgain/TryAgain';
import PropTypes from 'prop-types';


class CustomerDashboard extends React.Component {

    loadMore = (startFrom) => {
        this.props.getContests({
            limit: 8,
            offset: startFrom,
            contestStatus: this.props.customerFilter
        });
    };

    componentDidMount() {
        this.getContests();
    }

    getContests = () => {
        this.props.getContests({limit: 8, contestStatus: this.props.customerFilter});
    };


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.customerFilter !== prevProps.customerFilter) {
            this.getContests();
        }
    }

    setContestList = () => {
        const array = [];
        const {contests} = this.props;
        for (let i = 0; i < contests.length; i++) {
            array.push(<ContestBox key={contests[i].id} data={contests[i]} history={this.props.history}/>)
        }
        return array;
    };

    componentWillUnmount() {
        this.props.clearContestsList();
    }


    tryToGetContest = () => {
        this.props.clearContestsList();
        this.getContests();
    };

    render() {
        const {error, haveMore} = this.props;
        const {customerFilter} = this.props;
        return (
            <div className={styles.mainContainer}>
                <div className={styles.filterContainer}>
                    <div onClick={() => this.props.newFilter(constants.CONTEST_STATUS_ACTIVE)}
                         className={classNames(styles.filter, {
                             [styles.activeFilter]: constants.CONTEST_STATUS_ACTIVE === customerFilter,
                         })}>Active Contests
                    </div>
                    <div onClick={() => this.props.newFilter(constants.CONTEST_STATUS_FINISHED)}
                         className={classNames(styles.filter, {
                             [styles.activeFilter]: constants.CONTEST_STATUS_FINISHED === customerFilter,
                         })}>Completed contests
                    </div>
                    <div onClick={() => this.props.newFilter(constants.CONTEST_STATUS_PENDING)}
                         className={classNames(styles.filter, {
                             [styles.activeFilter]: constants.CONTEST_STATUS_PENDING === customerFilter,
                         })}>Inactive contests
                    </div>
                </div>
                <div className={styles.contestsContainer}>
                    {
                        error ?
                            <TryAgain getData={this.tryToGetContest()}/>
                            :
                            <InfinityScrollListContainer isFetching={this.props.isFetching}
                                               loadMore={this.loadMore}
                                               haveMore={haveMore}>
                                {this.setContestList()}
                            </InfinityScrollListContainer>
                    }
                </div>
            </div>

        );
    }
}


const mapStateToProps = (state) => {
    return state.contestsList;
};

const mapDispatchToProps = (dispatch) => {
    return {
        getContests: (data) => dispatch(getContestsForCustomer(data)),
        clearContestsList: () => dispatch(clearContestList()),
        newFilter: (filter) => dispatch(setNewCustomerFilter(filter))
    }
};

CustomerDashboard.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDashboard);
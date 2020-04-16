import React, {useEffect} from 'react';
import Header from '../../components/Header/Header';
import {connect} from 'react-redux';
import styles from './TransactionsPage.module.sass';
import TransactionsTable from '../../components/TransactionsTable';
import {getUserTransactionsHistoryRequest, getUserTransactionsStatementRequest} from "../../actions/actionCreator";
import SpinnerLoader from "../../components/Spinner/Spinner";

const TransactionsPage = ({isFetching, getUserTransactionsHistory, getUserTransactionStatement}) => {

    useEffect(() => {
        getUserTransactionsHistory();
        getUserTransactionStatement();
    }, []);

    return (
        <div>
            <Header/>
            <div className={styles.container}>
                {
                    isFetching ? <SpinnerLoader/> : <TransactionsTable/>
                }
            </div>
        </div>
    )
};

const mapStateToProps = state => state.transactionsStore;

const mapDispatchToProps = dispatch => ({
    getUserTransactionsHistory: () => dispatch(getUserTransactionsHistoryRequest()),
    getUserTransactionStatement: () => dispatch(getUserTransactionsStatementRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsPage);
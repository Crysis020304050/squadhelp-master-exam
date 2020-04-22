import React, {useEffect} from 'react';
import Header from '../../components/Header/Header';
import {connect} from 'react-redux';
import styles from './TransactionsPage.module.sass';
import TransactionsTable from '../../components/TransactionsTable';
import {getUserTransactionsHistoryRequest, getUserTransactionsStatementRequest, clearTransactionsStoreError} from "../../actions/actionCreator";
import SpinnerLoader from "../../components/Spinner/Spinner";
import Error from "../../components/Error/Error";

const TransactionsPage = ({isFetching, error, getUserTransactionsHistory, getUserTransactionStatement, clearError}) => {

    useEffect(() => {
        getUserTransactionsHistory();
        getUserTransactionStatement();
    }, []);

    return (
        <div>
            <Header/>
            <div className={styles.container}>
                {error && <Error data={error.data} status={error.status} clearError={clearError}/>}
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
    clearError: () => dispatch(clearTransactionsStoreError()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsPage);
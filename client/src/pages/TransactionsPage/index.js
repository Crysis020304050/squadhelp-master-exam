import React, {useEffect} from 'react';
import Header from '../../components/Header/Header';
import {connect} from 'react-redux';
import styles from './TransactionsPage.module.sass';
import TransactionsTable from '../../components/TransactionsTable';
import {getUserTransactionsHistoryRequest, getUserTransactionsStatementRequest, clearTransactionsStoreError} from "../../actions/actionCreator";
import SpinnerLoader from "../../components/Spinner/Spinner";
import Error from "../../components/Error/Error";
import constants from "../../constants/constants";
import history from "../../browserHistory";

const TransactionsPage = ({transactionsStore: {isFetching, error, clearError}, data, getUserTransactionsHistory, getUserTransactionStatement,}) => {

    useEffect(() => {
        if (!data || data.role === constants.CUSTOMER) {
            history.replace('/');
        } else {
            getUserTransactionsHistory();
            getUserTransactionStatement();
        }
    }, []);

    return (
        <div>
            <Header/>
            <div className={styles.container}>
                {error && <Error error={error} clearError={clearError}/>}
                {
                    isFetching ? <SpinnerLoader/> : <TransactionsTable/>
                }
            </div>
        </div>
    )
};

const mapStateToProps = state => {
    const {transactionsStore, userStore: {data}} = state;
    return {transactionsStore, data};
};

const mapDispatchToProps = dispatch => ({
    getUserTransactionsHistory: () => dispatch(getUserTransactionsHistoryRequest()),
    getUserTransactionStatement: () => dispatch(getUserTransactionsStatementRequest()),
    clearError: () => dispatch(clearTransactionsStoreError()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsPage);
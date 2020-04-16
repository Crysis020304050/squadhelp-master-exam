import React, {useEffect} from "react";
import styles from './TransactionTable.module.sass';
import constants from "../../constants";
import {connect} from 'react-redux';

const TransactionsTable = ({transactionHistory, transactionStatement}) => {

    const renderTransactionsHistory = transactions => {
        return transactions.map(({id, typeOperation, sum}) => (
            <tr key={id}>
                <td>{id}</td>
                <td>{typeOperation === constants.INCOME_TRANSACTION ? 'Income' : 'Consumption'}</td>
                <td>{typeOperation === constants.INCOME_TRANSACTION ? sum : `-${sum}`}</td>
            </tr>
        ))
    };

    const renderTransactionsStatement = statement => {
        return Object.entries(statement).map(([typeOperation, sum], index) => (
            <tr key={index}>
                <th>Total</th>
                <td>{typeOperation === constants.INCOME_TRANSACTION ? 'Income' : 'Consumption'}</td>
                <td>{typeOperation === constants.INCOME_TRANSACTION ? (sum || 0) : (sum ? `-${sum}`: 0)}</td>
            </tr>
        ))
    };

    return (
        <table className={styles.table}>
            <tr>
                <th>Transaction ID</th>
                <th>Income/Consumption</th>
                <th>Sum</th>
            </tr>
            {
                transactionHistory && renderTransactionsHistory(transactionHistory)
            }
            {
                transactionStatement && renderTransactionsStatement(transactionStatement)
            }
        </table>
    )
};

const mapStateToProps = state => state.transactionsStore;

export default connect(mapStateToProps)(TransactionsTable);
import React from "react";
import styles from './TransactionTable.module.sass';
import constants from "../../constants/constants";
import {connect} from 'react-redux';
import money from 'money-math';

const TransactionsTable = ({transactionHistory, transactionStatement}) => {

    const renderTransactionsHistory = transactions => (
        transactions.map(({id, typeOperation, sum}) => {
            const sumToMoney = money.floatToAmount(sum);
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{typeOperation === constants.INCOME_TRANSACTION ? 'Income' : 'Consumption'}</td>
                    <td>{typeOperation === constants.INCOME_TRANSACTION ? sumToMoney : `-${sumToMoney}`}</td>
                </tr>
            );
        })
    );

    const renderTransactionsStatement = statement => (
        statement.map(({typeOperation, sum}, index) => {
            const sumToMoney = money.floatToAmount(sum);
            return (
                <tr key={index}>
                    <th>Total</th>
                    <td>{typeOperation === constants.INCOME_TRANSACTION ? 'Income' : 'Consumption'}</td>
                    <td>{typeOperation === constants.INCOME_TRANSACTION ? (sum ? sumToMoney : '0.00') : (sum ? `-${sumToMoney}` : '0.00')}</td>
                </tr>
            );
        })
    );

    return (
        <table className={styles.table}>
            <tbody>
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
            </tbody>
        </table>
    )
};

const mapStateToProps = state => state.transactionsStore;

export default connect(mapStateToProps)(TransactionsTable);
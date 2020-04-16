import React from "react";
import styles from './TransactionTable.module.sass';
import constants from "../../constants";

const transactions = [
    {
        id: 1,
        type: constants.INCOME_TRANSACTION,
        sum: '100$',
    },
    {
        id: 2,
        type: constants.INCOME_TRANSACTION,
        sum: '200$',
    },
    {
        id: 3,
        type: constants.CONSUMPTION_TRANSACTION,
        sum: '500$',
    },
    {
        id: 4,
        type: constants.INCOME_TRANSACTION,
        sum: '1500$',
    },
    {
        id: 5,
        type: constants.CONSUMPTION_TRANSACTION,
        sum: '400$',
    },
];

const TransactionsTable = props => {

    const renderTransactions = transactions => {
        return transactions.map(({id, type, sum}) => (
            <tr>
                <td>{id}</td>
                <td>{type === constants.INCOME_TRANSACTION ? 'Income' : 'Consumption'}</td>
                <td>{type === constants.INCOME_TRANSACTION ? sum : `-${sum}`}</td>
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
                renderTransactions(transactions)
            }
        </table>
    )
};

export default TransactionsTable;
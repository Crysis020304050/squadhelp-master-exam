import React from "react";
import styles from './TransactionTable.module.sass';

const transactions = [
    {
        id: 1,
        isIncome: true,
        sum: '100$',
    },
    {
        id: 2,
        isIncome: true,
        sum: '200$',
    },
    {
        id: 3,
        isIncome: false,
        sum: '500$',
    },
    {
        id: 4,
        isIncome: true,
        sum: '1500$',
    },
    {
        id: 5,
        isIncome: false,
        sum: '400$',
    },
];

const TransactionsTable = props => {

    const renderTransactions = transactions => {
      return transactions.map(({id, isIncome, sum}) => (
          <tr>
              <td>{id}</td>
              <td>{isIncome ? 'Income' : 'Expense'}</td>
              <td>{isIncome ? sum : `-${sum}`}</td>
          </tr>
      ))
    };

    return (
        <table className={styles.table}>
            <tr>
                <th>Transaction ID</th>
                <th>Income/Expense</th>
                <th>Sum</th>
            </tr>
            {
                renderTransactions(transactions)
            }
        </table>
    )
};

export default TransactionsTable;
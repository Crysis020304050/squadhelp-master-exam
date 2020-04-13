import React from 'react';
import Header from '../../components/Header/Header';
import {connect} from 'react-redux';
import styles from './TransactionsPage.module.sass';
import classNames from 'classnames';
import TransactionsTable from "../../components/TransactionsTable";

const TransactionsPage = (props) => {

    console.dir(props);

    return (
        <div>
            <Header/>
            <div className={styles.container}>
                <TransactionsTable/>
            </div>
        </div>
    )
};

const mapStateToProps = (state) => state.userStore;


export default connect(mapStateToProps)(TransactionsPage);
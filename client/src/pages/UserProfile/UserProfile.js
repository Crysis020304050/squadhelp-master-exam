import React from 'react';
import Header from '../../components/Header/Header';
import {connect} from 'react-redux';
import styles from './UserProfile.module.sass';
import constants from '../../constants/constants';
import UserInfo from '../../components/UserInfo/UserInfo';
import PayForm from '../../components/PayForm/PayForm';
import classNames from 'classnames';
import {cashOut, changeProfileModeView, clearPaymentStore} from '../../actions/actionCreator';
import Error from '../../components/Error/Error';

const UserProfile = (props) => {
    const pay = (values) => {
        const {number, expiry, cvc, sum} = values;
        props.cashOut({number, expiry, cvc, sum});
    };

    const {balance, role, profileModeView, changeProfileModeView, error, clearPaymentStore} = props;
    return (
        <div>
            <Header/>
            <div className={styles.mainContainer}>
                <div className={styles.aside}>
                    <span className={styles.headerAside}>Select Option</span>
                    <div className={styles.optionsContainer}>
                        <div
                            className={classNames(styles.optionContainer, {[styles.currentOption]: profileModeView === constants.USER_INFO_MODE})}
                            onClick={() => changeProfileModeView(constants.USER_INFO_MODE)}>UserInfo
                        </div>
                        {role === constants.CREATOR && <div
                            className={classNames(styles.optionContainer, {[styles.currentOption]: profileModeView === constants.CASHOUT_MODE})}
                            onClick={() => changeProfileModeView(constants.CASHOUT_MODE)}>Cashout</div>}
                    </div>
                </div>
                {
                    profileModeView === constants.USER_INFO_MODE ?
                        <UserInfo/>
                        :
                        <div className={styles.container}>
                            {parseInt(balance) === 0 ?
                                <span className={styles.notMoney}>There is no money on your balance</span>
                                :
                                <div>
                                    {error &&
                                    <Error error={error} clearError={clearPaymentStore}/>}
                                    <PayForm sendRequest={pay}/>
                                </div>
                            }
                        </div>
                }
            </div>
        </div>
    )
};

const mapStateToProps = (state) => {
    const {balance, role} = state.userStore.data;
    const {profileModeView} = state.userProfile;
    const {error} = state.payment;
    return {balance, role, profileModeView, error}
};

const mapDispatchToProps = (dispatch) => {
    return {
        cashOut: (data) => dispatch(cashOut(data)),
        changeProfileModeView: (data) => dispatch(changeProfileModeView(data)),
        clearPaymentStore: () => dispatch(clearPaymentStore())
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
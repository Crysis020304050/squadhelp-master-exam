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
import money from 'money-math';

const UserProfile = ({balance, role, profileModeView, changeProfileModeView, error, clearPaymentStore, cashOut}) => {

    const {USER_INFO_MODE, CREATOR, CASHOUT_MODE} = constants;

    const onPaySubmit = ({number, expiry, cvc, sum}) => cashOut({number, expiry, cvc, sum: money.floatToAmount(sum)});

    return (
        <div>
            <Header/>
            <div className={styles.mainContainer}>
                <div className={styles.aside}>
                    <span className={styles.headerAside}>Select Option</span>
                    <div className={styles.optionsContainer}>
                        <div
                            className={classNames(styles.optionContainer, {[styles.currentOption]: profileModeView === USER_INFO_MODE})}
                            onClick={() => changeProfileModeView(USER_INFO_MODE)}>UserInfo
                        </div>
                        {role === CREATOR && <div
                            className={classNames(styles.optionContainer, {[styles.currentOption]: profileModeView === CASHOUT_MODE})}
                            onClick={() => changeProfileModeView(CASHOUT_MODE)}>Cashout</div>}
                    </div>
                </div>
                {
                    profileModeView === USER_INFO_MODE ?
                        <UserInfo/>
                        :
                        <div className={styles.container}>
                            {money.isZero(balance) ?
                                <span className={styles.notMoney}>There is no money on your balance</span>
                                :
                                <div>
                                    {error &&
                                    <Error error={error} clearError={clearPaymentStore}/>}
                                    <PayForm onSubmit={onPaySubmit}/>
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

const mapDispatchToProps = (dispatch) => ({
    cashOut: (data) => dispatch(cashOut(data)),
    changeProfileModeView: (data) => dispatch(changeProfileModeView(data)),
    clearPaymentStore: () => dispatch(clearPaymentStore())
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
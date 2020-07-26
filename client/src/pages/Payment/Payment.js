import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {payRequest, clearPaymentStore} from '../../actions/actionCreator';
import PayForm from '../../components/PayForm/PayForm';
import styles from './Payment.module.sass';
import isEmpty from 'lodash/isEmpty';
import constants from '../../constants/constants';
import Error from '../../components/Error/Error';
import Logo from "../../components/Logo";
import {Link} from "react-router-dom";
import money from 'money-math';

const Payment = ({contestStore: {contests}, pay, history, payment: {error}, clearPaymentStore}) => {

    useEffect(() => {
        if (isEmpty(contests)) {
            history.replace('startContest');
        }
    }, [contests]);

    const price = (() => {
        const {ONE_CONTEST_PRICE, TWO_CONTESTS_PRICE, THREE_CONTESTS_PRICE} = constants;
        switch (Object.keys(contests).length) {
            case 1: {
                return ONE_CONTEST_PRICE;
            }
            case 2: {
                return TWO_CONTESTS_PRICE;
            }
            case 3: {
                return THREE_CONTESTS_PRICE;
            }
            default: {
                return undefined;
            }
        }
    })();

    const onSubmit = ({number, expiry, cvc}) => {
        const contestArray = Object.values(contests);
        const data = new FormData();
        for (let i = 0; i < contestArray.length; i++) {
            data.append('files', contestArray[i].file);
            contestArray[i].haveFile = !!contestArray[i].file;
        }
        data.append('number', number);
        data.append('expiry', expiry);
        data.append('cvc', cvc);
        data.append('contests', JSON.stringify(contestArray));
        data.append('price', money.floatToAmount(price));
        pay({
            formData: data
        });
    };

    return (
        <div>
            <div className={styles.header}>
                <Logo/>
            </div>
            <div className={styles.mainContainer}>
                <div className={styles.paymentContainer}>
                    <span className={styles.headerLabel}>Checkout</span>
                    {error && <Error error={error} clearError={clearPaymentStore}/>}
                    <PayForm price={price} onSubmit={onSubmit} goBack={() => history.goBack()} isPayForOrder={true}/>
                </div>
                <div className={styles.orderInfoContainer}>
                    <span className={styles.orderHeader}>Order Summary</span>
                    <div className={styles.packageInfoContainer}>
                        <span
                            className={styles.packageName}>{`Package Name: ${price === constants.ONE_CONTEST_PRICE ? 'Standard' : `Multi X${Object.keys(contests).length}`}`}</span>
                        <span className={styles.packagePrice}>{`${price} USD`}</span>
                    </div>
                    <div className={styles.resultPriceContainer}>
                        <span>Total:</span>
                        <span>{`${price} USD`}</span>
                    </div>
                    <Link to={'/'}>Have a promo code?</Link>
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = (state) => ({
    payment: state.payment,
    contestStore: state.contestStore
});

const mapDispatchToProps = (dispatch) => ({
    pay: (data) => dispatch(payRequest(data)),
    clearPaymentStore: () => dispatch(clearPaymentStore())
});

export default connect(mapStateToProps, mapDispatchToProps)(Payment);


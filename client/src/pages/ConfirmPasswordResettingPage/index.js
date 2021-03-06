import React, {useEffect} from "react";
import styles from './ConfirmPasswordResettingPage.module.sass';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import {confirmResettingPasswordRequest, clearConfirmResettingPasswordError} from '../../actions/actionCreator';
import Error from "../../components/Error/Error";
import classNames from 'classnames';

const ConfirmPasswordResettingPage = ({match: {params: {token}}, error, confirmPasswordResetting, clearError, isFetching}) => {

    useEffect(() => {
        clearError()
    }, []);

    const onClickHandler = e => {
        if (!isFetching) {
            confirmPasswordResetting(token);
        }
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.contentContainer}>
                {error && <Error error={error} clearError={clearError}/>}
                <h2>Are you sure you want to reset the password?</h2>
                <div className={classNames(styles.choseAnswerContainer, {[styles.disabledButtons]: isFetching})}>
                    <div onClick={onClickHandler}>YES</div>
                    <Link to='/'>NO</Link>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => state.confirmPasswordResettingStore;

const mapDispatchToProps = dispatch => ({
    confirmPasswordResetting: (token) => dispatch(confirmResettingPasswordRequest(token)),
    clearError: () => dispatch(clearConfirmResettingPasswordError()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmPasswordResettingPage);

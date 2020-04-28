import React, {useEffect} from "react";
import styles from './ConfirmPasswordResettingPage.module.sass';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import {confirmResettingPasswordRequest, clearConfirmResettingPasswordError} from '../../actions/actionCreator';
import Error from "../../components/Error/Error";

const ConfirmPasswordResettingPage = ({match: {params: {token}}, error, confirmPasswordResetting, clearError}) => {

    useEffect(() => {
        clearError()
    }, []);

    const onClickHandler = e => {
        confirmPasswordResetting(token);
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.contentContainer}>
                {error && <Error data={error.data} status={error.status} clearError={clearError}/>}
                <h2>Are you sure you want to reset the password?</h2>
                <div className={styles.choseAnswerContainer}>
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

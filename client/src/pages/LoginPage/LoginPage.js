import React, {useEffect} from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import Logo from '../../components/Logo';
import styles from './LoginPage.module.sass';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {clearUserError} from '../../actions/actionCreator';
import constants from '../../constants/constants';
import Error from "../../components/Error/Error";

const LoginPage = ({error, isFetching, clearError}) => {

    useEffect(() => {
        if (error) {
            clearError();
        }
    }, []);

    return (
        <div className={ styles.mainContainer }>
            <div className={ styles.loginContainer }>
                <div className={ styles.headerSignUpPage }>
                    <Logo src={`${constants.STATIC_IMAGES_PATH}logo.png`}/>
                    <div className={ styles.linkLoginContainer }>
                        <Link to='/registration'>Signup</Link>
                    </div>
                </div>
                <div className={ styles.loginFormContainer }>
                    <h2>LOGIN TO YOUR ACCOUNT</h2>
                    { error && error.status !== 403 && error.status !== 404 && <Error error={error} clearError={ clearError }/> }
                    <LoginForm isFetching={isFetching} responseError={error}/>
                    <Link to='/resetPassword'>Forgot your password? Click here to reset</Link>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => state.userStore;

const mapDispatchToProps = (dispatch) => ({
  clearError: () => dispatch(clearUserError()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
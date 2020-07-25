import React, {useEffect} from "react";
import styles from './ResetPasswordPage.module.sass';
import {connect} from 'react-redux';
import Error from "../../components/Error/Error";
import {clearResetPasswordError} from "../../actions/actionCreator";
import ResetPasswordForm from "../../components/ResetPasswordForm";
import Logo from "../../components/Logo";
import constants from "../../constants/constants";
import {Link} from "react-router-dom";

const ResetPasswordPage = ({error, clearError, isFetching}) => {

    useEffect(() => {
        if (error) {
            clearError();
        }
    }, []);

    return (
      <div className={styles.mainContainer}>
          <header className={styles.pageHeaderContainer}>
              <Logo src={`${constants.STATIC_IMAGES_PATH}logo.png`}/>
              <div className={ styles.loginButton }>
                  <Link to='/login'>Login</Link>
              </div>
          </header>
          <div className={styles.resetPasswordFormContainer}>
              <h2>RESET YOUR PASSWORD</h2>
              {error && error.status !== 400 && error.status !== 404 && <Error error={error} clearError={clearError}/>}
              <ResetPasswordForm isFetching={isFetching} responseError={error}/>
          </div>
      </div>
    );
};

const mapStateToProps = state => state.resetPasswordStore;

const mapDispatchToProps = dispatch => ({
    clearError: () => dispatch(clearResetPasswordError()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordPage);



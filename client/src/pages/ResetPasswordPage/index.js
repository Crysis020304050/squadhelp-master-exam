import React from "react";
import styles from './ResetPasswordPage.module.sass';
import {connect} from 'react-redux';
import Error from "../../components/Error/Error";
import {clearResetPasswordError} from "../../actions/actionCreator";
import ResetPasswordForm from "../../components/ResetPasswordForm";
import Logo from "../../components/Logo";
import CONSTANTS from "../../constants";
import {Link} from "react-router-dom";

const ResetPasswordPage = ({error, clearError}) => {

    return (
      <div className={styles.mainContainer}>
          <header className={styles.pageHeaderContainer}>
              <Logo src={ `${ CONSTANTS.STATIC_IMAGES_PATH }logo.png` } alt="logo"/>
              <div className={ styles.loginButton }>
                  <Link to='/login'>Login</Link>
              </div>
          </header>
          <div className={styles.resetPasswordFormContainer}>
              <h2>RESET YOUR PASSWORD</h2>
              {error && <Error data={error.data} status={error.status} clearError={clearError}/>}
              <ResetPasswordForm/>
          </div>
      </div>
    );
};

const mapStateToProps = state => state.resetPasswordStore;

const mapDispatchToProps = dispatch => ({
    clearError: () => dispatch(clearResetPasswordError()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordPage);



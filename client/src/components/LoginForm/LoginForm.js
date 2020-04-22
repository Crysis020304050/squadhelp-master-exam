import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {authActionLogin, clearErrorSignUpAndLogin} from '../../actions/actionCreator';
import styles from './LoginForm.module.sass';
import {Field, reduxForm} from 'redux-form';
import customValidator from '../../validators/validator';
import Schems from '../../validators/validationSchems';
import FormField from "../FormField";

const LoginForm = ({handleSubmit, submitting, isFetching, loginRequest, clearError}) => {

    useEffect(() => {
        clearError();
    }, []);

    const clicked = (values) => {
        loginRequest(values);
    };

    const formInputClasses = {
        containerStyle: styles.inputContainer,
        className: styles.input,
        warningStyle: styles.fieldWarning,
        invalidStyle: styles.notValid,
        validStyle: styles.valid,
    };

    return (
        <div className={styles.loginForm}>
            <form onSubmit={handleSubmit(clicked)}>
                <Field
                    name='email'
                    {...formInputClasses}
                    component={FormField}
                    type='text'
                    label='Email Address'
                />
                <Field
                    name='password'
                    {...formInputClasses}
                    component={FormField}
                    type='password'
                    label='password'
                />
                <button type='submit' disabled={submitting}
                        className={styles.submitContainer}>
            <span className={styles.inscription}>{isFetching
                ? 'Submitting...'
                : 'LOGIN'}</span>
                </button>
            </form>
        </div>
    );
};


const mapStateToProps = state => state.auth;

const mapDispatchToProps = (dispatch) => (
    {
        loginRequest: (data) => dispatch(authActionLogin(data)),
        clearError: () => dispatch(clearErrorSignUpAndLogin()),
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'login',
    validate: customValidator(Schems.LoginSchem),
})(LoginForm));
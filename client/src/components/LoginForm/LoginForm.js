import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {authActionLogin, clearErrorSignUpAndLogin} from '../../actions/actionCreator';
import styles from './LoginForm.module.sass';
import {Field, reduxForm} from 'redux-form';
import FieldInput from '../FormField/FieldInput';
import customValidator from '../../validators/validator';
import Schems from '../../validators/validationSchems';
import FieldError from "../FormField/FieldError";

const LoginForm = props => {

    const {handleSubmit, submitting, isFetching, loginRequest, clearError} = props;

    useEffect(() => {
        clearError();
    }, []);

    const clicked = (values) => {
        loginRequest(values);
    };

    const formInputStyles = {
        inputStyles: styles.input,
        invalidStyles: styles.notValid,
        validStyles: styles.valid,
    };

    const renderField = (field) => (
        <label className={styles.inputContainer}>
            <FieldInput {...field} {...formInputStyles}/>
            <FieldError meta={field.meta} className={styles.fieldWarning}/>
        </label>
    );

    return (
        <div className={styles.loginForm}>
            <form onSubmit={handleSubmit(clicked)}>
                <Field
                    name='email'
                    component={renderField}
                    type='text'
                    label='Email Address'
                />
                <Field
                    name='password'
                    component={renderField}
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
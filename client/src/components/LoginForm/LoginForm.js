import React from 'react';
import {connect} from 'react-redux';
import {authActionRequest} from '../../actions/actionCreator';
import styles from './LoginForm.module.sass';
import {Field, reduxForm} from 'redux-form';
import customValidator from '../../validators/validator';
import Schems from '../../validators/validationSchems';
import FormField from "../FormField";
import PropTypes from 'prop-types';

const LoginForm = ({handleSubmit, isFetching, loginRequest}) => {

    const onSubmit = (values) => loginRequest(values);

    const formInputClasses = {
        containerStyle: styles.inputContainer,
        className: styles.input,
        warningStyle: styles.fieldWarning,
        invalidStyle: styles.notValid,
        validStyle: styles.valid,
    };

    return (
        <div className={styles.loginForm}>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                <button type='submit' disabled={isFetching}
                        className={styles.submitContainer}>
            <span className={styles.inscription}>{isFetching
                ? 'Submitting...'
                : 'LOGIN'}</span>
                </button>
            </form>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    loginRequest: (data) => dispatch(authActionRequest(data)),
});

LoginForm.propTypes = {
    isFetching: PropTypes.bool.isRequired,
};

export default connect(null, mapDispatchToProps)(reduxForm({
    form: 'login',
    validate: customValidator(Schems.LoginSchem),
})(LoginForm));
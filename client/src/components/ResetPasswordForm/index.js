import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {resetPasswordRequest, clearResetPasswordError} from '../../actions/actionCreator';
import styles from './ResetPasswordForm.module.sass';
import {Field, reduxForm} from 'redux-form';
import customValidator from '../../validators/validator';
import Schems from '../../validators/validationSchems';
import FormField from "../FormField";

const ResetPasswordForm = ({handleSubmit, isFetching, resetPassword, clearError}) => {

    useEffect(() => {
        clearError();
    }, []);

    const onSubmit = (values) => {
        resetPassword(values);
    };

    const formInputClasses = {
        containerStyle: styles.inputContainer,
        className: styles.input,
        warningStyle: styles.fieldWarning,
        invalidStyle: styles.notValid,
        validStyle: styles.valid,
    };

    return (
        <div className={styles.resetPasswordForm}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Field
                    name='email'
                    {...formInputClasses}
                    component={FormField}
                    type='text'
                    label='Email Address'
                />
                <Field
                    name='newPassword'
                    {...formInputClasses}
                    component={FormField}
                    type='password'
                    label='New Password'
                />
                <button type='submit' disabled={isFetching}
                        className={styles.submitContainer}>
            <span className={styles.inscription}>{isFetching
                ? 'Submitting...'
                : 'Reset Password'}</span>
                </button>
            </form>
        </div>
    );
};


const mapStateToProps = state => state.resetPasswordStore;

const mapDispatchToProps = dispatch => ({
    resetPassword: (data) => dispatch(resetPasswordRequest(data)),
    clearError: () => dispatch(clearResetPasswordError()),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'resetPassword',
    validate: customValidator(Schems.ResetPasswordSchema),
})(ResetPasswordForm));
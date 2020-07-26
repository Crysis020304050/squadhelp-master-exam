import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {resetPasswordRequest} from '../../actions/actionCreator';
import styles from './ResetPasswordForm.module.sass';
import {Field, reduxForm, updateSyncErrors} from 'redux-form';
import customValidator from '../../validators/validator';
import Schems from '../../validators/validationSchems';
import FormField from "../FormField";
import PropTypes from 'prop-types';

const ResetPasswordForm = ({handleSubmit, isFetching, responseError, resetPassword, dispatch}) => {

    useEffect(() => {
        if (responseError && (responseError.status === 400 || responseError.status === 404)) {
            const {status, data} = responseError;
            dispatch(updateSyncErrors('resetPassword', {
                ...(status === 400 && {newPassword: data}),
                ...(status === 404 && {email: data}),
            }));
        }
    }, [responseError]);

    const onSubmit = (values) => resetPassword(values);

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

const mapDispatchToProps = dispatch => ({
    resetPassword: (data) => dispatch(resetPasswordRequest(data)),
});

ResetPasswordForm.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    responseError: PropTypes.any,
};

export default connect(null, mapDispatchToProps)(reduxForm({
    form: 'resetPassword',
    validate: customValidator(Schems.ResetPasswordSchema),
})(ResetPasswordForm));
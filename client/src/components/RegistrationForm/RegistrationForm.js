import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {authActionRequest, clearErrorSignUpAndLogin} from '../../actions/actionCreator';
import styles from './RegistrationForm.module.sass';
import {Field, reduxForm} from 'redux-form';
import RoleInput from '../RoleInput/RoleInput';
import AgreeTermOfServiceInput
    from '../AgreeTermOfServiceInput/AgreeTermOfServiceInput';
import constants from '../../constants';
import customValidator from '../../validators/validator';
import Schems from '../../validators/validationSchems';
import FormField from "../FormField";

const RegistrationForm = props => {

    const {handleSubmit, submitting, register, clearError} = props;

    useEffect(() => {
        clearError();
    }, []);

    const clicked = (values) => {
        register({
            firstName: values.firstName,
            lastName: values.lastName,
            displayName: values.displayName,
            email: values.email,
            password: values.password,
            role: values.role,
        });
    };

    const formInputClasses = {
        containerStyle: styles.inputContainer,
        className: styles.input,
        warningStyle: styles.fieldWarning,
        invalidStyle: styles.notValid,
        validStyle: styles.valid,
    };

    return (
        <div className={styles.signUpFormContainer}>
            <form onSubmit={handleSubmit(clicked)}>
                <div className={styles.row}>
                    <Field
                        name='firstName'
                        {...formInputClasses}
                        component={FormField}
                        type='text'
                        label='First name'
                    />
                    <Field
                        name='lastName'
                        {...formInputClasses}
                        component={FormField}
                        type='text'
                        label='Last name'
                    />
                </div>
                <div className={styles.row}>
                    <Field
                        name='displayName'
                        {...formInputClasses}
                        component={FormField}
                        type='text'
                        label='Display Name'
                    />
                    <Field
                        name='email'
                        {...formInputClasses}
                        component={FormField}
                        type='text'
                        label='Email Address'
                    />
                </div>
                <div className={styles.row}>
                    <Field
                        name='password'
                        {...formInputClasses}
                        component={FormField}
                        type='password'
                        label='Password'
                    />
                    <Field
                        name='confirmPassword'
                        {...formInputClasses}
                        component={FormField}
                        type='password'
                        label='Password confirmation'
                    />
                </div>
                <div className={styles.choseRoleContainer}>
                    <Field name='role' type='radio' value={constants.CUSTOMER}
                           strRole='Join As a Buyer'
                           infoRole='I am looking for a Name, Logo or Tagline for my business, brand or product.'
                           component={RoleInput} id={constants.CUSTOMER}/>
                    <Field name='role' type='radio' value={constants.CREATOR}
                           strRole='Join As a Creative'
                           infoRole='I plan to submit name ideas, Logo designs or sell names in Domain Marketplace.'
                           component={RoleInput} id={constants.CREATOR}/>
                </div>
                <div className={styles.termsOfService}>
                    <Field
                        name='agreeOfTerms'
                        classes={{
                            container: styles.termsOfService,
                            warning: styles.fieldWarning,
                        }}
                        id='termsOfService'
                        component={AgreeTermOfServiceInput}
                        type='checkbox'
                    />

                </div>
                <button type='submit' disabled={submitting}
                        className={styles.submitContainer}>
                    <span className={styles.inscription}>Create Account</span>
                </button>
            </form>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        initialValues: {
            role: constants.CUSTOMER,
        },
    };
};

const mapDispatchToProps = (dispatch) => (
    {
        register: (data) => dispatch(authActionRequest(data)),
        clearError: () => dispatch(clearErrorSignUpAndLogin()),
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'login',
    validate: customValidator(Schems.RegistrationSchem),
})(RegistrationForm));
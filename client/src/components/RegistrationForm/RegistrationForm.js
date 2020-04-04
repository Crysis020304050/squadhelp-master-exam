import React from 'react';
import Error from '../Error/Error';
import { connect } from 'react-redux';
import { authActionRegister, clearAuth } from '../../actions/actionCreator';
import styles from './RegistrationForm.module.sass';
import { Field, reduxForm } from 'redux-form';
import FieldInput from '../FormField/FieldInput';
import RoleInput from '../RoleInput/RoleInput';
import AgreeTermOfServiceInput
  from '../AgreeTermOfServiceInput/AgreeTermOfServiceInput';
import CONSTANTS from '../../constants';
import customValidator from '../../validators/validator';
import Schems from '../../validators/validationSchems';
import FieldError from "../FormField/FieldError";

class RegistrationForm extends React.Component{

  componentWillUnmount () {
    this.props.authClear();
  }

  clicked = (values) => {
    this.props.register({
      firstName: values.firstName,
      lastName: values.lastName,
      displayName: values.displayName,
      email: values.email,
      password: values.password,
      role: values.role,
    });
  };

  render () {
    const {handleSubmit, submitting, auth, authClear} = this.props;
    const {error} = auth;

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
      <div className={ styles.signUpFormContainer }>
        { error && <Error data={ error.data } status={ error.status }
                          clearError={ authClear }/> }

        <form onSubmit={ handleSubmit(this.clicked) }>
          <div className={ styles.row }>
            <Field
              name='firstName'
              component={ renderField }
              type='text'
              label='First name'
            />
            <Field
              name='lastName'
              component={ renderField }
              type='text'
              label='Last name'
            />
          </div>
          <div className={ styles.row }>
            <Field
              name='displayName'
              component={ renderField }
              type='text'
              label='Display Name'
            />
            <Field
              name='email'
              component={ renderField }
              type='text'
              label='Email Address'
            />
          </div>
          <div className={ styles.row }>
            <Field
              name='password'
              component={ renderField }
              type='password'
              label='Password'
            />
            <Field
              name='confirmPassword'
              component={ renderField }
              type='password'
              label='Password confirmation'
            />
          </div>
          <div className={ styles.choseRoleContainer }>
            <Field name='role' type='radio' value={ CONSTANTS.CUSTOMER }
                   strRole='Join As a Buyer'
                   infoRole='I am looking for a Name, Logo or Tagline for my business, brand or product.'
                   component={ RoleInput } id={ CONSTANTS.CUSTOMER }/>
            <Field name='role' type='radio' value={ CONSTANTS.CREATOR }
                   strRole='Join As a Creative'
                   infoRole='I plan to submit name ideas, Logo designs or sell names in Domain Marketplace.'
                   component={ RoleInput } id={ CONSTANTS.CREATOR }/>
          </div>
          <div className={ styles.termsOfService }>
            <Field
              name='agreeOfTerms'
              classes={ {
                container: styles.termsOfService,
                warning: styles.fieldWarning,
              } }
              id='termsOfService'
              component={ AgreeTermOfServiceInput }
              type='checkbox'
            />

          </div>
          <button type='submit' disabled={ submitting }
                  className={ styles.submitContainer }>
            <span className={ styles.inscription }>Create Account</span>
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    initialValues: {
      role: CONSTANTS.CUSTOMER,
    },
  };
};

const mapDispatchToProps = (dispatch) => (
  {
    register: (data) => dispatch(authActionRegister(data)),
    authClear: () => dispatch(clearAuth()),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'login',
  validate: customValidator(Schems.RegistrationSchem),
})(RegistrationForm));
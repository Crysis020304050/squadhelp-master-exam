import React from 'react';
import { connect } from 'react-redux';
import { authActionLogin, clearAuth } from '../../actions/actionCreator';
import styles from './LoginForm.module.sass';
import { Field, reduxForm } from 'redux-form';
import FieldInput from '../FormField/FieldInput';
import customValidator from '../../validators/validator';
import Schems from '../../validators/validationSchems';
import Error from '../../components/Error/Error';
import FieldError from "../FormField/FieldError";

class LoginForm extends React.Component{

  componentWillUnmount () {
    this.props.authClear();
  }

  clicked = (values) => {
    this.props.loginRequest(values);
  };

  render () {
    const {error, isFetching} = this.props.auth;
    const {handleSubmit, submitting, authClear} = this.props;

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
      <div className={ styles.loginForm }>
        { error && <Error data={ error.data } status={ error.status }
                          clearError={ authClear }/> }
        <form onSubmit={ handleSubmit(this.clicked) }>
          <Field
            name='email'
            component={ renderField }
            type='text'
            label='Email Address'
          />
          <Field
            name='password'
            component={ renderField }
            type='password'
            label='password'
          />
          <button type='submit' disabled={ submitting }
                  className={ styles.submitContainer }>
            <span className={ styles.inscription }>{ isFetching
              ? 'Submitting...'
              : 'LOGIN' }</span>
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {auth} = state;
  return {auth};
};

const mapDispatchToProps = (dispatch) => (
  {
    loginRequest: (data) => dispatch(authActionLogin(data)),
    authClear: () => dispatch(clearAuth()),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'login',
  validate: customValidator(Schems.LoginSchem),
})(LoginForm));
import React from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {clearUserError} from '../../actions/actionCreator';
import styles from './UpdateUserInfoForm.module.sass';
import ImageUpload from '../InputComponents/ImageUpload/ImageUpload';
import FieldInput from '../FormField/FieldInput';
import customValidator from '../../validators/validator';
import Schems from '../../validators/validationSchems';
import Error from '../../components/Error/Error';
import FieldError from "../FormField/FieldError";


const UpdateUserInfoForm = (props) => {
    const {handleSubmit, submitting, error, clearUserError} = props;

    const formInputStyles = {
        inputStyles: styles.input,
        invalidStyles: styles.notValid,
    };

    const renderField = (field) => (
        <label className={styles.inputContainer}>
            <FieldInput {...field} {...formInputStyles}/>
            <FieldError meta={field.meta} className={styles.error}/>
        </label>
    );

    return (
        <form onSubmit={handleSubmit} className={styles.updateContainer}>
            {error && <Error data={error.data} status={error.status} clearError={clearUserError}/>}
            <div className={styles.container}>
                <span className={styles.label}>First Name</span>
                <Field
                    name='firstName'
                    component={renderField}
                    type='text'
                    label='First Name'
                />
            </div>
            <div className={styles.container}>
                <span className={styles.label}>Last Name</span>
                <Field
                    name='lastName'
                    component={renderField}
                    type='text'
                    label='LastName'
                />
            </div>
            <div className={styles.container}>
                <span className={styles.label}>Display Name</span>
                <Field
                    name='displayName'
                    component={renderField}
                    type='text'
                    label='Display Name'
                />
            </div>
            <Field
                name='file'
                component={ImageUpload}
                classes={{
                    uploadContainer: styles.imageUploadContainer,
                    inputContainer: styles.uploadInputContainer,
                    imgStyle: styles.imgStyle
                }}
            />
            <button type='submit' disabled={submitting}>
                Submit
            </button>
        </form>
    )
};


const mapStateToProps = (state) => {
    const {data, error} = state.userStore;
    return {
        error,
        initialValues: {
            firstName: data.firstName,
            lastName: data.lastName,
            displayName: data.displayName
        }
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        clearUserError: () => dispatch(clearUserError())
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'updateProfile',
    validate: customValidator(Schems.UpdateUserSchema)
})(UpdateUserInfoForm));

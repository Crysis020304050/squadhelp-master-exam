import React from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {clearUserError} from '../../actions/actionCreator';
import styles from './UpdateUserInfoForm.module.sass';
import ImageUpload from '../InputComponents/ImageUpload/ImageUpload';
import customValidator from '../../validators/validator';
import Schems from '../../validators/validationSchems';
import Error from '../../components/Error/Error';
import FormField from "../FormField";


const UpdateUserInfoForm = (props) => {
    const {handleSubmit, submitting, error, clearUserError} = props;

    const formInputClasses = {
        containerStyle: styles.inputContainer,
        className: styles.input,
        warningStyle: styles.error,
        invalidStyle: styles.notValid,
    };

    return (
        <form onSubmit={handleSubmit} className={styles.updateContainer}>
            {error && <Error error={error} clearError={clearUserError}/>}
            <div className={styles.container}>
                <span className={styles.label}>First Name</span>
                <Field
                    name='firstName'
                    {...formInputClasses}
                    component={FormField}
                    type='text'
                    label='First Name'
                />
            </div>
            <div className={styles.container}>
                <span className={styles.label}>Last Name</span>
                <Field
                    name='lastName'
                    {...formInputClasses}
                    component={FormField}
                    type='text'
                    label='LastName'
                />
            </div>
            <div className={styles.container}>
                <span className={styles.label}>Display Name</span>
                <Field
                    name='displayName'
                    {...formInputClasses}
                    component={FormField}
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

import React from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import FieldInput from '../../../FormField/FieldInput';
import styles from './CreateCatalog.module.sass';
import {createCatalog} from '../../../../actions/actionCreator';
import FieldError from "../../../FormField/FieldError";

const validate = (values) => {
    const errors = {};
    if (!values.catalogName || !values.catalogName.trim().length) {
        errors.catalogName = 'Cannot be empty';
    }
    return errors;
};


const CreateCatalog = (props) => {
    const click = (values) => {
        const {createCatalog} = props;
        const {addChatId} = props;
        createCatalog({catalogName: values.catalogName, chatId: addChatId});
    };
    const {handleSubmit, valid} = props;

    const formInputStyles = {
        inputStyles: styles.input,
        invalidStyles: styles.notValid,
    };

    const renderField = (field) => (
        <label className={styles.inputContainer}>
            <FieldInput {...field} {...formInputStyles}/>
            <FieldError meta={field.meta} className={styles.fieldWarning}/>
        </label>
    );

    return (
        <form onSubmit={handleSubmit(click)} className={styles.form}>
            <Field
                name='catalogName'
                component={renderField}
                type='text'
                label='name of catalog'
            />
            {valid && <button type='submit'>Create Catalog</button>}
        </form>
    )
};


const mapDispatchToProps = (dispatch) => {
    return {
        createCatalog: (data) => dispatch(createCatalog(data))
    }
};

const mapStateToProps = (state) => {
    return state.chatStore;
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'createCatalog',
    validate
})(CreateCatalog));
import React from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import styles from './CreateCatalog.module.sass';
import {createCatalog} from '../../../../actions/actionCreator';
import FormField from "../../../FormField";

const validate = (values) => {
    const errors = {};
    if (!values.catalogName || !values.catalogName.trim().length) {
        errors.catalogName = 'Cannot be empty';
    }
    return errors;
};


const CreateCatalog = (props) => {
    const click = ({catalogName}) => {
        const {createCatalog, addChatId} = props;
        createCatalog({catalogName, chatId: addChatId, conversationId: addChatId, name: catalogName});
    };
    const {handleSubmit, valid} = props;

    const formInputClasses = {
        containerStyle: styles.inputContainer,
        className: styles.input,
        warningStyle: styles.fieldWarning,
        invalidStyle: styles.notValid,
    };

    return (
        <form onSubmit={handleSubmit(click)} className={styles.form}>
            <Field
                name='catalogName'
                {...formInputClasses}
                component={FormField}
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
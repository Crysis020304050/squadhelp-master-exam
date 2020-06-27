import React from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm, updateSyncErrors} from 'redux-form';
import styles from './CreateCatalog.module.sass';
import {createCatalog} from '../../../../actions/actionCreator';
import FormField from "../../../FormField";

const validate = ({catalogName}) => {
    const errors = {};
    if (!catalogName || !catalogName.trim().length) {
        errors.catalogName = 'Cannot be empty';
    }
    return errors;
};

const CreateCatalog = ({createCatalog, addChatId, handleSubmit, valid, catalogList, dispatch}) => {

    const onSubmit = ({catalogName}) => {
        if (catalogList.some(catalog => catalog.catalogName === catalogName)) {
            dispatch(updateSyncErrors('createCatalog', {catalogName: `Catalog with name '${catalogName}' already exists`}));
        } else {
            createCatalog({catalogName, chatId: addChatId, conversationId: addChatId, name: catalogName});
        }
    };

    const formInputClasses = {
        containerStyle: styles.inputContainer,
        className: styles.input,
        warningStyle: styles.fieldWarning,
        invalidStyle: styles.notValid,
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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

const mapDispatchToProps = (dispatch) => ({
    createCatalog: (data) => dispatch(createCatalog(data))
});

const mapStateToProps = (state) => state.chatStore;

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'createCatalog',
    validate
})(CreateCatalog));
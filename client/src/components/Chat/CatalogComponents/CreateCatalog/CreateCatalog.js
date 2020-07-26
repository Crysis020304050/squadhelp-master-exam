import React from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm, updateSyncErrors} from 'redux-form';
import styles from './CreateCatalog.module.sass';
import {createCatalog} from '../../../../actions/actionCreator';
import FormField from "../../../FormField";
import customValidator from '../../../../validators/validator';
import Schems from '../../../../validators/validationSchems';

const CreateCatalog = ({createCatalog, addConversationId, handleSubmit, valid, catalogList, dispatch}) => {

    const onSubmit = ({name}) => {
        if (catalogList.some(catalog => catalog.name === name)) {
            dispatch(updateSyncErrors('createCatalog', {name: 'Catalog with this name already exists'}));
        } else {
            createCatalog({name, conversationId: addConversationId});
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
                name='name'
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
    validate: customValidator(Schems.CatalogNameSchema),
})(CreateCatalog));
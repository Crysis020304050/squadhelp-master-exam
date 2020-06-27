import React from 'react';
import {connect} from 'react-redux';
import {changeShowModeCatalog, changeRenameCatalogMode, changeCatalogName} from "../../../../actions/actionCreator";
import {Field, reduxForm, updateSyncErrors} from 'redux-form';
import styles from './CatalogHeader.module.sass';
import FormField from "../../../FormField";

const validate = (values) => {
    const errors = {};
    if (!values.catalogName || !values.catalogName.trim().length) {
        errors.catalogName = 'Cannot be empty';
    }
    return errors;
};

const CatalogListHeader = ({changeCatalogName, _id, handleSubmit, catalogName, changeShowModeCatalog, changeRenameCatalogMode, isRenameCatalog, valid, catalogList, dispatch}) => {

    const onSubmit = ({catalogName}) => {
        if (catalogList.some(catalog => catalog.catalogName === catalogName)) {
            dispatch(updateSyncErrors('catalogRename', {catalogName: `Catalog with name '${catalogName}' already exists`}));
        } else {
            changeCatalogName({catalogName, catalogId: _id});
        }
    };

    const formInputClasses = {
        containerStyle: styles.inputContainer,
        className: styles.input,
        warningStyle: styles.fieldWarning,
        invalidStyle: styles.notValid,
    };

    return (
        <div className={styles.headerContainer}>
            <i className='fas fa-long-arrow-alt-left' onClick={() => changeShowModeCatalog()}/>
            {!isRenameCatalog && <div className={styles.infoContainer}>
                <span>{catalogName}</span>
                <i className='fas fa-edit' onClick={() => changeRenameCatalogMode()}/>
            </div>}
            {isRenameCatalog && <div className={styles.changeContainer}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Field
                        name='catalogName'
                        {...formInputClasses}
                        component={FormField}
                        type='text'
                        label='Catalog Name'
                    />
                    {valid && <button type='submit'>Change</button>}
                </form>
            </div>}
        </div>
    )
};


const mapStateToProps = (state) => {
    const {isRenameCatalog, catalogList} = state.chatStore;
    const {catalogName, _id} = state.chatStore.currentCatalog;
    return {
        _id,
        catalogName,
        isRenameCatalog,
        catalogList,
        initialValues: {
            catalogName: catalogName
        }
    }
};

const mapDispatchToProps = (dispatch) => ({
    changeShowModeCatalog: () => dispatch(changeShowModeCatalog()),
    changeRenameCatalogMode: () => dispatch(changeRenameCatalogMode()),
    changeCatalogName: (data) => dispatch(changeCatalogName(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'catalogRename',
    validate
})(CatalogListHeader));


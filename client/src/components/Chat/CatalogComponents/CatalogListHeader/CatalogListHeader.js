import React from 'react';
import {connect} from 'react-redux';
import {changeShowModeCatalog, changeRenameCatalogMode, changeCatalogName} from "../../../../actions/actionCreator";
import {Field, reduxForm, updateSyncErrors} from 'redux-form';
import styles from './CatalogHeader.module.sass';
import FormField from "../../../FormField";
import customValidator from '../../../../validators/validator';
import Schems from '../../../../validators/validationSchems';


const CatalogListHeader = ({changeCatalogName, id, handleSubmit, name, changeShowModeCatalog, changeRenameCatalogMode, isRenameCatalog, valid, catalogList, dispatch}) => {

    const onSubmit = ({name}) => {
        if (catalogList.some(catalog => catalog.name === name)) {
            dispatch(updateSyncErrors('catalogRename', {name: `Catalog with this name already exists`}));
        } else {
            changeCatalogName({name, catalogId: id});
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
                <span>{name}</span>
                <i className='fas fa-edit' onClick={() => changeRenameCatalogMode()}/>
            </div>}
            {isRenameCatalog && <div className={styles.changeContainer}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Field
                        name='name'
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
    const {name, id} = state.chatStore.currentCatalog;
    return {
        id,
        name,
        isRenameCatalog,
        catalogList,
        initialValues: {
            name,
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
    validate: customValidator(Schems.CatalogNameSchema)
})(CatalogListHeader));


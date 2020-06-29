import React from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import SelectInput from '../../../SelectInput/SelectInput';
import {addConversationToCatalog} from '../../../../actions/actionCreator';
import styles from './AddToCatalog.module.sass';


const AddToCatalog = ({catalogList, addConversationId, addConversationToCatalog, handleSubmit}) => {

    const getCatalogsNames = () => {
        const namesArray = [];
        catalogList.forEach(({conversations, name}) => {
            if (!conversations.some(conversationId => conversationId === addConversationId)) {
                namesArray.push(name);
            }
        });
        return namesArray;
    };

    const getValueArray = () => {
        const valueArray = [];
        catalogList.forEach(({conversations, id}) => {
            if (!conversations.some(conversationId => conversationId === addConversationId)) {
                valueArray.push(id);
            }
        });
        return valueArray;
    };

    const onSubmit = ({catalogId}) => {
        addConversationToCatalog({conversationId: addConversationId, catalogId: +catalogId});
    };

    const selectArray = getCatalogsNames();
    return (<>
            {selectArray.length !== 0 ?
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <Field
                        name='catalogId'
                        component={SelectInput}
                        header='name of catalog'
                        classes={{
                            inputContainer: styles.selectInputContainer,
                            inputHeader: styles.selectHeader,
                            selectInput: styles.select
                        }}
                        optionsArray={selectArray}
                        valueArray={getValueArray()}
                    />
                    <button type='submit'>Add</button>
                </form>
                :
                <div className={styles.notFound}>You do not have any available catalogs.</div>
            }

        </>
    )
};

const mapStateToProps = (state) => state.chatStore;

const mapDispatchToProps = (dispatch) => ({
    addConversationToCatalog: (data) => dispatch(addConversationToCatalog(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'addConversationToCatalog'
})(AddToCatalog));
import React from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import SelectInput from '../../../SelectInput/SelectInput';
import {addChatToCatalog} from '../../../../actions/actionCreator';
import styles from './AddToCatalog.module.sass';


const AddToCatalog = ({catalogList, addChatId, addChatToCatalog, handleSubmit}) => {

    const getCatalogsNames = () => {
        const namesArray = [];
        catalogList.forEach(({chats, catalogName}) => {
            if (!chats.some(chatId => chatId === addChatId)) {
                namesArray.push(catalogName);
            }
        });
        return namesArray;
    };

    const getValueArray = () => {
        const valueArray = [];
        catalogList.forEach(({chats, _id}) => {
            if (!chats.some(chatId => chatId === addChatId)) {
                valueArray.push(_id);
            }
        });
        return valueArray;
    };

    const onSubmit = ({catalogId}) => {
        addChatToCatalog({conversationId: addChatId, catalogId: +catalogId});
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
    addChatToCatalog: (data) => dispatch(addChatToCatalog(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'addChatToCatalog'
})(AddToCatalog));
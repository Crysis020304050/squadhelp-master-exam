import React from 'react';
import {connect} from 'react-redux';
import {sendMessageAction} from '../../../../actions/actionCreator';
import {Field, reduxForm} from 'redux-form';
import styles from './ChatInput.module.sass';
import constants from '../../../../constants/constants';
import FormField from "../../../FormField";

const validate = (values) => {
    const errors = {};
    if (!values.message || !values.message.trim().length) {
        errors.message = 'Cannot be empty';
    }
    return errors;
};

const ChatInput = ({reset, sendMessage, handleSubmit, valid, interlocutor, chatData}) => {

    const clickButton = (values) => {
        sendMessage({
            messageBody: values.message,
            body: values.message,
            conversationId: chatData && chatData._id || null,
            recipient: interlocutor.id,
            interlocutor,
        });
        reset();
    };

    const formInputClasses = {
        containerStyle: styles.inputContainer,
        className: styles.input,
        warningStyle: styles.fieldWarning,
        invalidStyle: styles.notValid,
    };

    return (
        <div className={styles.inputContainer}>
            <form onSubmit={handleSubmit(clickButton)} className={styles.form}>
                <Field
                    name='message'
                    {...formInputClasses}
                    component={FormField}
                    type='text'
                    label='message'
                />
                {valid &&
                <button type='submit'><img src={`${constants.STATIC_IMAGES_PATH}send.png`} alt="send Message"/>
                </button>}
            </form>
        </div>
    )
};

const mapStateToProps = (state) => {
    const {interlocutor, chatData} = state.chatStore;
    const {data} = state.userStore;
    return {interlocutor, data, chatData};
};

const mapDispatchToProps = (dispatch) => ({
    sendMessage: (data) => dispatch(sendMessageAction(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'messageForm',
    validate
})(ChatInput));

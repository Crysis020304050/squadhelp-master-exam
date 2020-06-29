import React from 'react';
import {connect} from 'react-redux';
import {sendMessageAction} from '../../../../actions/actionCreator';
import {Field, reduxForm} from 'redux-form';
import styles from './ChatInput.module.sass';
import constants from '../../../../constants/constants';
import FormField from "../../../FormField";

const validate = ({message}) => {
    const errors = {};
    if (!message || !message.trim().length) {
        errors.message = 'Cannot be empty';
    }
    return errors;
};

const ChatInput = ({reset, sendMessage, handleSubmit, valid, interlocutor, conversationData}) => {

    const clickButton = ({message}) => {
        sendMessage({
            body: message,
            conversationId: conversationData && conversationData.id || null,
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
    const {interlocutor, conversationData} = state.chatStore;
    const {data} = state.userStore;
    return {interlocutor, data, conversationData};
};

const mapDispatchToProps = (dispatch) => ({
    sendMessage: (data) => dispatch(sendMessageAction(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'messageForm',
    validate
})(ChatInput));

import React from 'react';
import {connect} from 'react-redux';
import styles from './CreateEventForm.module.sass';
import {Field, reduxForm, updateSyncErrors} from 'redux-form';
import customValidator from '../../validators/validator';
import Schems from '../../validators/validationSchems';
import FormField from "../FormField";
import DatePickerField from "../DatePickerField";
import {createNewEvent} from '../../actions/actionCreator';

const CreateEventForm = ({handleSubmit, createEvent, reset, dispatch}) => {

    const onSubmit = (values) => {
        const {endTime, reminderTime} = values;
        const now = new Date();
        if (endTime > now && reminderTime > now) {
            createEvent({...values, startDate: now, timestamp: Date.now()});
            reset();
        } else {
            dispatch(updateSyncErrors('event', {
                ...(endTime < now && {endTime: 'End event time must be greater than now'}),
                ...(reminderTime < now && {reminderTime: 'Reminder time must be greater than now'}),
            }));
        }
    };

    const formInputClasses = {
        containerStyle: styles.inputContainer,
        className: styles.input,
        warningStyle: styles.fieldWarning,
        invalidStyle: styles.notValid,
        validStyle: styles.valid,
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.eventForm}>
            <Field
                name='eventName'
                {...formInputClasses}
                component={FormField}
                type='text'
                label='Event Name'
            />
            <Field
                name='endTime'
                {...formInputClasses}
                component={DatePickerField}
                label='End Date'
            />
            <Field
                name='reminderTime'
                {...formInputClasses}
                component={DatePickerField}
                label='Reminder Date'
            />
            <button type='submit'
                    className={styles.submitContainer}>
                <span className={styles.inscription}>CREATE EVENT</span>
            </button>
        </form>
    );
};

const mapDispatchToProps = dispatch => ({
    createEvent: (event) => dispatch(createNewEvent(event)),
});

export default connect(null, mapDispatchToProps)(reduxForm({
    form: 'event',
    validate: customValidator(Schems.EventSchema),
})(CreateEventForm));
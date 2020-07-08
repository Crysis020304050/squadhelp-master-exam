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
        const {endDate, reminderDate} = values;
        const now = new Date();
        if (endDate > now && reminderDate > now) {
            createEvent({...values, startDate: now, timestamp: Date.now()});
            reset();
        } else {
            dispatch(updateSyncErrors('event', {
                ...(endDate < now && {endDate: 'End event time must be greater than now'}),
                ...(reminderDate < now && {reminderDate: 'Reminder time must be greater than now'}),
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
                name='name'
                {...formInputClasses}
                component={FormField}
                type='text'
                label='Event Name'
            />
            <Field
                name='endDate'
                {...formInputClasses}
                component={DatePickerField}
                label='End Date'
            />
            <Field
                name='reminderDate'
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
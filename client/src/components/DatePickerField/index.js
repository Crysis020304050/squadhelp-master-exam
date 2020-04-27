import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import FieldError from "../FormField/FieldError";
import classNames from "classnames";

const DatePickerField = ({input, label, meta: {touched, error, visited}, warningStyle, containerStyle, className, validStyle,invalidStyle}) => {

    const inputClassName = classNames(className, {
        [invalidStyle]: touched && error,
        [validStyle]: visited && !error,
    });

    return (
        <div className={containerStyle}>
            <DatePicker {...input}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        minDate={new Date()}
                        maxDate={new Date().setFullYear(new Date().getFullYear() + 1)}
                        showTimeInput
                        selected={(input.value instanceof Date) ? input.value : null}
                        placeholderText={label}
                        className={inputClassName}
                        autoComplete='off'
            />
            <FieldError className={warningStyle} touched={touched} error={error}/>
        </div>
    );

};

export default DatePickerField;
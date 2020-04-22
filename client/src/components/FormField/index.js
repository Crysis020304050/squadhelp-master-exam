import React from "react";
import FieldError from "./FieldError";
import FieldInput from "./FieldInput";
import FieldInputWrapper from "./FieldInputWrapper";
import PropTypes    from "prop-types";
import classNames from 'classnames';

const FormField = props => {
    const {label,type, className,input, meta: {touched, error,visited},warningStyle,validStyle,invalidStyle,containerStyle} = props;

    const inputClassName = classNames(className, {
        [invalidStyle]: touched && error,
        [validStyle]: visited && !error,
    });

    return (
      <FieldInputWrapper className={containerStyle}>
          <FieldInput input={input} className={inputClassName} label={label} type={type}/>
          <FieldError className={warningStyle} error={error} touched={touched}/>
      </FieldInputWrapper>
    );
};

FormField.propTypes={
    validStyle:PropTypes.string,
    invalidStyle:PropTypes.string,
    className:PropTypes.string.isRequired,
    containerStyle:PropTypes.string.isRequired,
    warningStyle:PropTypes.string.isRequired

};

export default FormField;
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const FieldInput = (props) => {

  const {label, input, type, inputStyles, validStyles, invalidStyles, meta: {touched, error}} = props;

  const inputClassName = classNames(inputStyles, {
    [invalidStyles]: touched && error,
    [validStyles]: touched && !error,
  });

  return (
      <input { ...input } placeholder={ label } type={ type }
             className={ inputClassName }/>
  );
};

FieldInput.propTypes={
    label: PropTypes.string,
    input:PropTypes.object.isRequired,
    type: PropTypes.string,
    inputStyles: PropTypes.string,
    validStyles:PropTypes.string,
    invalidStyles:PropTypes.string,
    meta: PropTypes.object,
};

export default FieldInput;
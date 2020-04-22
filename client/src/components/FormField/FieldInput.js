import React from 'react';
import PropTypes from 'prop-types';

const FieldInput = ({label, input, type, className}) => {

  return (
      <input { ...input } placeholder={ label } type={ type }
             className={ className }/>
  );
};

FieldInput.propTypes={
    label: PropTypes.string,
    input:PropTypes.object.isRequired,
    type: PropTypes.string,
    className: PropTypes.string,
};

export default FieldInput;
import React from 'react';
import PropTypes from 'prop-types';

import TextArea from './text-area';

const WrappingTextInput = ({ onChange, ...props }) => {
  const onChangeFilter = (value) => onChange(value.replace(/\r?\n/g, ''));
  return <TextArea {...props} onChange={onChangeFilter} />;
};

WrappingTextInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default WrappingTextInput;

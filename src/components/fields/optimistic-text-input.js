import React from 'react';
import PropTypes from 'prop-types';

import TextInput from '../inputs/text-input';
import useOptimisticText from './use-optimistic-text';

const OptimisticTextInput = ({ value, onChange, ...props }) => {
  const [optimisticValue, optimisticOnChange, optimisticError] = useOptimisticText(value, onChange);
  return <TextInput {...props} value={optimisticValue} error={optimisticError} onChange={optimisticOnChange} />;
};

OptimisticTextInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OptimisticTextInput;

import React from 'react';
import PropTypes from 'prop-types';

import WrappingTextInput from '../inputs/wrapping-text-input';
import useOptimisticText from './use-optimistic-text';

const OptimisticWrappingTextInput = ({ value, onChange, ...props }) => {
  const [optimisticValue, optimisticOnChange, optimisticError] = useOptimisticText(value, onChange);
  return <WrappingTextInput {...props} value={optimisticValue} error={optimisticError} onChange={optimisticOnChange} />;
};

OptimisticWrappingTextInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OptimisticWrappingTextInput;

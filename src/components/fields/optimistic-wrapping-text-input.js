import React from 'react';
import PropTypes from 'prop-types';

import WrappingTextInput from '../inputs/wrapping-text-input';

import usePassivelyTrimmedInput from "./use-passively-trimmed-input";
import useOptimisticValue from "./use-optimistic-value";

const OptimisticWrappingTextInput = ({ value, onChange, ...props }) => {
  const [untrimmedValue, onChangeBoundWithTrimmedInputs] = usePassivelyTrimmedInput(value, onChange);
  const [optimisticValue, optimisticOnChange, optimisticOnBlur, optimisticError] = useOptimisticValue(untrimmedValue, onChangeBoundWithTrimmedInputs);
  
  return <WrappingTextInput {...props} value={optimisticValue} error={optimisticError} onChange={optimisticOnChange} />;
};

OptimisticWrappingTextInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OptimisticWrappingTextInput;

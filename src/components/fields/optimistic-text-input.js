import React from 'react';
import PropTypes from 'prop-types';

import TextInput from '../inputs/text-input';
import usePassivelyTrimmedInput from './use-passively-trimmed-input';
import useOptimisticValue from './use-optimistic-value';

const OptimisticTextInput = ({ value, onChange, ...props }) => {
  const [untrimmedValue, onChangeBoundWithTrimmedInputs] = usePassivelyTrimmedInput(value, onChange);
  const [optimisticValue, optimisticOnChange, optimisticOnBlur, optimisticError] = useOptimisticValue(untrimmedValue, onChangeBoundWithTrimmedInputs);

  return <TextInput {...props} value={optimisticValue} onChange={optimisticOnChange} onBlur={optimisticOnBlur} error={optimisticError} />;
};

OptimisticTextInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OptimisticTextInput;

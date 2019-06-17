import React from 'react';
import PropTypes from 'prop-types';

import usePassivelyTrimmedInput from "./use-passively-trimmed-input";
import useOptimisticValue from "./use-optimistic-value";

import MarkdownInput from '../inputs/markdown-input';


function OptimisticMarkdownInput({ value, onChange, ...props }) {
  const [untrimmedValue, onChangeBoundWithTrimmedInputs] = usePassivelyTrimmedInput(value, onChange);
  const [optimisticValue, optimisticOnChange, optimisticOnBlur, optimisticError] = useOptimisticValue(untrimmedValue, onChangeBoundWithTrimmedInputs);
  
  return <MarkdownInput {...props} value={optimisticValue} onChange={optimisticOnChange} onBlur={optimisticOnBlur} error={optimisticError} />;
}
OptimisticMarkdownInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
export default OptimisticMarkdownInput;





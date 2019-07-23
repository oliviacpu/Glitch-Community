import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import TextAreaAutosize from 'react-textarea-autosize';
import useUniqueId from 'Hooks/use-unique-id';
import InputErrorMessage from './input-error-message';
import InputErrorIcon from './input-error-icon';

import styles from './text-area.styl';

const TextArea = ({ className, autoFocus, disabled, error, name, onBlur, onChange, onFocus, placeholder, value }) => {
  const uniqueId = useUniqueId();
  return (
    <label className={styles.inputWrap} htmlFor={uniqueId}>
      <div className={styles.inputBorder}>
        <TextAreaAutosize
          autoFocus={autoFocus} // eslint-disable-line jsx-a11y/no-autofocus
          className={classnames(styles.input, className)}
          disabled={disabled}
          id={uniqueId}
          name={name}
          onBlur={onBlur}
          onChange={(evt) => onChange(evt.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          value={value}
        />
        {!!error && <InputErrorIcon className={styles.errorIcon} />}
      </div>
      {!!error && <InputErrorMessage>{error}</InputErrorMessage>}
    </label>
  );
};

TextArea.propTypes = {
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.node,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
};

TextArea.defaultProps = {
  autoFocus: false,
  disabled: false,
  error: null,
  name: undefined,
  onBlur: null,
  onFocus: null,
  placeholder: undefined,
  className: '',
};

export default TextArea;

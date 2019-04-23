import React from 'react';
import PropTypes from 'prop-types';

import TextArea from './text-area';
import Markdown from '../text/markdown';

import styles from './markdown-input.styl';

const MarkdownInput = ({ error, onChange, placeholder, value }) => {
  const [focused, setFocused] = React.useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  if (error || focused || !value) {
    return (
      <TextArea
        autoFocus={focused}
        error={error}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        placeholder={placeholder}
        value={value}
      />
    );
  }
  return (
    <p
      className={styles.fakeInput}
      aria-label={placeholder}
      onBlur={onBlur}
      onFocus={onFocus}
      role="textbox" // eslint-disable-line jsx-a11y/no-noninteractive-element-to-interactive-role
      tabIndex={0}
    >
      <Markdown>{value}</Markdown>
    </p>
  );
};

MarkdownInput.propTypes = {
  error: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
};

export default MarkdownInput;

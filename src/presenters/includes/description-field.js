import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextArea from 'react-textarea-autosize';

import Markdown from 'Components/text/markdown';
import MarkdownInput from 'Components/inputs/markdown-input';
import { OptimisticValue } from './field-helpers';

function EditableDescriptionImpl({ description, placeholder, maxLength, allowImages, update, onBlur: outerOnBlur }) {
  const [focused, setFocused] = useState(false);
  const onFocus = (event) => {
    if (event.currentTarget === event.target) {
      setFocused(true);
    }
  };
  const onChange = (event) => {
    update(event.target.value);
  };
  const onBlur = (event) => {
    setFocused(false);
    outerOnBlur(event.target.value);
  };

  return focused ? (
    <TextArea
      className="description content-editable"
      value={description}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      spellCheck={false}
      maxLength={maxLength}
      autoFocus // eslint-disable-line jsx-a11y/no-autofocus
    />
  ) : (
    <p
      className="description content-editable"
      placeholder={placeholder}
      aria-label={placeholder}
      role="textbox" // eslint-disable-line jsx-a11y/no-noninteractive-element-to-interactive-role
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {description && <Markdown allowImages={allowImages}>{description}</Markdown>}
    </p>
  );
}

EditableDescriptionImpl.propTypes = {
  allowImages: PropTypes.bool,
  description: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  update: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
};

EditableDescriptionImpl.defaultProps = {
  allowImages: true,
  placeholder: '',
  onBlur: () => {},
};

const EditableDescription = ({ description, placeholder, update, onBlur, allowImages }) => (
  <OptimisticValue value={description} update={update}>
    {({ optimisticValue, optimisticUpdate }) => (
      <MarkdownInput
        value={optimisticValue}
        onChange={optimisticUpdate}
        onBlur={onBlur}
        placeholder={placeholder}
        allowImages={allowImages}
      />
    )}
  </OptimisticValue>
);
EditableDescription.propTypes = {
  allowImages: PropTypes.bool,
  description: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  update: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  maxLength: PropTypes.number,
};

EditableDescription.defaultProps = {
  allowImages: true,
  placeholder: '',
  onBlur: () => {},
  maxLength: null,
};

export const StaticDescription = ({ description }) =>
  description ? (
    <p className="description read-only">
      <Markdown>{description}</Markdown>
    </p>
  ) : null;
StaticDescription.propTypes = {
  description: PropTypes.string.isRequired,
};

export const AuthDescription = ({ authorized, description, placeholder, update, onBlur, maxLength, allowImages }) =>
  authorized ? (
    <EditableDescription
      description={description}
      update={update}
      onBlur={onBlur}
      placeholder={placeholder}
      maxLength={maxLength}
      allowImages={allowImages}
    />
  ) : (
    <StaticDescription description={description} />
  );

AuthDescription.propTypes = {
  allowImages: PropTypes.bool,
  authorized: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  update: PropTypes.func,
  maxLength: PropTypes.number,
};

AuthDescription.defaultProps = {
  allowImages: true,
  placeholder: '',
  maxLength: null,
  update: null,
};

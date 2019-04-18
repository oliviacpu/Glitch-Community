import React from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';

import { OptimisticValue, TrimmedValue, FieldErrorIcon, FieldErrorMessage } from './field-helpers';

class PureEditableFieldHolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: uniqueId('editable-field-') };
    this.textInput = React.createRef();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.textInput.current.select();
    }
  }

  onChange(evt) {
    this.props.update(evt.target.value);
  }

  render() {
    const classes = ['content-editable', this.props.error ? 'error' : ''].join(' ');
    const inputProps = {
      id: this.state.id,
      className: classes,
      value: this.props.value,
      onChange: this.onChange,
      spellCheck: false,
      autoComplete: 'off',
      placeholder: this.props.placeholder,
      autoFocus: this.props.autoFocus,
      onBlur: this.props.blur,
      type: this.props.inputType,
    };

    const maybeErrorIcon = !!this.props.error && <FieldErrorIcon />;

    const maybeErrorMessage = !!this.props.error && <FieldErrorMessage error={this.props.error} hideIcon />;

    const maybePrefix = !!this.props.prefix && <span className={`content-editable-affix ${classes}`}>{this.props.prefix}</span>;

    const maybeSuffix = !!this.props.suffix && <span className={`content-editable-affix ${classes}`}>{this.props.suffix}</span>;

    return (
      <label htmlFor={inputProps.id}>
        <span className="editable-field-flex">
          {maybePrefix}
          <span className="editable-field-input">
            {this.props.children(inputProps, this.textInput)}
            {maybeErrorIcon}
          </span>
          {maybeSuffix}
        </span>
        {maybeErrorMessage}
      </label>
    );
  }
}

PureEditableFieldHolder.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired, // function that takes inputProps and inputRef as parameters and returns a node
  blur: PropTypes.func,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  autoFocus: PropTypes.bool,
  error: PropTypes.string,
};

PureEditableFieldHolder.defaultProps = {
  blur: () => {},
  prefix: null,
  suffix: null,
  autoFocus: false,
  error: '',
};

const PureEditableField = (props) => (
  <PureEditableFieldHolder {...props}>{(inputProps, inputRef) => <input {...inputProps} ref={inputRef} />}</PureEditableFieldHolder>
);

PureEditableField.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  blur: PropTypes.func,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  autoFocus: PropTypes.bool,
  error: PropTypes.string,
  inputType: PropTypes.string,
};

PureEditableField.defaultProps = {
  blur: () => {},
  prefix: null,
  suffix: null,
  autoFocus: false,
  error: '',
  inputType: 'text',
};

const EditableField = ({ value, update, ...props }) => (
  <OptimisticValue value={value} update={update} resetOnError={false}>
    {({ optimisticValue, optimisticUpdate, error }) => (
      <TrimmedValue value={optimisticValue} update={optimisticUpdate}>
        {(valueProps) => <PureEditableField {...props} {...valueProps} error={error} />}
      </TrimmedValue>
    )}
  </OptimisticValue>
);
EditableField.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  blur: PropTypes.func,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  autoFocus: PropTypes.bool,
};

EditableField.defaultProps = {
  blur: () => {},
  prefix: null,
  suffix: null,
  autoFocus: false,
};

export default EditableField;

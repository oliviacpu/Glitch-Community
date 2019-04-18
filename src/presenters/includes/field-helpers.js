import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

export class OptimisticValue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value, // value is only set when waiting for server response
      error: null, // error is only set if there is an error ¯\_(ツ)_/¯
    };

    this.onChange = this.onChange.bind(this);
    this.update = debounce(this.update.bind(this), 500);
  }

  onChange(value) {
    this.update(value);
    this.setState({ value });
  }

  async update(value) {
    try {
      await this.props.update(value);
      this.setState((prevState, props) => {
        // if value didn't change during this update then switch back to props
        if (prevState.value === props.value) {
          return { value: null, error: null };
        }
        return { error: null };
      });
    } catch (error) {
      this.setState((prevState, props) => {
        // The update failed; we can ignore this if our state has already moved on
        if (prevState.value !== value) {
          return {};
        }

        // Ah, we haven't moved on, and we know the last edit failed.
        // Ok, display an error.
        if (props.resetOnError) {
          return { error, value: null };
        }
        return { error };
      });
    }
  }

  render() {
    return this.props.children({
      optimisticValue: this.state.value !== null ? this.state.value : this.props.value,
      error: this.state.error,
      optimisticUpdate: this.onChange,
    });
  }
}
OptimisticValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  update: PropTypes.func.isRequired,
  resetOnError: PropTypes.bool,
};
OptimisticValue.defaultProps = {
  resetOnError: true,
};

export class TrimmedValue extends React.Component {
  constructor(props) {
    super(props);
    let valueToStore = props.value;
    if (valueToStore === null) {
      valueToStore = '';
    }
    this.state = { value: valueToStore };
    this.update = this.update.bind(this);
  }

  update(value) {
    this.props.update(value.trim());
    this.setState({ value });
  }

  render() {
    return this.props.children({
      value: this.state.value.trim() === this.props.value ? this.state.value : this.props.value,
      update: this.update,
    });
  }
}
TrimmedValue.propTypes = {
  value: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
};

export const FieldErrorIcon = () => (
  <span className="editable-field-error-icon" role="img" aria-label="Warning">
    🚒
  </span>
);

export const FieldErrorMessage = ({ error, hideIcon }) => (
  <span className="editable-field-error-message">
    {!hideIcon && <FieldErrorIcon />}
    {error}
  </span>
);
FieldErrorMessage.propTypes = {
  error: PropTypes.node.isRequired,
  hideIcon: PropTypes.bool,
};
FieldErrorMessage.defaultProps = {
  hideIcon: false,
};

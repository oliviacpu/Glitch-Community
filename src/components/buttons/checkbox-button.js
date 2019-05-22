import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import useUniqueId from '../../hooks/use-unique-id';

import styles from './button.styl';
import checkboxStyles from './checkbox-button.styl';

const cx = classNames.bind(styles);

const CheckboxButton = ({ children, onChange, value, matchBackground }) => {
  const id = useUniqueId();
  const className = cx({ btn: true, small: true, label: true, matchBackground });
  return (
    <label className={className} htmlFor={id}>
      <input
        id={id}
        className={checkboxStyles.input}
        type="checkbox"
        checked={value}
        onChange={(evt) => onChange(evt.target.checked)}
      />
      {children}
    </label>
  );
};

CheckboxButton.propTypes = {
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
  matchBackground: PropTypes.bool,
};

CheckboxButton.defaultProps = {
  matchBackground: false,
};

export default CheckboxButton;

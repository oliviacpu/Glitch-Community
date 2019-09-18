import React from 'react';
import PropTypes from 'prop-types';

import styles from './input-error-message.styl';

const InputErrorMessage = ({ children }) => <span className={styles.errorMessage}>{children}</span>;

InputErrorMessage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default InputErrorMessage;

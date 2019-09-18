import React from 'react';
import PropTypes from 'prop-types';

const InputErrorIcon = ({ className }) => (
  <span role="img" aria-label="Warning" className={className}>
    🚒
  </span>
);

InputErrorIcon.propTypes = {
  className: PropTypes.string,
};

InputErrorIcon.defaultProps = {
  className: undefined,
};

export default InputErrorIcon;

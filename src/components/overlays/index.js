import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';



const Overlay = ({ children, className }) => {
  const overlayClass = classNames(styles.overlay, className);
  return (
    <dialog className={overlayClass} open>
      {children}
    </dialog>
  );
};

Overlay.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Overlay.defaultProps = {
  className: null,
};
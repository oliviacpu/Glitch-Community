import React from 'react';
import PropTypes from 'prop-types';

import Link from 'Components/link';
import Logo from 'Components/header/logo';
import Heading from 'Components/text/heading';

import styles from './auth-layout.styl';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './overlays.styl';

export const Overlay = ({ children, className }) => {
  const overlayClass = classNames(styles.overlay, className);
  return (
    <div className={overlayClass}>
      {children}
    </div>
  );
};
Overlay.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  ariaModal: PropTypes.bool,
};
Overlay.defaultProps = {
  className: null,
  ariaLabelledBy: '',
  ariaModal: false,
};

export const OverlaySection = ({ children, type }) => {
  const sectionClass = classNames(styles.section, styles[type]);
  return <section className={sectionClass}>{children}</section>;
};
OverlaySection.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['info', 'actions']).isRequired,
};

export const OverlayTitle = ({ children, id }) => (
  <h1 className={styles.title} id={id}>
    {children}
  </h1>
);
OverlayTitle.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
};
OverlayTitle.defaultProps = {
  id: '', // for aria labelled by purposes only
};

export const OverlayBackground = () => <div className={styles.overlayBackground} role="presentation" tabIndex={-1} />;

const SignInLayout = ({ children }) => (
  <div className={styles.layout}>
    <div className={styles.logo}>
      <Link to="/">
        <Logo />
      </Link>
    </div>
    <div className={styles.form}>{children}</div>
  </div>
);

SignInLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SignInLayout;

import React from 'react';
import PropTypes from 'prop-types';

import Link from 'Components/link';
import Logo from 'Components/header/logo';
import Heading from 'Components/text/heading';

import styles from './auth-layout.styl';

import classNames from 'classnames';

export const OverlaySection = ({ children, type }) => {
  const sectionClass = classNames(styles.section, styles[type]);
  return <section className={sectionClass}>{children}</section>;
};
OverlaySection.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['info', 'actions']).isRequired,
};

export const OverlayBackground = () => <div className={styles.overlayBackground} role="presentation" tabIndex={-1} />;

const SignInLayout = ({ children }) => (
  <div className={styles.layout}>
    <div className={styles.logo}>
      <Link to="/">
        <Logo />
      </Link>
    </div>
    <div className={styles.overlay}>
      <Heading className={styles.title}>
        Sign In
      </Heading>
    </div>
  </div>
);

SignInLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SignInLayout;

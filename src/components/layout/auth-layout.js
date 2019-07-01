import React from 'react';
import PropTypes from 'prop-types';

import Link from 'Components/link';
import Logo from 'Components/header/logo';
import Heading from 'Components/text/heading';

import styles from './auth-layout.styl';

const AuthLayout = ({ children }) => (
  <div className={styles.layout}>
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.about}>
          <div className={styles.logo}>
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <div className={styles.whatIsGlitch}>
            <Heading tagName="h1">Glitch is the friendly community where anyone can create the web</Heading>
          </div>
        </div>
        <div className={styles.form}>
          {children}
        </div>
      </div>
    </div>
  </div>
);

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthLayout;

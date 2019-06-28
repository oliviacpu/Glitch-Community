import React from 'react';
import PropTypes from 'prop-types';

import Link from 'Components/link';
import Logo from 'Components/header/logo';
import Heading from 'Components/text/heading';

import styles from './auth-layout.styl';

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

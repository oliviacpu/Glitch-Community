/**
 * Login page for Glitch VS Code Plugin
 */
import React from 'react';
import PropTypes from 'prop-types';

import Link from 'Components/link';
import Logo from 'Components/header/logo';
import Heading from 'Components/text/heading';
import TwoFactorForm from 'Components/sign-in/two-factor-form';

import styles from './two-factor-code.styl';

const TwoFactorCodePage = ({ initialToken, onSuccess }) => (
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
        <div className={styles.code}>
          <TwoFactorForm initialToken={initialToken} onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  </div>
);

TwoFactorCodePage.propTypes = {
  initialToken: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default TwoFactorCodePage;

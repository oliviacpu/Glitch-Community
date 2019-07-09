import React from 'react';
import classNames from 'classnames';

import Link from 'Components/link';
import Logo from 'Components/header/logo';
import Text from 'Components/text/text';
import PasswordLogin from 'Components/sign-in/password-login';
import SignInButton, { companyNames } from 'Components/buttons/sign-in-button';

import styles from './sign-in-layout.styl';

const SignInButtons = () => companyNames.map((companyName) => <SignInButton companyName={companyName} />);

const TermsAndConditions = () => (
  <div className={styles.termsAndConditions}>
    By signing into Glitch, you agree to our <Link to="/legal/#tos">Terms of Services</Link> and <Link to="/legal/#privacy">Privacy Statement</Link>
  </div>
);

const SignInLayout = () => (
  <div className={styles.layout}>
    <div className={styles.logo}>
      <Link to="/">
        <Logo />
      </Link>
    </div>
    <div className={styles.overlay}>
      <section className={classNames(styles.section, styles.info)}>
        <h1 className={styles.title}>Sign In</h1>
      </section>
      <section className={classNames(styles.section, styles.actions)}>
        <div className={styles.content}>
          <PasswordLogin />
          <div>
            <Text>You can sign in without a password too.</Text>
            <SignInButtons />
            <TermsAndConditions />
          </div>
        </div>
      </section>
    </div>
  </div>
);

export default SignInLayout;

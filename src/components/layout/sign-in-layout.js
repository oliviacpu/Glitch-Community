import React from 'react';
import classNames from 'classnames';

import Link from 'Components/link';
import Logo from 'Components/header/logo';
import Text from 'Components/text/text';
import Image from 'Components/images/image';
import PasswordLogin from 'Components/sign-in/password-login';
import SignInButton, { companyNames } from 'Components/buttons/sign-in-button';

import styles from './sign-in-layout.styl';

const keyImageUrl = 'https://cdn.glitch.com/8ae9b195-ef39-406b-aee0-764888d15665%2Foauth-key.svg?1544466885907';

const SignInButtons = () => <div className={styles.signInButtons}>{companyNames.map((companyName) => <SignInButton short companyName={companyName} />)}</div>;

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
          <div>
            <SignInButtons />
            <TermsAndConditions />
          </div>
          <Image src={keyImageUrl} alt="" width="370px" />
        </div>
      </section>
    </div>
  </div>
);

export default SignInLayout;

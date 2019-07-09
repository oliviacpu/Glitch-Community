import React from 'react';

import Link from 'Components/link';
import Logo from 'Components/header/logo';
import Button from 'Components/buttons/button';
import Image from 'Components/images/image';
import PasswordLogin from 'Components/sign-in/password-login';
import SignInButton, { companyNames } from 'Components/buttons/sign-in-button';

import styles from './sign-in-layout.styl';

const keyImageUrl = 'https://cdn.glitch.com/8ae9b195-ef39-406b-aee0-764888d15665%2Foauth-key.svg?1544466885907';

const SignInButtons = () => (
  <div className={styles.signInButtons}>
    {companyNames.map((companyName) => (
      <div key={companyName} className={styles.signInButton}>
        <SignInButton short companyName={companyName} />
      </div>
    ))}
  </div>
);

const MagicCodeButton = () => (
  <div className={styles.signInButtons}>
    <Button emoji="loveLetter">Magic Code via Email</Button>
  </div>
);

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
      <section className={styles.title}>
        <h1>Sign In</h1>
      </section>
      <section className={styles.content}>
        <div className={styles.oauthSection}>
          <div>
            <SignInButtons />
            <MagicCodeButton />
          </div>
          <TermsAndConditions />
        </div>
        <div className={styles.passwordSection}>
          <div className={styles.keyImage}>
            <Image src={keyImageUrl} alt="Door and key illustration" width={200} />
          </div>
        </div>
      </section>
    </div>
  </div>
);

export default SignInLayout;

import React from 'react';

import Link from 'Components/link';
import Logo from 'Components/header/logo';
import Button from 'Components/buttons/button';
import SignInButton, { companyNames } from 'Components/buttons/sign-in-button';
import Image from 'Components/images/image';
import PasswordLogin from 'Components/sign-in/password-login';
import UseMagicCode from 'Components/sign-in/use-magic-code';
import GetMagicCode from 'Components/sign-in/get-magic-code';

import useDevToggle from 'State/dev-toggles';

import styles from './sign-in-layout.styl';

const keyImageUrl = 'https://cdn.glitch.com/8ae9b195-ef39-406b-aee0-764888d15665%2Foauth-key.svg?1544466885907';

const SignInButtons = () => {
  const slackAuthEnabled = useDevToggle('Slack Auth');
  return (
    <div className={styles.signInButtons}>
      {companyNames
        .filter((companyName) => {
          return companyName !== 'slack' || slackAuthEnabled;
        })
        .map((companyName) => (
          <div key={companyName} className={styles.signInButton}>
            <SignInButton short companyName={companyName} />
          </div>
        ))}
    </div>
  );
};

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

const SignInLayout = () => {
  return (
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
          <Magic />
        </section>
      </div>
    </div>
  );
};

const Main = () => {
  const userPasswordEnabled = useDevToggle('User Passwords');
  return (
    <>
      <div className={styles.oAuth}>
        <div>
          <SignInButtons />
          <MagicCodeButton />
        </div>
        <TermsAndConditions />
      </div>
      <div className={styles.passwordAuth}>
        {userPasswordEnabled ? <PasswordLogin /> : <Image src={keyImageUrl} alt="Door and key illustration" width={200} />}
      </div>
    </>
  );
};

const Magic = () => {
  const userPasswordEnabled = useDevToggle('User Passwords');
  return (
    <>
      <div className={styles.oAuth}>
        <GetMagicCode />
      </div>
      <div className={styles.passwordAuth}>
        <UseMagicCode />
      </div>
    </>
  );
};
export default SignInLayout;

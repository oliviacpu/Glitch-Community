/**
 * Login page for Glitch OAuth
 *
 * This is considered a proof of concept for OAuth.
 * It currently reuses Components/sign-in-pop to handle sign-in.
 *
 * IMPORTANT: This allows Discourse users to sign in to support with their Glitch accounts.
 *
 * Login via email only
 *
 * TODO: Allow login via username/password when that becomes available
 */

/* globals API_URL */

import React from 'react';

import PopoverContainer from 'Components/popover/container';
import { SignInPopBase as SignInPop } from 'Components/sign-in-pop';
import { useCurrentUser } from 'State/current-user';

import styles from './signin.styl';

const SignInPage = () => {
  const { currentUser } = useCurrentUser();
  const { persistentToken, login } = currentUser;
  const isSignedIn = persistentToken && login;

  React.useEffect(() => {
    if (isSignedIn) {
      const params = new URLSearchParams(window.location.search);
      params.append('authorization', persistentToken);
      window.location.assign(`${API_URL}/oauth/dialog/authorize?${params}`);
    }
  }, [isSignedIn]);

  if (isSignedIn) {
    return null;
  }

  return (
    <div className={styles.content}>
      <PopoverContainer>
        {() => <SignInPop align="none" />}
      </PopoverContainer>
    </div>
  );
};

export default SignInPage;

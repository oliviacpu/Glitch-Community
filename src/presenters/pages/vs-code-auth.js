/**
 * Login page for Glitch OAuth
 *
 * Login via email only
 *
 * TODO: Allow login via username/password when that becomes available
 *
 * IMPORTANT: This is considered a proof of concept for OAuth. It is nearly a direct
 * copy of /pop-overs/sign-in-pop.
 */
/* globals API_URL */
import React from 'react';
import PropTypes from 'prop-types';
import { captureException } from '../../utils/sentry';
import { useAPI } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';

const SignInPop = () => {
  const api = useAPI();
  const { currentUser } = useCurrentUser();
  const { persistentToken, login } = currentUser;
  const isSignedIn = persistentToken && login;

  if (isSignedIn) {
    return <div>signed in</div>;
  }

  return (
    <div>not signed in</div>
  );
};

export default SignInPop;

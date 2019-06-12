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

const VSCodeAuth = () => {
  const api = useAPI();
  const { currentUser } = useCurrentUser();
  const { persistentToken, login } = currentUser;
  const isSignedIn = persistentToken && login;

  window.location.assign(`vscode://glitch.glitch/token/${persistentToken}`);
  
  if (isSignedIn) {
    return <div>
      <p><span>You are being redirected. (If you aren't sent back to VS Code, try the "Glitch: Sign In With Email" command.)</span></p>
    </div>;
  }

  return (
    <div>not signed in</div>
  );
};

export default VSCodeAuth;

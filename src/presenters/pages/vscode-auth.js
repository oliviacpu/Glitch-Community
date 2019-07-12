/**
 * Login page for Glitch VS Code Plugin
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import SignInLayout from 'Components/layout/sign-in-layout';

import { useCurrentUser } from 'State/current-user';
import useLocalStorage from 'State/local-storage';

const KNOWN_DISTRIBUTION_SCHEMES = new Set([
  'vscode',
  'vscode-insiders',
  'vscodium',
]);

const VSCodeAuth = ({ scheme }) => {
  if (!KNOWN_DISTRIBUTION_SCHEMES.has(scheme)) { scheme = 'vscode'; }

  const { currentUser } = useCurrentUser();
  const { persistentToken, login } = currentUser;
  const isSignedIn = persistentToken && login;

  const redirectMessage = "You are being redirected. (If you aren't sent back to your editor, try signing in with an email code.)";

  const [, setDestination] = useLocalStorage('destinationAfterAuth');

  useEffect(() => {
    if (isSignedIn) {
      setTimeout(() => {
        const redirectUrl = `${scheme}://glitch.glitch/token?token=${persistentToken}`;
        window.location.assign(redirectUrl);
      }, 3000);
    } else {
      setDestination({
        expires: dayjs()
          .add(10, 'minutes')
          .toISOString(),
        to: {
          pathname: location.pathname,
          search: location.search,
        },
      });
    }
  }, [isSignedIn]);

  return isSignedIn ? <div style={{ margin: 20 }}>{redirectMessage}</div> : <SignInLayout />;
};

VSCodeAuth.propTypes = {scheme: PropTypes.string};

VSCodeAuth.defaultProps = {scheme: ''};

export default VSCodeAuth;

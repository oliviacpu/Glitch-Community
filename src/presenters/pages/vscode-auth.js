/**
 * Login page for Glitch VS Code Plugin
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import SignInLayout from 'Components/layout/sign-in-layout';

import { useCurrentUser } from 'State/current-user';
import useLocalStorage from 'State/local-storage';

const VSCodeAuth = ({ insiders, openProject }) => {
  const { currentUser } = useCurrentUser();
  const { persistentToken, login } = currentUser;
  const isSignedIn = persistentToken && login;

  const redirectMessage = "You are being redirected. (If you aren't sent back to VSCode, try signing in with an email code.)";

  const [, setDestination] = useLocalStorage('destinationAfterAuth');

  useEffect(() => {
    if (isSignedIn) {
      setTimeout(() => {
        const scheme = insiders ? 'vscode-insiders' : 'vscode';
        const redirectUrl = `${scheme}://glitch.glitch/token?token=${persistentToken}&openProject=${openProject}`;
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

VSCodeAuth.propTypes = {
  insiders: PropTypes.bool,
  openProject: PropTypes.bool,
};

VSCodeAuth.defaultProps = {
  insiders: false,
  openProject: false,
};

export default VSCodeAuth;

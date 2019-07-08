/**
 * Login page for Glitch VS Code Plugin
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import SignInLayout from 'Components/layout/sign-in-layout';
import PopoverContainer from 'Components/popover/container';
import Text from 'Components/text/text';
import { SignInPopBase as SignInPop } from 'Components/sign-in-pop';
import { useCurrentUser } from 'State/current-user';


const VSCodeAuth = ({ insiders, openProject }) => {
  const { currentUser } = useCurrentUser();
  const { persistentToken, login } = currentUser;
  const isSignedIn = persistentToken && login;

  const redirectMessage = "You are being redirected. (If you aren't sent back to VSCode, try signing in with an email code.)";
  const signInMessage = 'Please Sign In to continue.';

  useEffect(() => {
    if (isSignedIn) {
      setTimeout(() => {
        const scheme = insiders ? 'vscode-insiders' : 'vscode';
        const redirectUrl = `${scheme}://glitch.glitch/token?token=${persistentToken}&openProject=${openProject}`;
        window.location.assign(redirectUrl);
      }, 3000);
    }
  }, []);

  return (
    <SignInLayout>
      <Text>{isSignedIn ? redirectMessage : signInMessage}</Text>
      {!isSignedIn && <PopoverContainer>{() => <SignInPop align="none" />}</PopoverContainer>}
    </SignInLayout>
  );
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

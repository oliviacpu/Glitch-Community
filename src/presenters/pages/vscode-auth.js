/**
 * Login page for Glitch VS Code Plugin
 */
import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import Text from 'Components/text/text';
import SignInButton from 'Components/buttons/sign-in-button';
import Logo from 'Components/header/logo';
import { useCurrentUser } from 'State/current-user';
import useDevToggle from 'State/dev-toggles';
import useLocalStorage from 'State/local-storage';

import styles from './vscode-auth.styl';

const VSCodeAuth = ({ insiders, openProject }) => {
  const { currentUser } = useCurrentUser();
  const { persistentToken, login } = currentUser;
  const isSignedIn = persistentToken && login;

  const redirectMessage = "You are being redirected. (If you aren't sent back to VSCode, try the \"Glitch: Sign In With Email\" command.)";
  const signInMessage = 'Please Sign In to continue.';

  if (isSignedIn) {
    setTimeout(() => {
      const scheme = insiders ? 'vscode-insiders' : 'vscode';
      window.location.assign(`${scheme}://glitch.glitch/token?token=${persistentToken}&openProject=${openProject}`);
    }, 3000);
  }

  const slackAuthEnabled = useDevToggle('Slack Auth');
  const [, setDestination] = useLocalStorage('destinationAfterAuth');
  const onClick = () =>
    setDestination({
      expires: dayjs()
        .add(10, 'minutes')
        .toISOString(),
      to: {
        pathname: location.pathname,
        search: location.search,
      },
    });

  return (
    <div className={styles.content}>
      <div className={styles.whatIsGlitch}>
        <Logo />
        <Text>Glitch is the friendly community where anyone can create the web</Text>
      </div>
      <div className={styles.signIn}>
        <Text>{isSignedIn ? redirectMessage : signInMessage}</Text>
        {!isSignedIn &&
          <div>
            <SignInButton company="facebook" onClick={onClick} />
            <SignInButton company="github" onClick={onClick} />
            <SignInButton company="google" onClick={onClick} />
            {slackAuthEnabled && <SignInButton company="slack" onClick={onClick} />}
          </div>
        }
      </div>
    </div>
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

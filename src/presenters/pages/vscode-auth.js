/**
 * Login page for Glitch VS Code Plugin
 */
import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import Text from 'Components/text/text';
import Link from 'Components/link';
import Heading from 'Components/text/heading';
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
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.about}>
            <div className={styles.logo}>
              <Link to="/">
                <Logo />
              </Link>
            </div>
            <div className={styles.whatIsGlitch}>
              <Heading tagName="h1">Glitch is the friendly community where anyone can create the web</Heading>
            </div>
          </div>
          <div className={styles.signIn}>
            {isSignedIn &&
              <div>
                <Text>You are being redirected.</Text>
                <Text>(If you aren't sent back to VSCode, try the &quot;Glitch: Sign In With Email&quot; command.)</Text>
              </div>
            }
            {!isSignedIn &&
              <div>
                <Text>Please Sign In to continue.</Text>
                <SignInButton company="facebook" onClick={onClick} />
                <SignInButton company="github" onClick={onClick} />
                <SignInButton company="google" onClick={onClick} />
                {slackAuthEnabled && <SignInButton company="slack" onClick={onClick} />}
              </div>
            }
          </div>
        </div>
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

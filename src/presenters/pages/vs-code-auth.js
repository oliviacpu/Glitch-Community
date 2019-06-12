/**
 * Login page for Glitch VS Code Plugin
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useAPI } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';
import { captureException } from '../../utils/sentry';

import PopoverContainer from 'Components/popover/container';
import { SignInPopBase as SignInPop } from 'Components/sign-in-pop';

import styles from './vs-code-auth.styl';

const VSCodeAuth = ({ insiders, openProject }) => {
  const api = useAPI();
  const { currentUser } = useCurrentUser();
  const { persistentToken, login } = currentUser;
  const isSignedIn = persistentToken && login;
  
  if (isSignedIn) {
    setTimeout(() => {
      const scheme = insiders ? 'vscode-insiders' : 'vscode';
      window.location.assign(`${scheme}://glitch.glitch/token?token=${persistentToken}&openProject=${openProject}`);
    
    }, 3000);

    return <div className={styles.content}>
      <p>
        <span>You are being redirected. (If you aren't sent back to VS Code, try the "Glitch: Sign In With Email" command.)</span>
      </p>
    </div>;
  }

  return <div className={styles.content}>
      <p>
        <span>Please Sign In to continue.</span>
      </p>
      <PopoverContainer children={() => <SignInPop align='none' />}/>
    </div>;
};

VSCodeAuth.propTypes = {
  insiders: PropTypes.bool,
  openProject: PropTypes.bool,
};

VSCodeAuth.defaultProps = {
  insiders: false,
  openProject: false,
}

export default VSCodeAuth;

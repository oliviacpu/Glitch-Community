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


const VSCodeAuth = ({ insiders }) => {
  const api = useAPI();
  const { currentUser } = useCurrentUser();
  const { persistentToken, login } = currentUser;
  const isSignedIn = persistentToken && login;
  
  if (isSignedIn) {
    const scheme = insiders ? 'vscode-insiders' : 'vscode';
    window.location.assign(`${scheme}://glitch.glitch/token/${persistentToken}`);
    
    return <div>
      <p>
        <span>You are being redirected. (If you aren't sent back to VS Code, try the "Glitch: Sign In With Email" command.)</span>
      </p>
    </div>;
  }

  return <PopoverContainer children={() => <SignInPop align='left' />}/>
};

VSCodeAuth.propTypes = {
  insiders: PropTypes.bool,
};

VSCodeAuth.defaultProps = {
  insiders: false,
}

export default VSCodeAuth;

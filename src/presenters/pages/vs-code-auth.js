/**
 * Login page for Glitch VS Code Plugin
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useAPI } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';
import { captureException } from '../../utils/sentry';

import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import { parseOneAddress } from 'email-addresses';
import { debounce } from 'lodash';

import Button from 'Components/buttons/button';
import Emoji from 'Components/images/emoji';
import TextInput from 'Components/inputs/text-input';
import Link from 'Components/link';
import Loader from 'Components/loader';

import useLocalStorage from 'State/local-storage';

/* global GITHUB_CLIENT_ID, FACEBOOK_CLIENT_ID, APP_URL, API_URL */

function githubAuthLink() {
  const params = new URLSearchParams();
  params.append('client_id', GITHUB_CLIENT_ID);
  params.append('scope', 'user:email');
  params.append('redirect_uri', `${APP_URL}/login/github`);
  return `https://github.com/login/oauth/authorize?${params}`;
}

function facebookAuthLink() {
  const params = new URLSearchParams();
  params.append('client_id', FACEBOOK_CLIENT_ID);
  params.append('scope', 'email');
  params.append('redirect_uri', `${APP_URL}/login/facebook`);
  return `https://www.facebook.com/v2.9/dialog/oauth?${params}`;
}

function googleAuthLink() {
  const params = new URLSearchParams();
  const callbackURL = `${APP_URL}/login/google`;
  params.append('callbackURL', callbackURL);
  return `${API_URL}/auth/google?${params}`;
}

function slackAuthLink() {
  const params = new URLSearchParams();
  const callbackURL = `${APP_URL}/login/slack`;
  params.append('callbackURL', callbackURL);
  return `${API_URL}/auth/slack?${params}`;
}

const SignInPopButton = ({ company, emoji, href, onClick }) => (
  <Button href={href} onClick={onClick} size="small">
    Sign in with {company} <Emoji name={emoji} />
  </Button>
);

const VSCodeAuth = ({ insiders }) => {
  const api = useAPI();
  const { currentUser } = useCurrentUser();
  const { persistentToken, login } = currentUser;
  const isSignedIn = persistentToken && login;
  
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

  const setDestinationAnd = (next) => () => {
    onClick();
    next();
  };
  
  if (isSignedIn) {
    const scheme = insiders ? 'vscode-insiders' : 'vscode';
    window.location.assign(`${scheme}://glitch.glitch/token/${persistentToken}`);
    
    return <div>
      <p>
        <span>You are being redirected. (If you aren't sent back to VS Code, try the "Glitch: Sign In With Email" command.)</span>
      </p>
    </div>;
  }

  return <SignInPop align={true} />
};

VSCodeAuth.propTypes = {
  insiders: PropTypes.bool,
};

VSCodeAuth.defaultProps = {
  insiders: false,
}

export default VSCodeAuth;

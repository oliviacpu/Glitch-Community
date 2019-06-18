import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import Button from 'Components/buttons/button';
import Emoji from 'Components/images/emoji';
import Link from 'Components/link';

import styles from './styles.styl';

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

const companies = {
  facebook: {
    name: '',
    emoji: '',
    authLink: AuthLink()
  },
  github: {
    name: '',
    emoji: '',
    authLink: AuthLink()
  },
  google: {
    name: '',
    emoji: '',
    authLink: AuthLink()
  },
  slack: {
    name: '',
    emoji: '',
    authLink: AuthLink()
  },
}

const SignInButton = ({ company, emoji, href, onClick }) => (
  <div style={{ marginBottom: '10px' }}>
    <Button href={href} onClick={onClick} size="small" emoji={emoji}>
      Sign in with {company}
    </Button>
  </div>
);

export default SignInButton;
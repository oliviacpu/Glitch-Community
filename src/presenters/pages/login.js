/* globals APP_URL analytics */

import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { captureException } from '../../utils/sentry';

import useLocalStorage from '../includes/local-storage';
import { useCurrentUserActions } from '../../state/current-user';
import { useAPI } from '../../state/api';
import { EmailErrorPage, OauthErrorPage } from './error';

// The Editor may embed /login/* endpoints in an iframe in order to share code.
// NotifyParent allows the editor to receive messages from this page.
// We use this to pass on auth success/failure messages.
function notifyParent(message = {}) {
  if (window.parent === window) {
    return;
  }

  // Specifically target our same origin (APP_URL) ;
  // we're only communicating between the editor and its corresponding ~community site,
  // not across other environments.

  // Add 'LoginMessage' to all messages of this type so that the Editor
  // can filter for them specifically.
  message.type = 'LoginMessage';

  window.parent.postMessage(message, APP_URL);
}

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      done: false,
      redirect: { pathname: '/' },
      error: false,
      errorMessage: null,
    };
  }

  async componentDidMount() {
    const { api, provider, url, destination } = this.props;
    this.props.setDestination(undefined);

    try {
      const { data } = await api.post(url);
      if (data.id <= 0) {
        throw new Error(`Bad user id (${data.id}) after ${provider} login`);
      }

      console.log('LOGGED IN', data.id);
      this.props.setUser(data);

      if (destination && destination.expires > new Date().toISOString()) {
        this.setState({ redirect: destination.to });
      }

      this.setState({ done: true });
      analytics.track('Signed In', { provider });
      notifyParent({ success: true, details: { provider } });
    } catch (error) {
      this.setState({ error: true });

      const errorData = error && error.response && error.response.data;
      if (errorData && errorData.message) {
        this.setState({ errorMessage: errorData.message });
      }

      if (error && error.response && error.response.status !== 401) {
        console.error('Login error.', errorData);
        captureException(error);
      }
      const details = { provider, error: errorData };
      notifyParent({ success: false, details });
    }
  }

  render() {
    if (this.state.done) {
      return <Redirect to={this.state.redirect} />;
    }
    if (this.state.error) {
      const genericDescription = "Hard to say what happened, but we couldn't log you in. Try again?";
      if (this.props.provider === 'Email') {
        return (
          <EmailErrorPage
            api={this.props.api}
            title={`${this.props.provider} Login Problem`}
            description={this.state.errorMessage || genericDescription}
          />
        );
      }
      return (
        <OauthErrorPage
          api={this.props.api}
          title={`${this.props.provider} Login Problem`}
          description={this.state.errorMessage || genericDescription}
        />
      );
    }
    return <div className="content" />;
  }
}
LoginPage.propTypes = {
  api: PropTypes.any.isRequired,
  url: PropTypes.string.isRequired,
  provider: PropTypes.string.isRequired,
  setUser: PropTypes.func.isRequired,
  destination: PropTypes.shape({
    expires: PropTypes.string.isRequired,
    to: PropTypes.object.isRequired,
  }),
};

LoginPage.defaultProps = {
  destination: null,
};

const LoginPageContainer = (props) => {
  const { loggedIn } = useCurrentUserActions();
  const api = useAPI();
  const [destination, setDestination] = useLocalStorage('destinationAfterAuth', null);
  return <LoginPage setUser={loggedIn} destination={destination} setDestination={setDestination} api={api} {...props} />;
};

export const FacebookLoginPage = ({ code, ...props }) => {
  const callbackUrl = `${APP_URL}/login/facebook`;
  const url = `/auth/facebook/${code}?callbackURL=${encodeURIComponent(callbackUrl)}`;
  return <LoginPageContainer {...props} provider="Facebook" url={url} />;
};

export const GitHubLoginPage = ({ code, ...props }) => {
  const url = `/auth/github/${code}`;
  return <LoginPageContainer {...props} provider="GitHub" url={url} />;
};

export const EmailTokenLoginPage = ({ token, ...props }) => {
  const url = `/auth/email/${token}`;
  return <LoginPageContainer {...props} provider="Email" url={url} />;
};

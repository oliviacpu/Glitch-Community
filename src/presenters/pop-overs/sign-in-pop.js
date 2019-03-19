import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';

import { Link } from '../includes/link';
import useLocalStorage from '../includes/local-storage';
import PopoverWithButton from './popover-with-button';
import { captureException } from '../../utils/sentry';
import { useCurrentUser } from '../../state/current-user';
import { useAPI } from '../../state/api';
import { NestedPopover, NestedPopoverTitle } from './popover-nested';

/* global GITHUB_CLIENT_ID, FACEBOOK_CLIENT_ID, APP_URL */

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

const SignInPopButton = (props) => (
  <Link className="button button-small button-link has-emoji" to={props.href} onClick={props.onClick}>
    Sign in with {props.company} <span className={`emoji ${props.emoji}`} />
  </Link>
);

class EmailHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      done: false,
      error: false,
      errorMsg: '',
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ email: e.target.value });
  }

  async onSubmit(e) {
    e.preventDefault();
    this.setState({ done: true });
    try {
      await this.props.api.post('/email/sendLoginEmail', {
        emailAddress: this.state.email,
      });
      this.setState({ error: false });
    } catch (error) {
      if (error && error.response) {
        if (error.response.status === 429) {
          this.setState({
            error: true,
            errorMsg: 'Sign in code sent recently. Please check your email.',
          });
        } else if (error.response.status === 400) {
          this.setState({ error: true, errorMsg: 'Email address is invalid.' });
        } else {
          captureException(error);
          this.setState({
            error: true,
            errorMsg: 'Something went wrong, email not sent.',
          });
        }
      } else {
        captureException(error);
        this.setState({
          error: true,
          errorMsg: 'Something went wrong, email not sent.',
        });
      }
    }
  }

  render() {
    const isEnabled = this.state.email.length > 0;
    return (
      <NestedPopover alternateContent={() => <SignInWithConsumer {...this.props} />} startAlternateVisible={false}>
        {(showCodeLogin) => (
          <dialog className="pop-over sign-in-pop">
            <NestedPopoverTitle>
              Email Sign In <span className="emoji email" />
            </NestedPopoverTitle>
            <section className="pop-over-actions first-section">
              {!this.state.done && (
                <form onSubmit={this.onSubmit} style={{ marginBottom: 0 }}>
                  <input value={this.state.email} onChange={this.onChange} className="pop-over-input" type="email" placeholder="new@user.com" />
                  <button type="submit" style={{ marginTop: 10 }} className="button-small button-link" disabled={!isEnabled}>
                    Send Link
                  </button>
                </form>
              )}
              {this.state.done && !this.state.error && (
                <>
                  <div className="notification notifyPersistent notifySuccess">Almost Done</div>
                  <div>Finish signing in from the email sent to {this.state.email}.</div>
                </>
              )}
              {this.state.done && this.state.error && (
                <>
                  <div className="notification notifyPersistent notifyError">Error</div>
                  <div>{this.state.errorMsg}</div>
                </>
              )}
            </section>
            {this.state.done && !this.state.error && (
              <SignInCodeSection
                onClick={() => {
                  showCodeLogin(this.props.api);
                }}
              />
            )}
          </dialog>
        )}
      </NestedPopover>
    );
  }
}

class SignInCodeHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      done: false,
      error: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ code: e.target.value });
  }

  async onSubmit(e) {
    e.preventDefault();
    this.setState({ done: true });
    try {
      const { data } = await this.props.api.post(`/auth/email/${this.state.code}`);
      this.props.setUser(data);
      this.setState({ error: false });
    } catch (error) {
      if (error && error.response && error.response.status !== 401) {
        captureException(error);
      }
      this.setState({ error: true });
    }
  }

  render() {
    const isEnabled = this.state.code.length > 0;
    return (
      <dialog className="pop-over sign-in-pop">
        <NestedPopoverTitle>Use a sign in code</NestedPopoverTitle>
        <section className="pop-over-actions first-section">
          {!this.state.done && (
            <form onSubmit={this.onSubmit} style={{ marginBottom: 0 }}>
              Paste your temporary sign in code below
              <input value={this.state.code} onChange={this.onChange} className="pop-over-input" type="text" placeholder="cute-unique-cosmos" />
              <button style={{ marginTop: 10 }} className="button-small button-link" disabled={!isEnabled} type="submit">
                Sign In
              </button>
            </form>
          )}
          {this.state.done && !this.state.error && (
            <>
              <div className="notification notifyPersistent notifySuccess">Success!</div>
            </>
          )}
          {this.state.done && this.state.error && (
            <>
              <div className="notification notifyPersistent notifyError">Error</div>
              <div>Code not found or already used. Try signing in with email.</div>
            </>
          )}
        </section>
      </dialog>
    );
  }
}

const SignInWithConsumer = (props) => {
  const { login } = useCurrentUser();
  return <SignInCodeHandler setUser={login} {...props} />;
};

const EmailSignInButton = ({ onClick }) => (
  <button
    className="button button-small button-link has-emoji"
    type="button"
    onClick={() => {
      onClick();
    }}
  >
    Sign in with Email <span className="emoji email" />
  </button>
);
EmailSignInButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const SignInCodeSection = ({ onClick }) => (
  <section className="pop-over-actions last-section pop-over-info">
    <button className="button-small button-tertiary button-on-secondary-background" onClick={onClick} type="button">
      <span>Use a sign in code</span>
    </button>
  </section>
);
SignInCodeSection.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const SignInPopWithoutRouter = (props) => {
  const { header, prompt, api, location, hash } = props;
  const [, setDestination] = useLocalStorage('destinationAfterAuth');
  const onClick = () =>
    setDestination({
      expires: dayjs()
        .add(10, 'minutes')
        .toISOString(),
      to: {
        pathname: location.pathname,
        search: location.search,
        hash,
      },
    });
  return (
    <NestedPopover alternateContent={() => <EmailHandler {...props} />} startAlternateVisible={false}>
      {(showEmailLogin) => (
        <NestedPopover alternateContent={() => <SignInWithConsumer {...props} />} startAlternateVisible={false}>
          {(showCodeLogin) => (
            <div className="pop-over sign-in-pop">
              {header}
              <section className="pop-over-actions first-section">
                {prompt}
                <SignInPopButton href={facebookAuthLink()} company="Facebook" emoji="facebook" onClick={onClick} />
                <SignInPopButton href={githubAuthLink()} company="GitHub" emoji="octocat" onClick={onClick} />
                <EmailSignInButton
                  onClick={() => {
                    onClick();
                    showEmailLogin(api);
                  }}
                />
              </section>
              <SignInCodeSection
                onClick={() => {
                  onClick();
                  showCodeLogin(api);
                }}
              />
            </div>
          )}
        </NestedPopover>
      )}
    </NestedPopover>
  );
};

export const SignInPopBase = withRouter(SignInPopWithoutRouter);
SignInPopBase.propTypes = {
  api: PropTypes.func,
  header: PropTypes.node,
  prompt: PropTypes.node,
  hash: PropTypes.string,
};

const SignInPopContainer = (props) => {
  const api = useAPI();
  return (
    <PopoverWithButton buttonClass="button button-small" buttonText="Sign in" passToggleToPop>
      <SignInPopBase {...props} api={api} />
    </PopoverWithButton>
  );
};
export default SignInPopContainer;

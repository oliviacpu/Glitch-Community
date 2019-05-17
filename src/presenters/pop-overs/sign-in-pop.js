import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import { parseOneAddress } from 'email-addresses';
import debounce from 'lodash/debounce';
import Button from 'Components/buttons/button';
import Emoji from 'Components/images/emoji';
import TextInput from 'Components/inputs/text-input';
import Link from 'Components/link';
import { PopoverWithButton, NestedPopover, NestedPopoverTitle, PopoverDialog, PopoverActions, PopoverInfo } from 'Components/popover';
import useLocalStorage from '../../state/local-storage';
import { captureException } from '../../utils/sentry';
import { useAPI } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';
import useDevToggle from '../includes/dev-toggles';

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

class EmailHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      done: false,
      error: false,
      errorMsg: '',
    };
    this.debouncedValidate = debounce(this.validate.bind(this), 500);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(email) {
    this.setState({ email });
    this.debouncedValidate(email);
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

  validate(email) {
    const isValidEmail = parseOneAddress(email) !== null;
    this.setState({ errorMsg: isValidEmail ? undefined : 'Enter a valid email address' });
  }

  render() {
    const isEnabled = this.state.email.length > 0;
    return (
      <NestedPopover alternateContent={() => <SignInWithConsumer {...this.props} />} startAlternateVisible={false}>
        {(showCodeLogin) => (
          <dialog className="pop-over sign-in-pop" ref={this.props.focusFirstElement}>
            <NestedPopoverTitle>
              Email Sign In <span className="emoji email" />
            </NestedPopoverTitle>
            <section className="pop-over-actions first-section">
              {!this.state.done && (
                <form onSubmit={this.onSubmit} style={{ marginBottom: 0 }}>
                  <TextInput
                    type="email"
                    labelText="Email address"
                    value={this.state.email}
                    onChange={this.onChange}
                    placeholder="new@user.com"
                    error={this.state.errorMsg}
                  />
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
      <dialog className="pop-over sign-in-pop" ref={this.props.focusFirstElement}>
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
  <Button size="small" onClick={onClick}>
    Sign in with Email <Emoji name="email" />
  </Button>
);
EmailSignInButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const NewUserInfoSection = () => (
  <PopoverActions>
      <Emoji name="carp" /> New to Glitch? Create an account by signing in.
  </PopoverActions>
);

const SignInCodeSection = ({ onClick }) => (
  <PopoverActions type="secondary">
    <Button size="small" type="tertiary" matchBackground onClick={onClick} >
      Use a sign in code
    </Button>
  </PopoverActions>
);

const TermsAndPrivacySection = () => (
  <PopoverInfo>
    By signing into Glitch, you agree to our <Link to="/legal/#tos">Terms of Services</Link> and <Link to="/legal/#privacy">Privacy Statement</Link>
  </PopoverInfo>
);

const SignInPopBase = withRouter((props) => {
  const api = useAPI();
  const { hash, header, prompt, location } = props;
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
        hash,
      },
    });
  return (
    <NestedPopover alternateContent={() => <EmailHandler {...props} />}>
      {(showEmailLogin) => (
        <NestedPopover alternateContent={() => <SignInWithConsumer {...props} />}>
          {(showCodeLogin) => (
            <PopoverDialog className="sign-in-pop" focusOnDialog>
              {header}
              <NewUserInfoSection />
              <TermsAndPrivacySection />
              <PopoverActions>
                {prompt}
                <SignInPopButton href={facebookAuthLink()} company="Facebook" emoji="facebook" onClick={onClick} />
                <SignInPopButton href={githubAuthLink()} company="GitHub" emoji="octocat" onClick={onClick} />
                <SignInPopButton href={googleAuthLink()} company="Google" emoji="google" onClick={onClick} />
                {slackAuthEnabled && <SignInPopButton href={slackAuthLink()} company="Slack" emoji="slack" onClick={onClick} />}
                <EmailSignInButton
                  onClick={() => {
                    onClick();
                    showEmailLogin(api);
                  }}
                />
              </PopoverActions>
              <SignInCodeSection
                onClick={() => {
                  onClick();
                  showCodeLogin(api);
                }}
              />
            </PopoverDialog>
          )}
        </NestedPopover>
      )}
    </NestedPopover>
  );
});

SignInPopBase.propTypes = {
  hash: PropTypes.string,
  header: PropTypes.node,
  prompt: PropTypes.node,
};

const SignInPopContainer = () => (
  <PopoverWithButton buttonProps={{ size: 'small' }} buttonText="Sign in">
    {() => <SignInPopBase />}
  </PopoverWithButton>
);

export default SignInPopContainer;

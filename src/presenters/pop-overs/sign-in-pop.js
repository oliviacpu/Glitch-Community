import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import { parseOneAddress } from 'email-addresses';
import debounce from 'lodash/debounce';
import Button from 'Components/buttons/button';
import Emoji from 'Components/images/emoji';
import TextInput from 'Components/inputs/text-input';
import Link from 'Components/link';
import { PopoverWithButton, MultiPopover, MultiPopoverTitle, PopoverDialog, PopoverActions, PopoverInfo } from 'Components/popover';
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
            <MultiPopoverTitle>
              Email Sign In <span className="emoji email" />
            </MultiPopoverTitle>
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

// TODO
const PopoverInput = 'input';

const SignInWithConsumer = ({ set }) => {
  const { login } = useCurrentUser();
  const { api } = useAPI();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('ready');
  const isEnabled = code.length > 0;

  async function onSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    try {
      const { data } = await api.post(`/auth/email/${code}`);
      login(data);
      setStatus('success');
    } catch (error) {
      if (error && error.response && error.response.status !== 401) {
        captureException(error);
      }
      setStatus('error');
    }
  }

  return (
    <PopoverDialog className="pop-over sign-in-pop">
      <MultiPopoverTitle>Use a sign in code</MultiPopoverTitle>
      <PopoverActions>
        {status === 'ready' && (
          <form onSubmit={onSubmit} style={{ marginBottom: 0 }}>
            Paste your temporary sign in code below
            <PopoverInput value={code} onChange={(e) => setCode(e.target.value)} type="text" placeholder="cute-unique-cosmos" />
            <Button style={{ marginTop: 10 }} suze="small" disabled={!isEnabled} type="submit">
              Sign In
            </Button>
          </form>
        )}
        {status === 'success' && <div className="notification notifyPersistent notifySuccess">Success!</div>}
        {status === 'error' && (
          <>
            <div className="notification notifyPersistent notifyError">Error</div>
            <div>Code not found or already used. Try signing in with email.</div>
          </>
        )}
      </PopoverActions>
    </PopoverDialog>
  );
};

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

  const setDestinationAnd = (next) => () => {
    onClick();
    next();
  };

  return (
    <MultiPopover
      views={{
        email: () => <EmailHandler />,
        signInCode: () => <SignInWithConsumer />,
      }}
    >
      {(showView) => (
        <PopoverDialog className="sign-in-pop" focusOnDialog>
          {header}
          <PopoverInfo type="secondary">
            <Emoji name="carpStreamer" /> New to Glitch? Create an account by signing in.
          </PopoverInfo>
          <PopoverInfo type="secondary">
            By signing into Glitch, you agree to our <Link to="/legal/#tos">Terms of Services</Link> and{' '}
            <Link to="/legal/#privacy">Privacy Statement</Link>
          </PopoverInfo>
          <PopoverActions>
            {prompt}
            <SignInPopButton href={facebookAuthLink()} company="Facebook" emoji="facebook" onClick={onClick} />
            <SignInPopButton href={githubAuthLink()} company="GitHub" emoji="octocat" onClick={onClick} />
            <SignInPopButton href={googleAuthLink()} company="Google" emoji="google" onClick={onClick} />
            {slackAuthEnabled && <SignInPopButton href={slackAuthLink()} company="Slack" emoji="slack" onClick={onClick} />}
            <Button size="small" onClick={setDestinationAnd(showView.email)}>
              Sign in with Email <Emoji name="email" />
            </Button>
          </PopoverActions>
          <PopoverActions type="secondary">
            <Button size="small" type="tertiary" matchBackground onClick={setDestinationAnd(showView.signInCode)}>
              Use a sign in code
            </Button>
          </PopoverActions>
        </PopoverDialog>
      )}
    </MultiPopover>
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

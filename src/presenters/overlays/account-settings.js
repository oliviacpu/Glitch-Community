import React from 'react';
import PropTypes from 'prop-types';

import debounce from 'lodash/debounce';
import Pluralize from 'react-pluralize';

import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import Emoji from 'Components/images/emoji';
import Button from 'Components/buttons/button';
import Badge from 'Components/badges/badge';
import TextInput from 'Components/inputs/text-input';
import { Overlay, OverlaySection, OverlayTitle } from 'Components/overlays';
import PasswordStrength from 'Components/password-strength';
import { useCurrentUser } from 'State/current-user';

import PopoverContainer from '../pop-overs/popover-container';

// top worst passwords from Splashdata (https://en.wikipedia.org/wiki/List_of_the_most_common_passwords#cite_note-splashdata2018-10)
// edited to only include those with at least 8-character
// users aren't allowed to set their password to any of these items
const weakPWs = [
  'password',
  '123456789',
  '12345678',
  '11111111',
  'sunshine',
  'iloveyou',
  'princess',
  'football',
  '!@#$%^&*',
  'aa123456',
  'password1',
  'qwerty123',
];

const matchErrorMsg = 'Passwords do not match';
const weakPWErrorMsg = 'Password is too common';

class PasswordSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      passwordConfirm: '',
      passwordStrength: 0,
      weakPasswordErrorMsg: '',
      passwordConfirmErrorMsg: '',
      done: false,
    };
    this.onChangePW = this.onChangePW.bind(this);
    this.onChangePWConfirm = this.onChangePWConfirm.bind(this);
    this.checkPWStrength = this.checkPWStrength.bind(this);
    this.debounceValidatePasswordMatch = debounce(this.validatePasswordMatch.bind(this), 500);
  }

  onChangePW(password) {
    // check if it's a bad password
    this.setState({ password }, () => {
      this.checkPWStrength();
      if (this.state.passwordConfirm) {
        this.validatePasswordMatch();
      }
    });
  }

  onChangePWConfirm(passwordConfirm) {
    this.setState({ passwordConfirm }, () => {
      this.validatePasswordMatch();
    });
  }

  checkPWStrength() {
    // if password is part of weak pw list, show it as weak
    // has capital letter(s) = +1
    // has number(s) = +1
    // has special characters = +1
    // total = strength with 3=strong (💪), 1-2= ok (🙂), 0 = weak (😑)
    const pw = this.state.password;
    let pwStrength = 0;
    if (!weakPWs.includes(pw)) {
      this.setState({ weakPasswordErrorMsg: '' });
      const hasCapScore = /^(?=.*[A-Z])/.test(pw) ? 1 : 0;
      const hasNumScore = /^(?=.*\d)/.test(pw) ? 1 : 0;
      const hasCharScore = /[!@#$%^&*(),.?":{}|<>]/.test(pw) ? 1 : 0;
      pwStrength = hasCapScore + hasNumScore + hasCharScore;
    } else {
      this.setState({ weakPasswordErrorMsg: weakPWErrorMsg });
    }

    this.setState({ passwordStrength: pwStrength });
  }

  validatePasswordMatch() {
    const passwordsMatch = this.state.password === this.state.passwordConfirm;
    if (this.state.passwordConfirm) {
      this.setState({ passwordConfirmErrorMsg: passwordsMatch ? undefined : matchErrorMsg });
    }
  }

  handleSubmit(evt) {
    evt.preventDefault();
    // TODO actually set the password & handle errors if the user has incorrectly entered their current password
    console.log(this.props.user);
    this.setState({ done: true });
  }

  render() {
    const pwMinCharCount = 8;
    const isEnabled = this.state.password.length > pwMinCharCount && !this.state.weakPasswordErrorMsg && !this.state.passwordConfirmErrorMsg;
    const userHasPassword = false; // placeholder fortoggling between set and change password forms. eventually I'm guesing the user objects will have an attribute for whether or not they have a password
    const userRequestedPWreset = false; // placeholder for if user has requested to reset their password
    // correspondings with strength 0=weak, 1=okay, 2=okay, 3=strong
    const { passwordStrength } = this.state;
    return (
      <>
        <Heading tagName="h2">{userHasPassword ? 'Change Password' : 'Set Password'}</Heading>
        <form onSubmit={this.handleSubmit}>
          {userHasPassword && !userRequestedPWreset && (
            <TextInput type="password" labelText="current password" placeholder="current password" value={this.state.password} />
          )}

          <TextInput
            value={this.state.password}
            type="password"
            labelText="password"
            placeholder="new password"
            onChange={this.onChangePW}
            error={this.state.weakPasswordErrorMsg}
          />

          {this.state.password.length >= pwMinCharCount ? (
            <PasswordStrength strength={passwordStrength} />
          ) : (
            this.state.password.length > 0 && (
              <div className="pw-strength">
                <span className="note"><Pluralize count={pwMinCharCount - this.state.password.length} singular="character" /> to go....</span>
              </div>
            )
          )}

          <TextInput
            value={this.state.passwordConfirm}
            type="password"
            labelText="confirm new password"
            placeholder="confirm new password"
            onChange={this.onChangePWConfirm}
            error={this.state.passwordConfirmErrorMsg}
          />

          <Button type="tertiary" size="small" disabled={!isEnabled} submit>
            Set Password
          </Button>

          {this.state.done && <Badge type="success">Successfully set new password</Badge>}
        </form>
      </>
    );
  }
}

PasswordSettings.propTypes = {
  user: PropTypes.object.isRequired,
};

const AccountSettingsOverlay = () => {
  const { currentUser } = useCurrentUser();
  const primaryEmail = currentUser.emails.find((email) => email.primary);
  return (
    <Overlay className="account-settings-overlay">
      <OverlaySection type="info">
        <OverlayTitle>
          Account Settings <Emoji name="key" />
        </OverlayTitle>
      </OverlaySection>
      <OverlaySection type="actions">
        <PasswordSettings user={currentUser} />
      </OverlaySection>
      <OverlaySection type="info">
        <Text>
          Email notifications are sent to <b>{primaryEmail.email}</b>
        </Text>
      </OverlaySection>
    </Overlay>
  );
};

const AccountSettings = ({ children }) => (
  <PopoverContainer>
    {({ visible, setVisible }) => (
      <details onToggle={(evt) => setVisible(evt.target.open)} open={visible} className="overlay-container">
        <summary>{children}</summary>
        <AccountSettingsOverlay />
      </details>
    )}
  </PopoverContainer>
);

export default AccountSettings;

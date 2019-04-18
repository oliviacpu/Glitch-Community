import React from 'react';
import PropTypes from 'prop-types';

import debounce from 'lodash/debounce';

import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import Emoji from 'Components/images/emoji';
import Button from 'Components/buttons/button';
import Badge from 'Components/badges/badge';
import TextInput from 'Components/inputs/text-input';

import PopoverContainer from '../pop-overs/popover-container';

// top worst passwords from Splashdata - edited to only include tyhose with at least 8-character
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

const strengthMsg = ['😑 weak','🙂 okay', '💪 strong'];

const matchErrorMsg = 'Passwords do not match';
const weakPWErrorMsg = 'Password is too common';

class PasswordSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      passwordConfirm: '',
      passwordStrength: 0,
      passwordErrorMsg: '',
      passwordConfirmErrorMsg: '',
      done: false,
    };
    this.onChangePW = this.onChangePW.bind(this);
    this.onChangePWConfirm = this.onChangePWConfirm.bind(this);
    this.checkPWStrength = this.checkPWStrength.bind(this);
    this.debounceValidatePasswordMatch = debounce(this.validatePasswordMatch.bind(this), 500);
    this.setPassword = this.setPassword.bind(this);
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

  setPassword() {
    this.setState({ done: true });
  }

  checkPWStrength() {
    // if password is part of weak pw list, show it as weak
    // has capital letter(s) = +1
    // has number(s) = +1
    // has special characters = +1
    // total = strength with 3=strong (💪), 1-2= ok (🙂), 0 = weak (😑)
    const pw = this.state.password;
    let pwStrength = 0;
    if(!weakPWs.includes(pw)){
      const hasCapScore = /^(?=.*[A-Z])/.test(pw) ? 1 : 0;
      const hasNumScore = /^(?=.*\d)/.test(pw) ? 1 : 0;
      const hasCharScore = /^(?=.*\W])/.test(pw) ? 1 : 0;
      pwStrength = hasCapScore + hasNumScore + hasCharScore;
    }
    console.log(pwStrength);
    this.setState({ passWordErrorMsg: pwStrength === 0 ? weakPWErrorMsg : '' });
    this.setState({ passwordStrength : pwStrength });
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
  }

  render() {
    const pwMinCharCount = 8;
    const progress = Math.round((this.state.password.length / pwMinCharCount) * 100);
    const isEnabled = !this.state.passwordErrorMsg && !this.state.passwordConfirmErrorMsg;
    const userHasPassword = false; // this is just a test toggle to change the form, depending on whether the user has a password. eventually I'm guesing the user objects will have an attribute for whether or not they have a password
    const userRequestedPWreset = false; // placeholder for if user has requested to reset their password

    return (
      <>
        <Heading tagName="h2">{(userHasPassword && !userRequestedPWreset) ? 'Change Password' : 'Set Password'}</Heading>
        <form onSubmit={this.handleSubmit}>
          {(userHasPassword && !userRequestedPWreset) && <TextInput type="password" labelText="current password" placeholder="current password" />}

          <TextInput 
            type="password" 
            labelText="password" 
            placeholder="new password" 
            onChange={this.onChangePW} 
            error={this.state.passwordErrorMsg} 
            />
          
          { this.state.password.length > 0 &&
            <div class="pw-strength">
              <progress value={this.state.passwordStrength} max="3" />
              <span class="pw-strength-word">{strengthMsg[this.state.passwordStrength]}</span>
            </div>
            
          }

          <TextInput
            type="password"
            labelText="confirm new password"
            placeholder="confirm new password"
            onChange={this.onChangePWConfirm}
            error={this.state.passwordConfirmErrorMsg}
          />
          
          {/*
          {this.state.password.length < pwMinCharCount && (
            <>
              <progress value={progress} max="100" />
              <p className="info-description">Your password should contain at least 8 characters</p>
            </>
          )}
          */}

          <Button type="tertiary submit" size="small" onClick={this.setPassword} disabled={!isEnabled}>
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

const OverlayAccountSettings = ({ children, user }) => (
  <PopoverContainer>
    {({ visible, setVisible }) => (
      <details onToggle={(evt) => setVisible(evt.target.open)} open={visible} className="overlay-container">
        <summary>{children}</summary>
        <dialog className="overlay account-settings-overlay">
          <section className="pop-over-info overlay-title">
            Account Settings <Emoji name="key" />
          </section>
          <section className="pop-over-actions pop-over-main">
            {/*
                  <div className="nav-selection">
                    <Button active>Set Password</Button>
                  </div>
                */}
            <div className="nav-content">
              <PasswordSettings user={user} />
            </div>
          </section>
          <section className="pop-over-info">
            <Text>
              Email notifications are sent to <b>{user.email}</b>
            </Text>
          </section>
        </dialog>
      </details>
    )}
  </PopoverContainer>
);

OverlayAccountSettings.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.object.isRequired,
};

export default OverlayAccountSettings;

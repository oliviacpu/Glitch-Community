import React from 'react';
import PropTypes from 'prop-types';

import debounce from 'lodash/debounce';
import zxcvbn from 'zxcvbn';

import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import Emoji from 'Components/images/emoji';
import Button from 'Components/buttons/button';
import TextInput from 'Components/inputs/text-input';

import PopoverContainer from '../pop-overs/popover-container';

/* for displaying password strength */
const scoreWords = ['too weak', 'weak', 'okay', 'good', 'strong'];

class OverlayAccountSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      errorMsg: '',
      done: false,
      pwScore: 0,
    };
    this.onPassChange = this.onPassChange.bind(this);
    this.debounceValidatePasswordMatch = debounce(this.validatePasswordMatch.bind(this), 500);
    this.setPassword = this.setPassword.bind(this);
  }

  onPassChange(password) {
    const evaluation = zxcvbn(password);
    this.setState({ password,
      score: evaluation.score
    });
  }

  validatePasswordMatch(confirmPassword) {
    const passwordsMatch = this.state.password === confirmPassword;
    this.setState({ errorMsg: passwordsMatch ? undefined : 'Passwords do not match' });
  }
  
  handleSubmit(evt){
    evt.preventDefault();
    //TODO actually set the password
  }  
  
  setPassword(){
    console.log('set passowrd');
    this.setState({ done: true });
  }

  render() {
    const {score} = this.state;
    const pwMinCharCount = 8;
    var scoreProgress = this.state.score;
    console.log('scoreProgress ', scoreProgress);
    const progress = Math.round((this.state.password.length / pwMinCharCount) * 100);
    const isEnabled = this.state.password.length > pwMinCharCount && !this.state.errorMsg;    
    
    const ReactPasswordInputProps = {
      placeholder: "password",
      className: 'another-input-prop-class-name',
    };
    
    return (
      <PopoverContainer>
        {({ visible, setVisible }) => (
          <details onToggle={(evt) => setVisible(evt.target.open)} open={visible} className="overlay-container">
            <summary>{this.props.children}</summary>
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
                  <Heading tagName="h2">Set Password</Heading>
                  <form onSubmit={this.handleSubmit}>
                    
                    <TextInput 
                      type="password" 
                      labelText="password" 
                      placeholder="password" 
                      onChange={this.onPassChange} />
                    <progress value={scoreProgress} max="5" className={`score-${score}`} />
                    <span>{scoreWords[score]}</span>
                    
                    <TextInput
                      type="password"
                      labelText="confirm password"
                      placeholder="confirm password"
                      onChange={this.debounceValidatePasswordMatch}
                      error={this.state.errorMsg}
                    />

                    {this.state.password.length < pwMinCharCount && 
                      <>
                        <progress value={progress} max="100" />
                        <p className="info-description">Your password should contain at least 8 characters</p>
                      </>
                    }

                    <Button type="tertiary submit" size="small" onClick={this.setPassword} disabled={!isEnabled}>
                      Set Password
                    </Button>

                    {this.state.done && <Badge type="success">Successfully set new password</Badge>}
                  </form>
                </div>
              </section>
              <section className="pop-over-info">
                <Text>
                  Email notifications are sent to <b>{this.props.user.email}</b>
                </Text>
              </section>
            </dialog>
          </details>
        )}
      </PopoverContainer>
    );
  }
}

OverlayAccountSettings.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.object.isRequired,
};

export default OverlayAccountSettings;

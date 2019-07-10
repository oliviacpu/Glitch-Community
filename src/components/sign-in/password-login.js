import React, { useState, useMemo } from 'react';
import { parseOneAddress } from 'email-addresses';

import Button from 'Components/buttons/button';
import TextInput from 'Components/inputs/text-input';
import Notification from 'Components/notification';

import useDebouncedValue from 'Hooks/use-debounced-value';

import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';

import styles from './styles.styl';

function useEmail() {
  const [email, setEmail] = useState('');
  const debouncedEmail = useDebouncedValue(email, 500);
  const validationError = useMemo(() => {
    const isValidEmail = parseOneAddress(debouncedEmail) !== null;
    return isValidEmail || !debouncedEmail ? null : 'Enter a valid email address';
  }, [debouncedEmail]);
  return [email, setEmail, validationError];
}

const PasswordLoginSection = ({ showTwoFactor, showForgotPassword }) => {
  const [emailAddress, setEmail, emailValidationError] = useEmail();
  const [password, setPassword] = useState('');
  const [working, setWorking] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const api = useAPI();
  const { login } = useCurrentUser();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setWorking(true);
    setErrorMessage(null);

    try {
      const { data } = await api.post('user/login', { emailAddress, password });
      // leave working=true because logging in will hide the sign in pop
      if (data.tfaToken) {
        showTwoFactor(data.tfaToken);
      } else {
        login(data);
      }
    } catch (error) {
      let message = error.response && error.response.data && error.response.data.message;
      if (!message || error.response.status === 401) {
        message = 'Failed to sign in, try again?';
      }
      setErrorMessage(message);
      setWorking(false);
    }
  };

  return (
    <div>
      {!!errorMessage && (
        <Notification type="error" persistent>
          {errorMessage}
        </Notification>
      )}
      <form data-cy="sign-in-form" onSubmit={handleSubmit}>
        <TextInput
          placeholder="your@email.com"
          labelText="email"
          value={emailAddress}
          error={emailValidationError}
          onChange={setEmail}
          disabled={working}
          testingId="sign-in-email"
        />
        <TextInput
          placeholder="password"
          type="password"
          labelText="password"
          value={password}
          onChange={setPassword}
          disabled={working}
          testingId="sign-in-password"
        />
        <div className={styles.submitWrap}>
          <Button size="small" disabled={!emailAddress || !password || emailValidationError || working} submit>
            Sign in
          </Button>
        </div>
      </form>
      <div className={styles.submitWrap}>
        <Button size="small" type="tertiary" onClick={showForgotPassword}>
          Forgot Password
        </Button>
      </div>
    </div>
  );
};

export default PasswordLoginSection;

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Heading from 'Components/text/heading';
import Button from 'Components/buttons/button';
import Badge from 'Components/badges/badge';
import TextInput from 'Components/inputs/text-input';
import NewPasswordInput from 'Components/new-password-input';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';

import styles from './styles.styl';

const PasswordSettings = ({ userHasPassword }) => {
  const api = useAPI();
  const { currentUser, reload } = useCurrentUser();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState(null);
  const [passwordVersion, setPasswordVersion] = useState(1);

  const [state, setState] = useState(null);
  const andClearState = (func) => (...args) => {
    func(...args);
    setState(null);
  };

  const updatePassword = async (event) => {
    event.preventDefault();
    setState('working');
    try {
      await api.post('user/updatePassword', {
        oldPassword,
        newPassword,
      });
      setState('done');
      setOldPassword('');
      setPasswordVersion((v) => v + 1);
      await reload();
    } catch (error) {
      console.error(error);
      setState('error');
    }
  };

  const [resetState, setResetState] = React.useState(null);
  const primaryEmail = currentUser.emails.find((email) => email.primary);
  const resetPassword = async (event) => {
    event.preventDefault();
    setResetState('working');
    try {
      await api.post('email/sendResetPasswordEmail', {
        emailAddress: primaryEmail.email,
      });
      setResetState('done');
    } catch (error) {
      console.error(error);
      setResetState('error');
    }
  };

  const isWorking = state === 'working';

  return (
    <>
      <Heading tagName="h2">{userHasPassword ? 'Change Password' : 'Set Password'}</Heading>
      <form className={styles.passwordForm} onSubmit={updatePassword}>
        {userHasPassword && (
          <TextInput type="password" labelText="current password" placeholder="current password" value={oldPassword} disabled={isWorking} onChange={setOldPassword} />
        )}

        <NewPasswordInput key={passwordVersion} disabled={isWorking} onChange={andClearState(setNewPassword)} />

        <Button type="tertiary" size="small" disabled={!oldPassword || !newPassword || isWorking} submit>
          Set Password
        </Button>

        {state === 'done' && <Badge type="success">Successfully set new password</Badge>}
        {state === 'error' && <Badge type="error">We couldn't set the password</Badge>}
      </form>
      {userHasPassword &&
        <>
          <Heading tagName="h2">Reset Password</Heading>
          <Button type="tertiary" size="small" disabled={resetState === 'working'} onClick={resetPassword}>Send Reset Password Email</Button>

          {resetState === 'done' && <Badge type="success">Sent a reset code to {primaryEmail.email}</Badge>}
          {resetState === 'error' && <Badge type="error">Something went wrong, check your inbox?</Badge>}
        </>
      }
    </>
  );
};

PasswordSettings.propTypes = {
  userHasPassword: PropTypes.bool.isRequired,
};

export default PasswordSettings;

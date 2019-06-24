import React, { useState } from 'react';

import Heading from 'Components/text/heading';
import Button from 'Components/buttons/button';
import TextInput from 'Components/inputs/text-input';
import Notification from 'Components/notification';
import NewPasswordInput from 'Components/new-password-input';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';

import styles from './styles.styl';

const PasswordSettings = () => {
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
  const canSubmit = !isWorking && !!newPassword && (!!oldPassword || !currentUser.passwordEnabled);

  return (
    <>
      <Heading tagName="h2">{currentUser.passwordEnabled ? 'Change Password' : 'Set Password'}</Heading>
      <form className={styles.passwordForm} onSubmit={updatePassword}>
        {currentUser.passwordEnabled && (
          <TextInput type="password" labelText="current password" placeholder="current password" value={oldPassword} disabled={isWorking} onChange={setOldPassword} />
        )}

        <NewPasswordInput key={passwordVersion} disabled={isWorking} onChange={andClearState(setNewPassword)} />

        <Button type="tertiary" size="small" disabled={!canSubmit} submit>
          Set Password
        </Button>

        {state === 'done' && <Notification type="success" persistent>Successfully set new password</Notification>}
        {state === 'error' && <Notification type="error" persistent>We couldn't set the password</Notification>}
      </form>
      {currentUser.passwordEnabled &&
        <>
          <Heading tagName="h2">Reset Password</Heading>
          <Button type="tertiary" size="small" disabled={resetState === 'working'} onClick={resetPassword}>Send Reset Password Email</Button>

          {resetState === 'done' && <Notification type="success" persistent>Sent a reset code to {primaryEmail.email}</Notification>}
          {resetState === 'error' && <Notification type="error" persistent>Something went wrong, check your inbox?</Notification>}
        </>
      }
    </>
  );
};

export default PasswordSettings;

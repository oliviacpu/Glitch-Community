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

  const [state, setState] = useState('idle');
  const andClearS = (func) => (...args) => {
    func(...args);
    setDone(false);
    setError(false);
  };

  const updatePassword = async (event) => {
    event.preventDefault();
    setDone(false);
    try {
      await api.post('user/updatePassword', {
        oldPassword,
        newPassword,
      });
      setDone(true);
      setOldPassword('');
      setPasswordVersion((v) => v + 1);
      await reload();
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    const primaryEmail = currentUser.emails.find((email) => email.primary);
    setDone(false);
    try {
      await api.post('email/sendResetPasswordEmail', {
        emailAddress: primaryEmail.email,
      });
      setDone(true);
      await reload();
    } catch (error) {
      console.error(error);
    }
  };

  const userRequestedPWreset = false; // placeholder for if user has requested to reset their password

  return (
    <>
      <Heading tagName="h2">{userHasPassword ? 'Change Password' : 'Set Password'}</Heading>
      <form className={styles.passwordForm} onSubmit={updatePassword}>
        {userHasPassword && !userRequestedPWreset && (
          <TextInput type="password" labelText="current password" placeholder="current password" value={oldPassword} onChange={setOldPassword} />
        )}

        <NewPasswordInput key={passwordVersion} onChange={andClearDone(setNewPassword)} />

        <Button type="tertiary" size="small" disabled={!oldPassword || !newPassword} submit>
          Set Password
        </Button>

        {done && <Badge type="success">Successfully set new password</Badge>}
        {error && <Badge type="error">We couldn't set the password</Badge>}
      </form>
      {userHasPassword &&
        <>
          <Heading tagName="h2">Reset Password</Heading>
          <Button type="tertiary" size="small" onClick={resetPassword}>Send Reset Password Email</Button>
        </>
      }
    </>
  );
};

PasswordSettings.propTypes = {
  userHasPassword: PropTypes.bool.isRequired,
};

export default PasswordSettings;

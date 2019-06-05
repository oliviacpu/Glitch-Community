import React, { useState } from 'react';
import Pluralize from 'react-pluralize';

import Heading from 'Components/text/heading';
import Button from 'Components/buttons/button';
import Badge from 'Components/badges/badge';
import TextInput from 'Components/inputs/text-input';
import PasswordStrength from 'Components/password-strength';
import useDebouncedValue from 'Hooks/use-debounced-value';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';

import styles from './styles.styl';

const PasswordSettings = () => {
  const api = useAPI();
  const { currentUser, reload } = useCurrentUser();

  return (
    <>
      <Heading tagName="h2">{userHasPassword ? 'Change Password' : 'Set Password'}</Heading>
      <form className={styles.passwordForm} onSubmit={handleSubmit}>
        {userHasPassword && !userRequestedPWreset && (
          <TextInput type="password" labelText="current password" placeholder="current password" value={oldPassword} onChange={setOldPassword} />
        )}

        <TextInput
          value={password}
          type="password"
          labelText="password"
          placeholder="new password"
          onChange={andClearDone(setPassword)}
          error={weakPasswordError ? weakPWErrorMsg : null}
        />

        {password.length >= pwMinCharCount ? (
          <PasswordStrength strength={pwStrength} />
        ) : (
          password.length > 0 && (
            <div className={styles.passwordLength}>
              <span>
                <Pluralize count={pwMinCharCount - password.length} singular="character" /> to go....
              </span>
            </div>
          )
        )}

        <TextInput
          value={password2}
          type="password"
          labelText="confirm new password"
          placeholder="confirm new password"
          onChange={andClearDone(setPassword2)}
          error={passwordConfirmError ? matchErrorMsg : null}
        />

        <Button type="tertiary" size="small" disabled={!isEnabled} submit>
          Set Password
        </Button>

        {done && <Badge type="success">Successfully set new password</Badge>}
      </form>
    </>
  );
};

export default PasswordSettings;

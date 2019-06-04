import React, { useState } from 'react';
import Pluralize from 'react-pluralize';

import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import Emoji from 'Components/images/emoji';
import Button from 'Components/buttons/button';
import Badge from 'Components/badges/badge';
import TextInput from 'Components/inputs/text-input';
import PasswordStrength from 'Components/password-strength';
import useDebouncedValue from 'Hooks/use-debounced-value';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';

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

const PasswordSettings = () => {
  const api = useAPI();
  const { currentUser, reload } = useCurrentUser();

  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [done, setDone] = useState(false);
  const andClearDone = (func) => (...args) => {
    func(...args);
    setDone(false);
  };

  const passwordConfirmError = useDebouncedValue(password && password2 && password !== password2, 500);

  // if password is part of weak pw list, show it as weak
  // has capital letter(s) = +1
  // has number(s) = +1
  // has special characters = +1
  // total = strength with 3=strong (💪), 1-2= ok (🙂), 0 = weak (😑)
  let weakPasswordError = false;
  let pwStrength = 0;
  if (!weakPWs.includes(password)) {
    const hasCapScore = /^(?=.*[A-Z])/.test(password) ? 1 : 0;
    const hasNumScore = /^(?=.*\d)/.test(password) ? 1 : 0;
    const hasCharScore = /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 1 : 0;
    pwStrength = hasCapScore + hasNumScore + hasCharScore;
  } else {
    weakPasswordError = true;
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setDone(false);
    try {
      await api.post('user/updatePassword', {
        oldPassword,
        newPassword: password,
      });
      setDone(true);
      setOldPassword('');
      setPassword('');
      setPassword2('');
      reload();
    } catch (error) {
      console.error(error);
    }
  };

  const pwMinCharCount = 8;
  const isEnabled = password.length > pwMinCharCount && password2 && !weakPasswordError && !passwordConfirmError;
  const userHasPassword = !!currentUser.password;
  const userRequestedPWreset = false; // placeholder for if user has requested to reset their password
  return (
    <>
      <Heading tagName="h2">{userHasPassword ? 'Change Password' : 'Set Password'}</Heading>
      <form onSubmit={handleSubmit}>
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
            <div className="pw-strength">
              <span className="note">
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

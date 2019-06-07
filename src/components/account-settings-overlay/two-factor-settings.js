import React, { useState } from 'react';
import QRCode from 'qrcode';

import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import TextInput from 'Components/inputs/text-input';
import Button from 'Components/buttons/button';
import Badge from 'Components/badges/badge';

import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';

import styles from './styles.styl';

const TwoFactorSettings = () => {
  const { currentUser, reload } = useCurrentUser();

  const api = useAPI();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentUser.twoFactorEnabled);
  const [secret, setSecret] = useState(undefined);
  const [code, setCode] = useState('');
  const [done, setDone] = useState(false);

  const disableTwoFactor = async (evt) => {
    evt.preventDefault();
    setDone(false);
    try {
      await api.post('user/tfa/disable');
      setTwoFactorEnabled(false);
      setDone(true);
      await reload();
    } catch (error) {
      console.error(error);
    }
  };

  const generateSecret = async (evt) => {
    evt.preventDefault();
    setDone(false);
    try {
      const response = await api.post('user/tfa/generateSecret');
      const qrcode = await QRCode.toDataURL(response.data.twoFactorKeyUri);
      setSecret(qrcode);
    } catch (error) {
      console.error(error);
    }
  };

  const verifyCode = async (evt) => {
    evt.preventDefault();
    try {
      await api.post('user/tfa/verifyInitialCode', { code });
      setTwoFactorEnabled(true);
      setDone(true);
      await reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Heading tagName="h2">Two-Factor Authentication</Heading>
      <Text>Protect your account with an additional layer of security.</Text>
      {twoFactorEnabled && <Button type="tertiary" size="small" disabled={done} onClick={disableTwoFactor}>Disable Authenticator App</Button>}
      {!twoFactorEnabled &&
        <>
          <Button type="tertiary" size="small" disabled={!!secret} onClick={generateSecret}>Enable Authenticator App</Button>
          {secret &&
            <form className={styles.passwordForm} onSubmit={verifyCode}>
              <img alt="QR Code" src={secret} />
              <TextInput labelText="Enter Authenticator Code" placeholder="Enter Authenticator Code" maxLength={6} value={code} onChange={setCode} />
              <Button type="tertiary" size="small" disabled={code.length < 6} submit>Verify Initial Code</Button>
            </form>
          }
        </>
      }
      {done && !twoFactorEnabled && <Badge type="success">Successfully disabled two-factor authentication</Badge>}
      {done && twoFactorEnabled && <Badge type="success">Successfully enabled two-factor authentication</Badge>}
    </>
  );
};

export default TwoFactorSettings;

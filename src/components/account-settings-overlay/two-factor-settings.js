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
  const { twoFactorEnabled } = currentUser;

  const api = useAPI();
  const [working, setWorking] = useState(false);
  const [secret, setSecret] = useState(undefined);
  const [code, setCode] = useState('');
  const [done, setDone] = useState(false);

  const disableTwoFactor = async (evt) => {
    evt.preventDefault();
    setDone(false);
    setWorking(true);
    try {
      await api.post('user/tfa/disable');
      await reload();
      setDone(true);
    } catch (error) {
      console.error(error);
    } finally {
      setWorking(false);
    }
  };

  const generateSecret = async (evt) => {
    evt.preventDefault();
    setDone(false);
    setWorking(true);
    try {
      const response = await api.post('user/tfa/generateSecret');
      const qrcode = await QRCode.toDataURL(response.data.twoFactorKeyUri);
      setSecret(qrcode);
    } catch (error) {
      console.error(error);
    } finally {
      setWorking(false);
    }
  };

  const verifyCode = async (evt) => {
    evt.preventDefault();
    setWorking(true);
    try {
      await api.post('user/tfa/verifyInitialCode', { code });
      await reload();
      setSecret(undefined);
      setCode('');
      setDone(true);
    } catch (error) {
      console.error(error);
    } finally {
      setWorking(false);
    }
  };

  return (
    <>
      <Heading tagName="h2">Two-Factor Authentication</Heading>
      <Text>Protect your account with an additional layer of security.</Text>
      {twoFactorEnabled && <Button type="tertiary" size="small" disabled={working} onClick={disableTwoFactor}>Disable Authenticator App</Button>}
      {!twoFactorEnabled &&
        <>
          <Button type="tertiary" size="small" disabled={!!secret || working} onClick={generateSecret}>Enable Authenticator App</Button>
          {secret &&
            <form className={styles.passwordForm} onSubmit={verifyCode}>
              <img alt="QR Code" src={secret} />
              <TextInput labelText="Enter Authenticator Code" placeholder="Enter Authenticator Code" maxLength={6} value={code} disabled={working} onChange={setCode} />
              <Button type="tertiary" size="small" disabled={code.length < 6 || working} submit>Verify Initial Code</Button>
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

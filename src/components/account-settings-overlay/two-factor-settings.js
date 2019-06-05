import React, { useState } from 'react';
import QRCode from 'qrcode';

import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import TextInput from 'Components/inputs/text-input';
import Button from 'Components/buttons/button';
import Badge from 'Components/badges/badge';

import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';

const TwoFactorSettings = () => {
  const { currentUser } = useCurrentUser();

  const api = useAPI();
  const [secret, setSecret] = useState(undefined);
  const [code, setCode] = useState('');
  const [done, setDone] = useState(false);

  const disableTwoFactor = async (evt) => {
    evt.preventDefault();
    try {
      await api.post('user/tfa/disable');
      setDone(true);
    } catch (error) {
      console.error(error);
    }
  };

  const generateSecret = async (evt) => {
    evt.preventDefault();
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
      setDone(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Heading tagName="h2">Two-Factor Authentication</Heading>
      <Text>Protect your account with an additional layer of security.</Text>
      {currentUser.twoFactorEnabled
        ? <Button type="tertiary" disabled={done} onClick={disableTwoFactor}>Disable Authenticator App</Button>
        : <Button type="tertiary" disabled={!!secret} onClick={generateSecret}>Enable Authenticator App</Button>
      }
      {secret &&
        <div>
          <img alt="QR Code" src={secret} />
          <TextInput value={code} labelText="Enter Authenticator Code" placeholder="Enter Authenticator Code" maxLength={6} onChange={setCode} />
          <Button type="tertiary" disabled={!done && code.length < 6} onClick={verifyCode}>
            Verify Initial Code
          </Button>
        </div>
      }
      {done && <Badge type="success">Success</Badge>}
    </>
  );
};

export default TwoFactorSettings;

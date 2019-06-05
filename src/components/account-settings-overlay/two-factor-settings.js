import React, { useState } from 'react';
import QRCode from 'qrcode';

import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import TextInput from 'Components/inputs/text-input';
import Button from 'Components/buttons/button';

import { useAPI } from 'State/api';

const TwoFactorSettings = () => {
  const api = useAPI();
  const [secret, setSecret] = useState(undefined);

  const generateSecret = async (evt) => {
    evt.preventDefault();
    try {
      const response = await api.post('user/tfa/generateSecret');
      const qrcode = await QRCode.toDataURL(response.data.twoFactorKeyUri);
      console.log(qrcode);
      setSecret(qrcode);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Heading tagName="h2">Two-Factor Authentication</Heading>
      <Text>Protect your account with an additional layer of security.</Text>
      <Button type="tertiary" disabled={!!secret} onClick={generateSecret}>
        Enable Authenticator App
      </Button>
      <div>
        <img alt="QR Code" src={secret} />
        <TextInput value="00000" labelText="2FA Code" onChange={setState/>
      </div>
    </>
  );
};

export default TwoFactorSettings;

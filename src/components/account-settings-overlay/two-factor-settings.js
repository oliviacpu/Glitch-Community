import React from 'react';
import 
import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import Button from 'Components/buttons/button';

import { useAPI } from 'State/api';

const TwoFactorSettings = () => {
  const api = useAPI();

  const generateSecret = async (evt) => {
    evt.preventDefault();
    try {
      const response = await api.post('user/tfa/generateSecret');
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Heading tagName="h2">Two-Factor Authentication</Heading>
      <Text>Protect your account with an additional layer of security.</Text>
      <Button type="tertiary" onClick={generateSecret}>
        Enable Authenticator App
      </Button>
    </>
  );
};

export default TwoFactorSettings;

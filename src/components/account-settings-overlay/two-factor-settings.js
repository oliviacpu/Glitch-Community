import React from 'react';

import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import Button from 'Components/buttons/button';

const TwoFactorSettings = () => (
  <>
    <Heading tagName="h2">Two-Factor Authentication</Heading>
    <Text>Protect your account with an additional layer of security.</Text>
    <Button type="tertiary" onClick={() => console.log('hi')}>
      Enable Authenticator App
    </Button>
  </>
);

export default TwoFactorSettings;

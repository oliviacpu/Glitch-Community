import React from 'react';
import PropTypes from 'prop-types';

import Button from 'Components/buttons/button';
import TextInput from 'Components/inputs/text-input';

import { useCurrentUser } from 'State/current-user';

const TwoFactorSignIn = ({ token }) => {
  const { login } = useCurrentUser();
  const [code, setCode] = React.useState('');
  const [working, setWorking] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  const onSubmit = (event) => {
    event.preventDefault();
    setWorking(true);
    setError(null);
  };
  
  return (
    <form onSubmit={onSubmit}>
      <TextInput value={code} onChange={setCode} placeholder="12345" labelText="code" disabled={working} />
      <Button size="small" submit>Submit</Button>
    </form>
  );
};

TwoFactorSignIn.propTypes = {
  token: PropTypes.string.isRequired,
};

export default TwoFactorSignIn;

import React from 'react';
import PropTypes from 'prop-types';

import Button from 'Components/buttons/button';
import TextInput from 'Components/inputs/text-input';
import Notification from 'Components/notification';

import { useAPI } from 'State/api';
// import { useCurrentUser } from 'State/current-user';

const TwoFactorSignIn = ({ initialToken }) => {
  const api = useAPI();
  // const { login } = useCurrentUser();
  const [code, setCode] = React.useState('');
  const [token, setToken] = React.useState(initialToken);
  const [working, setWorking] = React.useState(false);
  const [errorText, setErrorText] = React.useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    setWorking(true);
    setErrorText(null);

    try {
      const { data } = api.post('/user/tfa/verifyCode', { code, token });
      console.log(data);
    } catch (error) {
      if (error && error.response && error.response.data && error.response.data.status === 401) {
        setToken(error.response.data.retryToken);
        setErrorText(error.response.data.message);
        setWorking(false);
      } else {
        
      }
    }
  };

  return (
    <>
      {!!errorText && <Notification type="error" persistent>{errorText}</Notification>}
      <form onSubmit={onSubmit}>
        <TextInput value={code} onChange={setCode} maxLength={6} placeholder="123456" labelText="code" disabled={working} />
        <Button size="small" disabled={working || code.length < 6} submit>Sign in</Button>
      </form>
    </>
  );
};

TwoFactorSignIn.propTypes = {
  initialToken: PropTypes.string.isRequired,
};

export default TwoFactorSignIn;
